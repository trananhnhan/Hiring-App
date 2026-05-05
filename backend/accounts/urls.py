from django.urls import path, include
from rest_framework.routers import DefaultRouter

from accounts import views

router = DefaultRouter()
router.register('users',views.CurrentUserViewSet,basename='current-user')


urlpatterns = [
    path('sign-up',views.SignUpView.as_view()),
    path('',include(router.urls))
]