from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import UserViewSet

router = DefaultRouter()



urlpatterns = [
    path('sign-up', UserViewSet.as_view({'post' : 'create'}),name='sign-up'),
]