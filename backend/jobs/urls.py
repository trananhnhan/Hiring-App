from django.urls import path, include
from rest_framework.routers import DefaultRouter

from jobs import views

router = DefaultRouter()
router.register('job-posts',views.JobPostViewSet,basename='job_post')
router.register('career-fields',views.ListCareerFieldView,basename='career-field')


urlpatterns = [
    path('',include(router.urls))
]