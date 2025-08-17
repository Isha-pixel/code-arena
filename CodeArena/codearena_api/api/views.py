# #api.views.py
# from django.shortcuts import render
# from rest_framework import viewsets, permissions
# from .models import Profile, Problem, Submission, Contest  # Assuming you have these models
# from .serializers import ProfileSerializer, ProblemSerializer, SubmissionSerializer, ContestSerializer # Assuming you have these serializers

# from rest_framework import viewsets, permissions, status
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from django.conf import settings
# from django.utils import timezone
# import requests, time

# class ProfileViewSet(viewsets.ModelViewSet):
#     queryset = Profile.objects.all()
#     serializer_class = ProfileSerializer
#     permission_classes = [permissions.IsAuthenticated]

# # class ProblemViewSet(viewsets.ModelViewSet):
# #     queryset = Problem.objects.all()
# #     serializer_class = ProblemSerializer
# #     # Allow anyone to view (read-only), but only authenticated users to create/update.
# #     permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# # api/views.py



# EXECUTOR_URL = getattr(settings, "EXECUTOR_URL", "http://127.0.0.1:8001")

# class ProblemViewSet(viewsets.ModelViewSet):
#     queryset = Problem.objects.all()
#     serializer_class = ProblemSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly]

#     @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
#     def submit(self, request, pk=None):
#         """
#         POST /api/problems/{id}/submit/
#         Body: { "code": "...", "language": "python" }
#         """
#         problem = self.get_object()
#         code     = request.data.get("code", "")
#         language = request.data.get("language", "python")

#         if not code.strip():
#             return Response({"detail": "Code cannot be empty."}, status=400)

#         # Run against all test cases (sample + hidden)
#         test_cases = problem.test_cases or []
#         results = []
#         passed = 0
#         total_runtime_ms = 0.0

#         for idx, tc in enumerate(test_cases, start=1):
#             payload = {
#                 "code": code,
#                 "language": language,
#                 "input_data": tc.get("input_data", "")
#             }
#             try:
#                 t0 = time.perf_counter()
#                 r = requests.post(f"{EXECUTOR_URL}/execute", json=payload, timeout=8)
#                 dt = (time.perf_counter() - t0) * 1000.0
#                 total_runtime_ms += dt
#             except requests.Timeout:
#                 results.append({
#                     "test_case": idx,
#                     "passed": False,
#                     "error": "Time Limit Exceeded"
#                 })
#                 break
#             except Exception as e:
#                 results.append({
#                     "test_case": idx,
#                     "passed": False,
#                     "error": f"Executor error: {e}"
#                 })
#                 break

#             if r.status_code != 200:
#                 results.append({
#                     "test_case": idx,
#                     "passed": False,
#                     "error": f"Executor HTTP {r.status_code}"
#                 })
#                 break

#             out = r.json()
#             stdout = (out.get("output") or "").strip()
#             stderr = (out.get("error") or "").strip()
#             expected = (tc.get("expected_output") or "").strip()

#             if stderr:
#                 results.append({
#                     "test_case": idx,
#                     "passed": False,
#                     "error": stderr
#                 })
#                 break

#             ok = stdout == expected
#             if ok:
#                 passed += 1

#             results.append({
#                 "test_case": idx,
#                 "passed": ok,
#                 "expected": expected,
#                 "actual": stdout,
#                 "runtime_ms": round(dt, 2)
#             })

#         # Verdict
#         if passed == len(test_cases):
#             verdict = Submission.Verdict.ACCEPTED
#             score = 100
#         elif passed > 0:
#             verdict = Submission.Verdict.WRONG_ANSWER  # keep simple for now
#             score = int(100.0 * passed / max(1, len(test_cases)))
#         else:
#             verdict = Submission.Verdict.WRONG_ANSWER
#             score = 0

#         # Save submission
#         sub = Submission.objects.create(
#             user=request.user,
#             problem=problem,
#             code=code,
#             language=language,
#             verdict=verdict,
#             execution_time=round(total_runtime_ms/1000.0, 3),
#             memory_used=None
#         )

#         return Response({
#             "submission_id": sub.id,
#             "verdict": verdict,
#             "passed": passed,
#             "total": len(test_cases),
#             "results": results,
#             "total_runtime_ms": round(total_runtime_ms, 2),
#             "score": score
#         })


# class SubmissionViewSet(viewsets.ModelViewSet):
#     queryset = Submission.objects.all()
#     serializer_class = SubmissionSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         # Users can only see their own submissions
#         if self.request.user.is_authenticated:
#             return Submission.objects.filter(user=self.request.user)
#         return Submission.objects.none() # Don't show anything for anonymous users

