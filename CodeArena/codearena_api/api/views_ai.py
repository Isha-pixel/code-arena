# CodeArena/codearena_api/api/views_ai.py
import os
import json
from typing import Any

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny  # swap to IsAuthenticated if you want auth
from rest_framework.response import Response
from rest_framework import status

import google.generativeai as genai

from .models import Problem  # keep this import path; adjust if your model lives elsewhere
from .ai_review import run_once

# ---- Gemini setup ----
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

def _safe_text(resp: Any) -> str:
    """
    Try to pull a plain text string from the Gemini response.
    """
    try:
        if getattr(resp, "text", None):
            return resp.text
        # fallback to joining parts if .text absent
        cand = resp.candidates[0]
        parts = getattr(cand.content, "parts", [])
        return "".join(getattr(p, "text", "") for p in parts)
    except Exception:
        return ""

def _parse_json(s: str) -> dict:
    """
    Be tolerant if the model adds stray text. Find outermost JSON.
    """
    s = s.strip()
    try:
        return json.loads(s)
    except Exception:
        # Try to salvage by slicing from first '{' to last '}'
        start = s.find("{")
        end = s.rfind("}")
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(s[start : end + 1])
            except Exception:
                pass
        raise

def make_prompt(problem: "Problem", payload: dict, run) -> str:
    statement   = getattr(problem, "description", "") or ""
    input_fmt   = getattr(problem, "input_format", "") or ""
    output_fmt  = getattr(problem, "output_format", "") or ""
    constraints = getattr(problem, "constraints", "") or ""

    sample_io = ""
    ti = getattr(problem, "test_inputs", "") or ""
    to = getattr(problem, "test_outputs", "") or ""
    if ti and to:
        sample_io = f"\nSample Inputs:\n{ti}\nSample Outputs:\n{to}\n"

    return f"""
You are an expert competitive-programming reviewer.

### Problem
Title: {problem.title}
Statement:
{statement}

Input Format:
{input_fmt}

Output Format:
{output_fmt}

Constraints:
{constraints}
{sample_io}

### Submission
Language: {payload.get("language")}
Code (verbatim):

{payload.get("code")}

### One Test Run (from platform)
stdin:

{payload.get("stdin", "")}

stdout (program output):

{run.output.strip()}

stderr (program errors, if any):

{run.error.strip()}

### What you must return (JSON):
- "verdict": one of ["correct", "wrong-answer", "runtime-error", "time-limit", "style-issue", "incomplete"]
- "issues": bullet list of concrete problems (logic, edge cases, complexity, IO format, etc.)
- "suggestions": bullet list of actionable fixes
- "complexity": estimated time & space complexity (if inferable)
- "explanation": a concise paragraph of what’s wrong and a correct approach.

Return ONLY valid JSON. Do not add code fences or extra prose.
"""

@api_view(["POST"])
@permission_classes([AllowAny])  # change to IsAuthenticated if your frontend sends auth header
def review_solution(request, pk: int):
    """
    POST body:
    {
      "language": "python" | "cpp" | "java",
      "code": "....",
      "stdin": "...."   # optional; will run once with this
    }
    """
    problem = get_object_or_404(Problem, pk=pk)

    language = (request.data.get("language") or "").lower()
    code     = request.data.get("code", "")
    stdin    = request.data.get("stdin", "")

    if language not in {"python", "cpp", "java"}:
        return Response({"detail": "Unsupported language"}, status=400)
    if not code.strip():
        return Response({"detail": "Empty code"}, status=400)

    # 1) Run once so the model can see concrete behavior
    run = run_once(language, code, stdin)

    # 2) Ask Gemini
    prompt = make_prompt(problem, request.data, run)
    try:
        model = genai.GenerativeModel(MODEL)
        resp = model.generate_content(prompt, safety_settings=None)
        raw  = _safe_text(resp)
        parsed = _parse_json(raw)
    except Exception as e:
        return Response(
            {"detail": "AI error", "raw": locals().get("raw", str(e))},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    return Response(
        {
            "verdict":     parsed.get("verdict", "incomplete"),
            "issues":      parsed.get("issues", []),
            "suggestions": parsed.get("suggestions", []),
            "complexity":  parsed.get("complexity", ""),
            "explanation": parsed.get("explanation", ""),
            "run": {"stdout": run.output, "stderr": run.error},
        },
        status=200,
    )
