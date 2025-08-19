# api/admin.py
import json
from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Profile, Problem, Submission, Contest, ContestParticipant

# ----- Helpers --------------------------------------------------------------

def _split_blocks(text: str):
    """
    Split text into blocks by lines that are exactly:
      ---           (visible case)
      ---hidden---  (hidden case)
    Returns: list of (block_text, is_hidden)
    """
    lines = (text or "").replace("\r\n", "\n").replace("\r", "\n").split("\n")
    blocks = []
    buf = []
    hidden_flags = []
    pending_hidden = False

    def flush():
        if not buf and not pending_hidden:
            return
        # trim leading/trailing blank lines inside the block
        block = "\n".join(buf).strip("\n")
        blocks.append(block)
        hidden_flags.append(pending_hidden)

    for raw in lines:
        line = raw.strip()
        if line == "---" or line == "---hidden---":
            flush()
            buf = []
            pending_hidden = (line == "---hidden---")
        else:
            buf.append(raw)
    # last block
    flush()

    # if there was no separator at all but we still have content
    if not blocks and (text or "").strip():
        blocks = [ (text.strip("\n")) ]
        hidden_flags = [False]

    return list(zip(blocks, hidden_flags))


def _pair_inputs_outputs(inputs_text: str, outputs_text: str, hide_all_but_first: bool):
    inputs = _split_blocks(inputs_text)
    outputs = _split_blocks(outputs_text)

    if len(inputs) != len(outputs):
        raise forms.ValidationError(
            f"Number of input blocks ({len(inputs)}) does not match "
            f"number of output blocks ({len(outputs)})."
        )

    cases = []
    for idx, ((in_block, in_hidden), (out_block, out_hidden)) in enumerate(zip(inputs, outputs)):
        # hidden rule: either explicit ---hidden--- OR "hide all except first"
        is_hidden = in_hidden or out_hidden or (hide_all_but_first and idx > 0)
        cases.append({
            "input_data": in_block.rstrip("\n"),
            "expected_output": out_block.rstrip("\n"),
            "is_hidden": bool(is_hidden),
        })
    return cases

# ----- Admin ----------------------------------------------------------------

class UserAdmin(BaseUserAdmin):
    pass

admin.site.register(User, UserAdmin)

# api/admin.py  (only the ProblemAdminForm + ProblemAdmin parts replaced)
import json
from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Profile, Problem, Submission, Contest, ContestParticipant

# ---------- helpers ----------

def _split_blocks(text: str):
    """
    Split text into blocks by separator lines:
      ---           (visible)
      ---hidden---  (hidden)
    Returns list of (block_text, is_hidden) preserving order.
    """
    text = (text or "").replace("\r\n", "\n").replace("\r", "\n")
    lines = text.split("\n")

    blocks, flags = [], []
    buf, hidden_flag = [], False

    def flush():
        nonlocal buf, hidden_flag
        if not buf and blocks:  # allow trailing separators w/o content
            hidden_flag = False
            return
        block = "\n".join(buf).strip("\n")
        if block or not blocks:  # keep first even if empty to help validation
            blocks.append(block)
            flags.append(hidden_flag)
        buf, hidden_flag = [], False

    for raw in lines:
        s = raw.strip()
        if s == "---" or s == "---hidden---":
            flush()
            hidden_flag = (s == "---hidden---")
        else:
            buf.append(raw)
    flush()

    if not blocks and text.strip():
        blocks, flags = [text.strip("\n")], [False]

    return list(zip(blocks, flags))


def _pair_inputs_outputs(inputs_text: str, outputs_text: str, hide_all_but_first: bool):
    inputs  = _split_blocks(inputs_text)
    outputs = _split_blocks(outputs_text)

    if len(inputs) != len(outputs):
        raise forms.ValidationError(
            f"Number of input blocks ({len(inputs)}) "
            f"does not match number of output blocks ({len(outputs)})."
        )

    cases = []
    for idx, ((in_block, in_hidden), (out_block, out_hidden)) in enumerate(zip(inputs, outputs)):
        is_hidden = in_hidden or out_hidden or (hide_all_but_first and idx > 0)
        cases.append({
            "input_data": in_block.rstrip("\n"),
            "expected_output": out_block.rstrip("\n"),
            "is_hidden": bool(is_hidden),
        })
    return cases

# ---------- admin form ----------

