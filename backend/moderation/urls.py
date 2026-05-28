from django.urls import path
from . import views

app_name = 'moderator'

urlpatterns = [

    path('dashboard/', views.moderator_dashboard_view, name='dashboard'),


    path('api/moderator/stats/overview/', views.StatsOverviewAPIView.as_view(), name='stats-overview'),
    path('api/moderator/stats/jobs-over-time/', views.JobsOverTimeAPIView.as_view(), name='stats-jobs'),
    path('api/moderator/stats/users-over-time/', views.UsersOverTimeAPIView.as_view(), name='stats-users'),
    path('api/moderator/stats/applications/', views.ApplicationsStatsAPIView.as_view(), name='stats-applications'),
    path('stats/me/', views.my_stats_view, name='my-stats'),
]