"""codearena_api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # 1. Admin Site
    path('admin/', admin.site.urls),

    # 2. API Endpoints for your 'api' app
    # This passes any request starting with 'api/' to the urls.py file inside your 'api' app.
    path('api/', include('api.urls')),

    # 3. JWT Token Authentication Endpoints
    # The client will send a POST request with username/password to this URL to get a token.
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # The client will send a POST request with a refresh token to this URL to get a new access token.
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