class ProblemAdminForm(forms.ModelForm):
    # Friendly inputs
    tags_text = forms.CharField(
        label="Tags",
        required=False,
        help_text='Comma-separated or JSON list. Ex: arrays, two pointers  or  ["arrays","two pointers"]',
        widget=forms.Textarea(attrs={"rows": 3})
    )

    test_inputs_text = forms.CharField(
        label="Test inputs",
        required=False,
        widget=forms.Textarea(attrs={"rows": 8}),
        help_text='Separate cases with a line that is exactly --- . Use ---hidden--- to make that case hidden.'
    )
    test_outputs_text = forms.CharField(
        label="Test outputs",
        required=False,
        widget=forms.Textarea(attrs={"rows": 8}),
        help_text='Must have the same number of blocks as inputs, separated the same way.'
    )

    hide_all_but_first = forms.BooleanField(
        label="Hide all except first case",
        required=False,
        help_text="If checked, only the first case is visible to users; others become hidden."
    )

    # Optional raw JSON override
    test_cases_json = forms.CharField(
        label="Test cases json (override)",
        required=False,
        widget=forms.Textarea(attrs={"rows": 8}),
        help_text="If provided, it overrides the boxes above."
    )

    class Meta:
        model = Problem
        # IMPORTANT: exclude JSON fields we will manage ourselves
        exclude = ("author", "tags", "test_cases")

    # hold parsed values so we can assign them in save()
    _parsed_tags: list = None
    _parsed_cases: list = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Prefill tags_text
        tags = getattr(self.instance, "tags", None) or []
        if isinstance(tags, str):
            try:
                tags = json.loads(tags)
            except Exception:
                tags = [t.strip() for t in tags.split(",") if t.strip()]
        if isinstance(tags, list):
            self.initial["tags_text"] = ", ".join(tags)

        # Prefill input/output boxes from saved cases
        cases = getattr(self.instance, "test_cases", None) or []
        if isinstance(cases, str):
            try:
                cases = json.loads(cases)
            except Exception:
                cases = []
        if cases:
            in_lines, out_lines = [], []
            for i, c in enumerate(cases):
                sep = "---hidden---" if c.get("is_hidden") else "---"
                if i > 0:
                    in_lines.append(sep)
                    out_lines.append(sep)
                in_lines.append(c.get("input_data", ""))
                out_lines.append(c.get("expected_output", ""))
            self.initial["test_inputs_text"] = "\n".join(in_lines)
            self.initial["test_outputs_text"] = "\n".join(out_lines)

    # Parse tags once
    def _parse_tags(self, raw: str):
        raw = (raw or "").strip()
        if not raw:
            return []
        if raw.lstrip().startswith("["):
            try:
                val = json.loads(raw)
                if not isinstance(val, list):
                    raise ValueError
                return val
            except Exception:
                raise forms.ValidationError("Tags JSON is invalid.")
        return [t.strip() for t in raw.split(",") if t.strip()]

    def clean(self):
        cleaned = super().clean()

        # parse tags
        self._parsed_tags = self._parse_tags(cleaned.get("tags_text", ""))

        # parse cases
        raw_json = (cleaned.get("test_cases_json") or "").strip()
        if raw_json:
            try:
                cases = json.loads(raw_json)
                if not isinstance(cases, list):
                    raise ValueError
            except Exception:
                raise forms.ValidationError("Test cases json is not a valid JSON list.")
        else:
            cases = _pair_inputs_outputs(
                cleaned.get("test_inputs_text", ""),
                cleaned.get("test_outputs_text", ""),
                cleaned.get("hide_all_but_first", False),
            )

        # sanity
        for idx, c in enumerate(cases, 1):
            if "input_data" not in c or "expected_output" not in c:
                raise forms.ValidationError(f"Case {idx} missing input_data/expected_output.")
            c.setdefault("is_hidden", True)

        self._parsed_cases = cases
        return cleaned

    def save(self, commit=True):
        obj = super().save(commit=False)
        # assign parsed fields to the model
        obj.tags = self._parsed_tags or []
        obj.test_cases = self._parsed_cases or []
        # author defaulting if you want (Admin's save_model also does this)
        if commit:
            obj.save()
        return obj


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    form = ProblemAdminForm
    list_display = ("title", "difficulty", "author", "created_at")
    list_filter  = ("difficulty",)
    search_fields = ("title", "description", "author__username")

    def save_model(self, request, obj, form, change):
        if not obj.pk and not obj.author_id:
            obj.author = request.user
        super().save_model(request, obj, form, change)



# Rest of your registrations unchanged
@admin.register(Contest)
class ContestAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_time', 'end_time')
    search_fields = ('title',)
    filter_horizontal = ('problems',)

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('problem', 'user', 'language', 'verdict', 'submitted_at')
    list_filter = ('verdict', 'language')
    search_fields = ('user__username', 'problem__title')
    readonly_fields = ('submitted_at',)

# --- Admin Site Customization ---
admin.site.site_header = "CodeArena Administration"
admin.site.site_title = "CodeArena Admin Portal"
admin.site.index_title = "Welcome to the CodeArena Admin Portal"

# --- Register Remaining Models ---
admin.site.register(Profile)
admin.site.register(ContestParticipant)
