from django.urls import path, include
from rest_framework.routers import DefaultRouter

from accounts import views

router = DefaultRouter()
router.register('users',views.CurrentUserViewSet,basename='users')
router.register('employer-profiles',views.PublicEmployerProfileView,basename='public_employer_profile')
router.register('candidate-profiles',views.PublicCandidateProfileView,basename='public_candidate_profile')


urlpatterns = [
    path('auth/sign-up',views.SignUpView.as_view()),
    path('auth/login',views.LoginView.as_view()),
    path('candidate-profiles/me',views.UpdateCandidateMeProfileView.as_view()),
    path('candidate-profiles/me/resumes/',views.ListCandidateMeResumeView.as_view()),
    path('employer-profiles/me/', views.UpdateEmployerMeProfileView.as_view()),
    path('employer-profiles/me/job-posts', views.ListEmployerMeJobPostView.as_view()),
    path('',include(router.urls))
]