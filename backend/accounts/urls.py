from django.urls import path, include
from rest_framework.routers import DefaultRouter

from accounts import views

router = DefaultRouter()
router.register('users',views.UserViewSet,basename='users')
router.register('employer-profiles',views.PublicEmployerProfileViewSet,basename='public_employer_profile')
router.register('candidate-profiles',views.PublicCandidateProfileViewSet,basename='public_candidate_profile')
router.register('provinces', views.ProvinceViewSet, basename='province')
router.register('districts', views.DistrictViewSet, basename='district')
router.register('employer-profiles/me/verification-requests',views.VerificationRequestViewSet,basename='verification_request')

urlpatterns = [
    path('auth/sign-up/',views.SignUpView.as_view()),
    path('auth/login/',views.LoginView.as_view()),
    path('auth/logout/', views.LogoutView.as_view()),
    path('auth/refresh/', views.RefreshTokenView.as_view()),
    path('candidate-profiles/me/',views.UpdateCandidateMeProfileView.as_view()),
    path('candidate-profiles/me/resumes/',views.ListCandidateMeResumeView.as_view()),
    path('candidate-profiles/me/job-applications/', views.ListCandidateMeJobApplicationView.as_view()),
    path('employer-profiles/me/', views.UpdateEmployerMeProfileView.as_view()),
    path('employer-profiles/me/job-posts/', views.ListEmployerMeJobPostView.as_view()),
    path('',include(router.urls))
]