#     def perform_create(self, serializer):
#         # Associate the submission with the logged-in user
#         serializer.save(user=self.request.user)

# class ContestViewSet(viewsets.ModelViewSet):
#     queryset = Contest.objects.all()
#     serializer_class = ContestSerializer
#     # Allow anyone to view (read-only), but only authenticated users to create/update.
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# api/views.py
from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from django.conf import settings
from .models import Profile, Problem, Submission, Contest
from .serializers import ProfileSerializer, ProblemSerializer, SubmissionSerializer, ContestSerializer

from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.conf import settings
import requests, time

from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
    IsAdminUser,
)

import requests, time

def _norm(s: str) -> str:
    if s is None:
        return ""
    return s.replace("\r\n", "\n").rstrip()

class ProblemRunView(APIView):
    """
    POST /api/problems/<pk>/run/
    body: { code, language, stdin }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk: int):
        code = request.data.get("code") or ""
        language = (request.data.get("language") or "").lower()
        stdin = request.data.get("stdin") or ""

        if language not in ("python", "cpp", "java"):
            return Response({"error": "Unsupported language"}, status=400)

        url = getattr(settings, "EXECUTOR_URL", "http://127.0.0.1:8001/execute")
        t0 = time.perf_counter()
        try:
            r = requests.post(url, json={
                "code": code,
                "language": language,
                "input_data": stdin
            }, timeout=10)
        except requests.RequestException as e:
            return Response({"error": f"Executor unreachable: {e}"}, status=502)

        elapsed = int((time.perf_counter() - t0) * 1000)
        if r.status_code != 200:
            return Response({"error": f"Executor error: {r.text}"}, status=r.status_code)

        data = r.json()
        return Response({
            "stdout": data.get("output", ""),
            "stderr": data.get("error", ""),
            "timeMs": elapsed
        })

class ProblemSubmitView(APIView):
    """
    POST /api/problems/<pk>/submit/
    body: { code, language }
    Runs all test_cases on the problem and returns verdict + per-case results.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk: int):
        problem = get_object_or_404(Problem, pk=pk)
        code = request.data.get("code") or ""
        language = (request.data.get("language") or "").lower()

        if language not in ("python", "cpp", "java"):
            return Response({"error": "Unsupported language"}, status=400)

        tests = problem.test_cases or []
        results = []
        passed = 0
        total_time = 0
        url = getattr(settings, "EXECUTOR_URL", "http://127.0.0.1:8001/execute")

        for i, tc in enumerate(tests, start=1):
            stdin = tc.get("input_data", "") or ""
            exp = _norm(tc.get("expected_output", "") or "")
            hidden = bool(tc.get("is_hidden", True))

            t0 = time.perf_counter()
            try:
                r = requests.post(url, json={
                    "code": code,
                    "language": language,
                    "input_data": stdin
                }, timeout=10)
            except requests.RequestException as e:
                results.append({
                    "test_case": i,
                    "passed": False,
                    "error": f"Executor unreachable: {e}",
                    "runtime_ms": 0,
                    "visibility": "hidden" if hidden else "public",
                })
                continue

            elapsed = int((time.perf_counter() - t0) * 1000)
            total_time += elapsed

            if r.status_code != 200:
                results.append({
                    "test_case": i,
                    "passed": False,
                    "error": f"Executor error: {r.text}",
                    "runtime_ms": elapsed,
                    "visibility": "hidden" if hidden else "public",
                })
                continue

            data = r.json()
            out = _norm(data.get("output", "") or "")
            err = _norm(data.get("error", "") or "")
            ok = (out == exp) and (err == "")

            if ok: passed += 1

            item = {
                "test_case": i,
                "passed": ok,
                "runtime_ms": elapsed,
                "visibility": "hidden" if hidden else "public",
            }
            if not hidden:
                item["expected"] = exp
                item["actual"] = out
                if err:
                    item["error"] = err
            else:
                if err and not ok:
                    item["error"] = err

            results.append(item)

        verdict = "Accepted" if passed == len(tests) else "Wrong Answer"
        if any(("error" in r and not r["passed"]) for r in results):
            verdict = "Runtime Error"

        # Optional: save Submission if user is logged in
        if request.user.is_authenticated:
            Submission.objects.create(
                problem=problem,
                user=request.user,
                code=code,
                language=language,
                verdict=verdict,
                execution_time=total_time / 1000.0,
            )

        return Response({
            "verdict": verdict,
            "passed": passed,
            "total": len(tests),
            "total_runtime_ms": total_time,
            "results": results
        })


