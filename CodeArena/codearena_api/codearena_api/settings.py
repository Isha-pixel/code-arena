"""
Django settings for codearena_api project.
Django 3.2.x
"""

import os
from pathlib import Path
from datetime import timedelta
import certifi

# -----------------------------------------------------------------------------
# Base paths
# -----------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env (simple loader)
env_path = BASE_DIR / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        if "=" in line and not line.strip().startswith("#"):
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())

# -----------------------------------------------------------------------------
# Core security
# -----------------------------------------------------------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "dev-insecure-change-me")  # set on server
DEBUG = os.getenv("DEBUG", "0") == "1"

# Comma-separated env like: "backend.codearena.icu,localhost,127.0.0.1"
ALLOWED_HOSTS = [
    h.strip() for h in os.getenv(
        "ALLOWED_HOSTS",
        "backend.codearena.icu,localhost,127.0.0.1"
    ).split(",") if h.strip()
]

# If you terminate TLS at Nginx/ALB
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# -----------------------------------------------------------------------------
# Apps
# -----------------------------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    "djongo",

    # Local
    "api",
]

# -----------------------------------------------------------------------------
# Middleware (corsheaders must be high, before CommonMiddleware)
# -----------------------------------------------------------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "codearena_api.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "codearena_api.wsgi.application"

# -----------------------------------------------------------------------------
# Database (Djongo / MongoDB)
# Move credentials to env in production!
# -----------------------------------------------------------------------------

MONGODB_URI = os.getenv("MONGODB_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "codearena_db")

DATABASES = {
    "default": {
        "ENGINE": "djongo",
        "NAME": MONGO_DB_NAME,
        "ENFORCE_SCHEMA": False,
        "CLIENT": {
            "host": MONGODB_URI,
            "tlsCAFile": certifi.where(),  # <- important for Atlas
        },
    }
}

# -----------------------------------------------------------------------------
# Auth / DRF / JWT
# -----------------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": True,
}

AUTH_USER_MODEL = "api.User"

# -----------------------------------------------------------------------------
# Internationalization
# -----------------------------------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_L10N = True
USE_TZ = True

# -----------------------------------------------------------------------------
# Static files
# -----------------------------------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"  # for collectstatic on the server

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# -----------------------------------------------------------------------------
# CORS / CSRF
# -----------------------------------------------------------------------------
# Frontend origins
_default_cors = "https://codearena.icu,https://code-arena-oj.vercel.app,http://localhost:5173,http://127.0.0.1:5173"
CORS_ALLOWED_ORIGINS = [
    o.strip() for o in os.getenv("CORS_ORIGINS", _default_cors).split(",") if o.strip()
]

# You use Authorization header (JWT), not cookies:
CORS_ALLOW_CREDENTIALS = False

CSRF_TRUSTED_ORIGINS = [
    "https://codearena.icu",
    "https://backend.codearena.icu",
    "https://code-arena-oj.vercel.app",
    "https://code-arena-oj-git-main-ishas-projects-20d9a318.vercel.app",
    "https://code-arena-grz6to8lu-ishas-projects-20d9a318.vercel.app",
]

CORS_ALLOWED_ORIGIN_REGEXES = [r"^https://.*\.vercel\.app$"]

APPEND_SLASH = True   # default in Django, but being explicit avoids drift

# -----------------------------------------------------------------------------
# Executor service (API -> local dockerized executor)
# -----------------------------------------------------------------------------
EXECUTOR_URL = os.getenv("EXECUTOR_URL", "http://127.0.0.1:8001/execute")

# -----------------------------------------------------------------------------
# Misc env-backed keys
# -----------------------------------------------------------------------------
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")

if not DEBUG:
    SECURE_SSL_REDIRECT = True                      # redirect http -> https
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000                  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
