from django.urls import path, include
from rest_framework.routers import DefaultRouter

from jobs import views

router = DefaultRouter()
router.register('job-posts',views.JobPostViewSet,basename='current-user')


urlpatterns = [
    path('',include(router.urls))
]