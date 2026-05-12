from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('resumes', views.ResumeViewSet, basename='resume')

router.register('job-applications', views.JobApplicationViewSet, basename='job-application')

# Gom tất cả vào urlpatterns
urlpatterns = [
    path('', include(router.urls)),
]