def _normalize(s: str) -> str:
    if s is None:
        return ""
    # Normalize newlines and trim trailing space/newlines
    return s.replace("\r\n", "\n").rstrip()

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]



def _norm(s: str) -> str:
    if s is None:
        return ""
    return s.replace("\r\n", "\n").rstrip()

class ProblemViewSet(viewsets.ModelViewSet):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    # def get_permissions(self):
    #     # Public read; auth for everything else (submit/run/custom actions)
    #     if self.action in ["list", "retrieve"]:
    #         return [AllowAny()]
    #     return [IsAuthenticated()]
    def get_permissions(self):
        # DRF standard actions: list/retrieve/create/update/partial_update/destroy
        if self.action in ('list', 'retrieve'):
            perms = [AllowAny]
        elif self.action in ('create', 'update', 'partial_update', 'destroy'):
            perms = [IsAdminUser]
        # your custom actions (rename to match your @action names)
        elif self.action in ('submit', 'run', 'ai_review'):
            perms = [IsAuthenticated]
        else:
            # default for anything else
            perms = [IsAuthenticated]
        return [p() for p in perms]

    def _exec(self, language: str, code: str, stdin: str):
        url = getattr(settings, "EXECUTOR_URL", "http://127.0.0.1:8001/execute")
        t0 = time.perf_counter()
        try:
            r = requests.post(url, json={
                "code": code,
                "language": language,
                "input_data": stdin
            }, timeout=10)
        except requests.RequestException as e:
            return {"error": f"Executor unreachable: {e}"}, 502
        elapsed = int((time.perf_counter() - t0) * 1000)
        if r.status_code != 200:
            return {"error": f"Executor error: {r.text}", "timeMs": elapsed}, r.status_code
        data = r.json()
        return {"stdout": data.get("output", ""), "stderr": data.get("error", ""), "timeMs": elapsed}, 200

    @action(detail=True, methods=["post"], url_path="run",
            permission_classes=[permissions.AllowAny])
    def run(self, request, pk=None):
        language = (request.data.get("language") or "").lower()
        code     = request.data.get("code") or ""
        stdin    = request.data.get("stdin") or ""
        if language not in ("python", "cpp", "java"):
            return Response({"error": "Unsupported language"}, status=400)
        payload, status = self._exec(language, code, stdin)
        return Response(payload, status=status)

    @action(detail=True, methods=["post"], url_path="submit",
            permission_classes=[permissions.AllowAny])
    def submit(self, request, pk=None):
        language = (request.data.get("language") or "").lower()
        code     = request.data.get("code") or ""
        if language not in ("python", "cpp", "java"):
            return Response({"error": "Unsupported language"}, status=400)

        problem = self.get_object()
        tests = problem.test_cases or []
        results, passed, total_time = [], 0, 0

        for i, tc in enumerate(tests, start=1):
            stdin = tc.get("input_data", "") or ""
            exp   = _norm(tc.get("expected_output", "") or "")
            hidden = bool(tc.get("is_hidden", True))

            payload, status = self._exec(language, code, stdin)
            if status != 200:
                results.append({
                    "test_case": i, "passed": False,
                    "error": payload.get("error", "Executor error"),
                    "runtime_ms": payload.get("timeMs", 0),
                    "visibility": "hidden" if hidden else "public",
                })
                continue

            out = _norm(payload.get("stdout", "") or "")
            err = _norm(payload.get("stderr", "") or "")
            ok  = (out == exp) and (err == "")

            total_time += int(payload.get("timeMs", 0))
            if ok: passed += 1

            item = {
                "test_case": i, "passed": ok,
                "runtime_ms": int(payload.get("timeMs", 0)),
                "visibility": "hidden" if hidden else "public",
            }
            if not hidden:
                item["expected"] = exp
                item["actual"]   = out
                if err: item["error"] = err
            else:
                if err and not ok: item["error"] = err

            results.append(item)

        verdict = "Accepted" if passed == len(tests) else "Wrong Answer"
        if any(("error" in r and not r["passed"]) for r in results):
            verdict = "Runtime Error"

        if request.user.is_authenticated:
            Submission.objects.create(
                problem=problem, user=request.user,
                code=code, language=language,
                verdict=verdict, execution_time=total_time/1000.0
            )

        return Response({
            "verdict": verdict,
            "passed": passed,
            "total": len(tests),
            "total_runtime_ms": total_time,
            "results": results
        })



class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Submission.objects.filter(user=self.request.user)
        return Submission.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ContestViewSet(viewsets.ModelViewSet):
    queryset = Contest.objects.all()
    serializer_class = ContestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
