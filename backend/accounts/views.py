from django.db.models.aggregates import Count
import requests
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, generics, status, permissions, filters, mixins
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User, UserRole, EmployerProfile, CandidateProfile
from accounts import serializers
from accounts.perms import IsCandidate, IsEmployer, IsBasicUser
from accounts.serializers import UpdateEmployerProfileSerializer, UpdateCandidateProfileSerializer, \
    PublicEmployerProfileSerializer, PublicCandidateProfileSerializer
from applications.filters import ResumeListFilter
from applications.models import Resume, ResumeStatus
from applications.serializers import SimpleResumeSerializer

from core.paginators import BasePaginator
from core.settings import env
from jobs.filters import JobPostListOwnerFilter
from jobs.models import JobPost, JobPostStatus
from jobs.serializers import JobPostListSerializer


# candidate
class UpdateCandidateMeProfileView(generics.UpdateAPIView):
    serializer_class = UpdateCandidateProfileSerializer
    permission_classes = [IsCandidate]
    http_method_names = ['patch']

    def get_object(self):
        return self.request.user.candidate_profile


class ListCandidateMeResumeView(generics.ListAPIView):
    serializer_class = SimpleResumeSerializer
    permission_classes = [IsCandidate]
    pagination_class = BasePaginator

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ResumeListFilter
    search_fields = ['title', 'description']
    ordering_fields = ['id', 'updated_date']
    ordering = ['-updated_date']

    def get_queryset(self):
        return Resume.objects.filter(candidate_profile=self.request.user.candidate_profile)

class PublicCandidateProfileView(mixins.RetrieveModelMixin,viewsets.GenericViewSet):
    serializer_class = PublicCandidateProfileSerializer
    permission_classes = [IsBasicUser]
    pagination_class = BasePaginator
    lookup_field = 'username'

    def get_object(self):
        username = self.kwargs.get('username')

        queryset = CandidateProfile.objects.select_related('user')

        return get_object_or_404(queryset, user__username=username)
    @action(methods=['get'],detail=True,url_path='resumes')
    def get_resumes(self,request,username = None):
        candidate_profile = self.get_object()
        queryset = (Resume.objects.filter(candidate_profile = candidate_profile).
                    filter(status = ResumeStatus.PUBLIC)).order_by('-updated_date')
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = SimpleResumeSerializer(page,many=True)
            return self.get_paginated_response(serializer.data)
        serializer = SimpleResumeSerializer(queryset, many=True)
        return Response(serializer.data)

# employer
class UpdateEmployerMeProfileView(generics.UpdateAPIView):
    serializer_class = UpdateEmployerProfileSerializer
    permission_classes = [IsEmployer]
    http_method_names = ['patch']

    def get_object(self):
        return self.request.user.employer_profile


class ListEmployerMeJobPostView(generics.ListAPIView):
    serializer_class = JobPostListSerializer
    permission_classes = [IsEmployer]
    pagination_class = BasePaginator

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = JobPostListOwnerFilter
    search_fields = ['title', 'description', 'employer_profile__company_name']
    ordering_fields = ['id', 'salary_max', 'salary_min', 'updated_date']
    ordering = ['-updated_date']

    def get_queryset(self):
        qs = (JobPost.objects.filter(candidate_profile=self.request.user.candidate_profile
                                     ).select_related(
            'employer_profile', 'address',
            'address__ward', 'address__ward__district', 'address__ward__district__province'
        ).prefetch_related('career_fields', 'work_days')
        .annotate(
            application_count=Count('job_applications')
        ))
        return qs



class PublicEmployerProfileView(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = PublicEmployerProfileSerializer
    permission_classes = [IsBasicUser]
    pagination_class = BasePaginator
    lookup_field = 'username'

    def get_object(self):
        username = self.kwargs.get('username')

        queryset = EmployerProfile.objects.select_related('user').prefetch_related('addresses')

        return get_object_or_404(queryset, user__username=username)

    @action(methods=['get'], detail=True, url_path='job-posts')
    def get_job_posts(self, request, username=None):
        employer_profile = self.get_object()

        queryset = (JobPost.objects.filter(employer_profile=employer_profile).filter(status=JobPostStatus.OPEN)
        .select_related(
            'employer_profile', 'address',
            'address__ward', 'address__ward__district', 'address__ward__district__province'
        ).prefetch_related('career_fields', 'work_days').order_by('-id')
        .annotate(
            application_count=Count('job_applications')
        )
        )
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = JobPostListSerializer(page,many=True)
            return self.get_paginated_response(serializer.data)

        serializer = JobPostListSerializer(queryset, many=True)
        return Response(serializer.data)



# user
class CurrentUserViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["get", "patch"], url_path="me")
    def current_user(self, request):
        user = request.user
        if request.method == "GET":
            user_id = user.id
            role = user.role
            if role == UserRole.CANDIDATE:
                user_profile = User.objects.select_related('candidate_profile').get(pk=user_id)
            elif role == UserRole.EMPLOYER:
                user_profile = User.objects.select_related('employer_profile').prefetch_related(
                    'employer_profile__addresses',
                    'employer_profile__verification_images'
                ).get(pk=user_id)
            else:
                user_profile = request.user

            current_user_serializer = serializers.CurrentUserSerializer(instance=user_profile)
            return Response(current_user_serializer.data, status=status.HTTP_200_OK)
        elif request.method == "PATCH":
            current_user_serializer = serializers.CurrentUserSerializer(user, data=request.data, partial=True)
            current_user_serializer.is_valid(raise_exception=True)
            current_user_serializer.save()
            return Response(current_user_serializer.data, status=status.HTTP_200_OK)
        else:
            print("something went wrong !!")


# auth
class SignUpView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = [AllowAny]


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"detail": "username or password missing."},
                            status=status.HTTP_400_BAD_REQUEST)

        payload = {
            'grant_type': 'password',
            'username': username,
            'password': password,
            'client_id': env('OAUTH2_CLIENT_ID'),
            'client_secret': env('OAUTH2_CLIENT_SECRET'),
        }
        token_endpoint = request.build_absolute_uri('/o/token/')

        try:
            oauth_response = requests.post(token_endpoint, data=payload)
            response_data = oauth_response.json()

            if oauth_response.status_code == 200:
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response(response_data, status=oauth_response.status_code)

        except requests.exceptions.RequestException as e:
            print(f"connection error: {e}")
            return Response({"detail": "connection error"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
