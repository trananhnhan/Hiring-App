from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response

from django.db.models.functions import TruncMonth
from django.db.models import Count
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required

from accounts.models import User, UserRole
from accounts.perms import IsSuperUser, IsEmployer, IsCandidate, IsBasicUser
from applications.models import JobApplication, ApplicationResult
from jobs.models import JobPost
from rest_framework.authentication import SessionAuthentication, BasicAuthentication




@staff_member_required(login_url='/admin/login/')
def moderator_dashboard_view(request):

    return render(request, 'moderator/dashboard.html')



class StatsOverviewAPIView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsSuperUser]

    def get(self, request):
        return Response({
            "total_jobs": JobPost.objects.count(),
            "total_users": User.objects.exclude(role=UserRole.SUPER_USER).count(),
            "total_employers": User.objects.filter(role=UserRole.EMPLOYER).count(),
            "total_applications": JobApplication.objects.count()
        })


class JobsOverTimeAPIView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsSuperUser]

    def get(self, request):
        six_months_ago = timezone.now() - relativedelta(months=6)
        stats = (JobPost.objects
                 .filter(created_date__gte=six_months_ago)
                 .annotate(month=TruncMonth('created_date'))
                 .values('month')
                 .annotate(count=Count('id'))
                 .order_by('month'))

        data = [{"month": item['month'].strftime("%m/%Y"), "count": item['count']} for item in stats]
        return Response(data)


class UsersOverTimeAPIView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsSuperUser]

    def get(self, request):
        six_months_ago = timezone.now() - relativedelta(months=6)
        stats = (User.objects
                 .filter(date_joined__gte=six_months_ago)
                 .annotate(month=TruncMonth('date_joined'))
                 .values('month')
                 .annotate(count=Count('id'))
                 .order_by('month'))

        data = [{"month": item['month'].strftime("%m/%Y"), "count": item['count']} for item in stats]
        return Response(data)


class ApplicationsStatsAPIView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsSuperUser]

    def get(self, request):

        stats = (JobApplication.objects
                 .values('result')
                 .annotate(count=Count('id')))


        data = {item['result']: item['count'] for item in stats}
        return Response(data)

@api_view(['GET'])
@permission_classes([IsBasicUser])
def my_stats_view(request):
    user = request.user
    role = user.role

    if role == UserRole.CANDIDATE:

        applications = JobApplication.objects.filter(resume__candidate_profile__user=user)

        total_applications = applications.count()
        accepted = applications.filter(result=ApplicationResult.ACCEPTED).count()
        rejected = applications.filter(result=ApplicationResult.REJECTED).count()
        reviewing = applications.filter(result=ApplicationResult.REVIEWING).count()
        pending = applications.filter(result=ApplicationResult.PENDING).count()


        acceptance_rate = (accepted / total_applications * 100) if total_applications > 0 else 0.0

        return Response({
            "total_applications": total_applications,
            "accepted": accepted,
            "rejected": rejected,
            'reviewing' : reviewing,
            "pending": pending,
            "acceptance_rate": round(acceptance_rate, 1)
        })


    elif role == UserRole.EMPLOYER:

        total_jobs = JobPost.objects.filter(employer_profile__user=user).count()


        applications = JobApplication.objects.filter(job_post__employer_profile__user=user)

        total_applications = applications.count()
        accepted = applications.filter(result=ApplicationResult.ACCEPTED).count()
        rejected = applications.filter(result=ApplicationResult.REJECTED).count()
        reviewing = applications.filter(result=ApplicationResult.REVIEWING).count()
        pending = applications.filter(result=ApplicationResult.PENDING).count()

        return Response({
            "total_jobs": total_jobs,
            "total_applications": total_applications,
            "accepted": accepted,
            "rejected": rejected,
            'reviewing' : reviewing,
            "pending": pending,
        })