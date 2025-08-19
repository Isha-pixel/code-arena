# CodeArena/codearena_api/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ProfileViewSet, ProblemViewSet, SubmissionViewSet, ContestViewSet
from .views_ai import review_solution   # <-- add this
from .views_extra import register, me_summary, leaderboard, codeforces_contests
from .views_auth import me

router = DefaultRouter()
router.register(r'profiles',    ProfileViewSet)
router.register(r'problems',    ProblemViewSet, basename='problem')
router.register(r'submissions', SubmissionViewSet)
router.register(r'contests',    ContestViewSet)

urlpatterns = [
    # auth & dashboards
    path("register/", register, name="register"),
    path("me/summary/", me_summary, name="me-summary"),
    path("leaderboard/", leaderboard, name="leaderboard"),
    path("contests/codeforces/", codeforces_contests, name="cf-contests"),
    
    # custom endpoint (AI review)
    path("problems/<int:pk>/review/", review_solution, name="problem-review"),
    
    path('auth/me/', me),
    
    # all ViewSet endpoints
    path('', include(router.urls)),
]

# Optional debug to see all routes on startup
for u in router.urls:
    try:
        name = u.name
    except Exception:
        name = None
    print("ROUTE:", u.pattern, "NAME:", name)
