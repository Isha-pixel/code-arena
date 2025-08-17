# CodeArena/codearena_api/api/views_extra.py
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple
import time, requests

from django.contrib.auth import get_user_model
from django.db.models import Count, Q, Max
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from .models import Problem, Submission, Profile

User = get_user_model()

AC_VALUES = {"AC", "Accepted", "OK", "CORRECT", "correct"}

# ---------- Auth: Register ----------
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    """
    Body: {username, password, email?}
    Creates user, returns {access, refresh}
    """
    username = (request.data.get("username") or "").strip()
    password = request.data.get("password") or ""
    email    = (request.data.get("email") or "").strip()

    if not username or not password:
        return Response({"detail": "username & password required"}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({"detail": "username already taken"}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    Profile.objects.get_or_create(user=user)

    refresh = RefreshToken.for_user(user)
    return Response({"access": str(refresh.access_token), "refresh": str(refresh)})


# ---------- Me Summary (dashboard/profile widgets) ----------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_summary(request):
    """
    Returns stats for the logged-in user:
    - total_submissions
    - solved_count (distinct problems with AC verdict)
    - difficulty_breakdown (easy/medium/hard solved)
    - recent_submissions (last 10)
    """
    u = request.user

    subs = Submission.objects.filter(user=u).select_related("problem").order_by("-submitted_at")
    total_submissions = subs.count()
    solved_q = subs.filter(verdict__in=AC_VALUES)
    solved_count = solved_q.values("problem").distinct().count()

    # difficulty breakdown (if your Problem has difficulty field)
    diff = (
        solved_q.values("problem__difficulty")
        .annotate(cnt=Count("problem", distinct=True))
    )
    difficulty_breakdown = {
        (row["problem__difficulty"] or "Unknown"): row["cnt"] for row in diff
    }

    recent = [
        {
            "id": s.id,
            "problem_id": s.problem_id,
            "problem_title": getattr(s.problem, "title", ""),
            "language": s.language,
            "verdict": s.verdict,
            "execution_time": s.execution_time,
            "submitted_at": s.submitted_at,
        }
        for s in subs[:10]
    ]

    return Response({
        "user": {"id": u.id, "username": u.username, "email": u.email},
        "total_submissions": total_submissions,
        "solved_count": solved_count,
        "difficulty_breakdown": difficulty_breakdown,
        "recent_submissions": recent,
    })


# ---------- Leaderboard ----------
@api_view(["GET"])
@permission_classes([AllowAny])
def leaderboard(request):
    """
    Top N users by number of distinct problems solved (AC verdict).
    """
    N = int(request.query_params.get("limit", 50))
    qs = (
        Submission.objects.filter(verdict__in=AC_VALUES)
        .values("user__id", "user__username")
        .annotate(
            solved=Count("problem", distinct=True),
            last_time=Max("submitted_at"),
        )
        .order_by("-solved", "-last_time")[:N]
    )

    data = [
        {
            "user_id": row["user__id"],
            "username": row["user__username"],
            "solved": row["solved"],
            "last_submission": row["last_time"],
        }
        for row in qs
    ]
    return Response({"results": data})


# ---------- Codeforces contests (simple proxy with tiny cache) ----------
_CF_CACHE: Dict[str, Any] = {"t": 0, "data": []}

@api_view(["GET"])
@permission_classes([AllowAny])
def codeforces_contests(request):
    """
    Returns upcoming contests (next ~20) from Codeforces.
    We cache for 5 minutes to avoid rate limiting.
    """
    now = time.time()
    if now - _CF_CACHE["t"] > 300:
        try:
            r = requests.get("https://codeforces.com/api/contest.list?gym=false", timeout=8)
            j = r.json()
            if j.get("status") == "OK":
                _CF_CACHE["t"] = now
                _CF_CACHE["data"] = j.get("result", [])
        except Exception:
            pass

    results = []
    for c in _CF_CACHE["data"]:
        if c.get("phase") == "BEFORE":  # upcoming
            cid = c["id"]
            start = c.get("startTimeSeconds")
            results.append({
                "id": cid,
                "name": c.get("name"),
                "start_unix": start,
                "duration_seconds": c.get("durationSeconds"),
                "visit_url": f"https://codeforces.com/contest/{cid}",
            })
        if len(results) >= 20:
            break

    return Response({"upcoming": results})
