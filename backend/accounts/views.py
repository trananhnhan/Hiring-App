from django.db.models.aggregates import Count
import requests
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, generics, status, permissions, filters, mixins
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User, UserRole, EmployerProfile, CandidateProfile, Province, District, Ward, \
    VerificationRequest, VerificationStatus, CompanyAddress, CompanyVerificationImage
from accounts import serializers
from accounts.perms import IsCandidate, IsEmployer, IsBasicUser, IsModerator, IsEmployerOrModerator
from accounts.serializers import UpdateEmployerProfileSerializer, UpdateCandidateProfileSerializer, \
    PublicEmployerProfileSerializer, PublicCandidateProfileSerializer, ProvinceSerializer, DistrictSerializer, \
    WardSerializer, CreateVerificationRequestSerializer, RetrieveVerificationRequestSerializer, \
    ListVerificationRequestSerializer, MiniUserSerializer, CompanyAddressSerializer, \
    UpdateVerificationRequestSerializer, CompanyVerificationImageSerializer
from applications.filters import ResumeListFilter
from applications.models import Resume, ResumeStatus, JobApplication
from applications.serializers import SimpleResumeSerializer, ListApplicationSerializer, \
    CandidateJobApplicationListSerializer
from core import paginators

from core.paginators import BasePaginator
from core.settings import env
from interactions.models import CandidateComment, EmployerComment, Follow
from interactions.serializers import EmployerReceivedCommentSerializer, CandidateReceivedCommentSerializer, \
    FollowerListSerializer, FollowingListSerializer
from jobs.filters import JobPostListOwnerFilter
from jobs.models import JobPost, JobPostStatus
from jobs.serializers import JobPostListSerializer



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


class ListCandidateMeJobApplicationView(generics.ListAPIView):

    serializer_class = CandidateJobApplicationListSerializer
    permission_classes = [IsCandidate]
    pagination_class = BasePaginator
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = ['result']
    search_fields = ['job_post__title', 'job_post__employer_profile__company_name']
    ordering_fields = ['created_date']
    ordering = ['-created_date']

    def get_queryset(self):
        candidate_profile = self.request.user.candidate_profile
        return JobApplication.objects.filter(
            resume__candidate_profile=candidate_profile
        ).select_related(
            'job_post',
            'job_post__employer_profile',
            'resume'
        )

class PublicCandidateProfileViewSet(mixins.RetrieveModelMixin,viewsets.GenericViewSet):
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
            serializer = SimpleResumeSerializer(page,many=True,context=self.get_serializer_context())
            return self.get_paginated_response(serializer.data)
        serializer = SimpleResumeSerializer(queryset, many=True,context=self.get_serializer_context())
        return Response(serializer.data)

    @action(methods=['get'], detail=True, url_path='comments')
    def get_received_comments(self, request, username=None):
        candidate_profile = self.get_object()

        queryset = EmployerComment.objects.filter(
            job_application__resume__candidate_profile=candidate_profile
        ).select_related(
            'job_application__job_post',
            'comment_author',
            'comment_author__user'
        ).order_by('-created_date')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = EmployerReceivedCommentSerializer(page, many=True,context=self.get_serializer_context())
            return self.get_paginated_response(serializer.data)

        serializer = CandidateReceivedCommentSerializer(page, many=True,context=self.get_serializer_context())
        return Response(serializer.data)

    @action(methods=['get'], detail=True, url_path='following')
    def get_following(self, request, username=None):

        candidate_profile = self.get_object()

        queryset = Follow.objects.filter(
            follower=candidate_profile
        ).select_related(
            'followed',
            'followed__user'
        ).order_by('-created_date')

        context = self.get_serializer_context()
        if hasattr(request.user,'candidate_profile'):
            context['followed_employer_ids'] = set(Follow.objects.filter(follower = request.user.candidate_profile)
                                                   .values_list('followed_id',flat=True))
        else:
            context['followed_employer_ids'] = set()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = FollowingListSerializer(page, many=True,context=context )
            return self.get_paginated_response(serializer.data)

        serializer = FollowingListSerializer(queryset, many=True,context=context )
        return Response(serializer.data)


class UpdateEmployerMeProfileView(generics.UpdateAPIView):
    serializer_class = UpdateEmployerProfileSerializer
    permission_classes = [IsEmployer]
    http_method_names = ['patch']

    def get_object(self):
        return self.request.user.employer_profile

class CompanyAddressViewSet(mixins.CreateModelMixin,mixins.UpdateModelMixin ,mixins.DestroyModelMixin,viewsets.GenericViewSet):
    http_method_names = ['post', 'patch', 'delete']
    serializer_class = CompanyAddressSerializer
    permission_classes = [IsEmployer]
    lookup_field = 'uuid'
    def get_queryset(self):
        return CompanyAddress.objects.filter(
            employer_profile__user=self.request.user
        )

    def get_object(self):
        return get_object_or_404(
            self.get_queryset(), uuid=self.kwargs['uuid']
        )

    def perform_create(self, serializer):
        serializer.save(employer_profile=self.request.user.employer_profile)



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
        qs = (JobPost.objects.filter(employer_profile=self.request.user.employer_profile
                                     ).select_related(
            'employer_profile', 'address',
            'address__ward', 'address__ward__district', 'address__ward__district__province'
        ).prefetch_related('career_fields', 'work_days')
        .annotate(
            application_count=Count('job_applications')
        ))
        return qs

class PublicEmployerProfileViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
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

    @action(methods=['get'], detail=True, url_path='comments')
    def get_received_comments(self, request, username=None):
        employer_profile = self.get_object()

        queryset = CandidateComment.objects.filter(
            job_application__job_post__employer_profile=employer_profile
        ).select_related(
            'job_application__job_post',
            'comment_author',
            'comment_author__user'
        ).order_by('-created_date')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = EmployerReceivedCommentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = EmployerReceivedCommentSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['post'], detail=True, url_path='follow', permission_classes=[IsCandidate])
    def follow(self, request, username=None):

        employer_profile = self.get_object()
        candidate_profile = request.user.candidate_profile

        follow_instance = Follow.objects.filter(
            follower=candidate_profile,
            followed=employer_profile
        ).first()

        if follow_instance:
            follow_instance.delete()
            return Response(
                {"is_following": False, "message": "Đã bỏ theo dõi công ty."},
                status=status.HTTP_200_OK
            )

        Follow.objects.create(
            follower=candidate_profile,
            followed=employer_profile
        )
        return Response(
            {"is_following": True, "message": "Đã theo dõi công ty."},
            status=status.HTTP_201_CREATED
        )

    @action(methods=['get'], detail=True, url_path='followers')
    def get_followers(self, request, username=None):
        employer_profile = self.get_object()

        queryset = Follow.objects.filter(
            followed=employer_profile
        ).select_related(
            'follower',
            'follower__user'
        ).order_by('-created_date')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = FollowerListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = FollowerListSerializer(queryset, many=True)
        return Response(serializer.data)



class UserViewSet(mixins.ListModelMixin,viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MiniUserSerializer
    filter_backends = [filters.SearchFilter]
    pagination_class = paginators.UserPaginator
    search_fields = ['username']
    def get_queryset(self):
        return User.objects.exclude(pk=self.request.user.pk).filter(role__in = [UserRole.EMPLOYER,UserRole.CANDIDATE])
    @action(detail=False, methods=["get", "patch"], url_path="me",serializer_class = serializers.CurrentUserSerializer)
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
                    'employer_profile__verification_requests'
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


class ProvinceViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Province.objects.all().order_by('name')
    serializer_class = ProvinceSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['get'], url_path='districts')
    def get_districts(self, request, pk=None):
        province = self.get_object()
        districts = District.objects.filter(province=province).order_by('name')
        serializer = DistrictSerializer(districts, many=True)
        return Response(serializer.data)


class DistrictViewSet( viewsets.GenericViewSet):

    queryset = District.objects.all().order_by('name')
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DistrictSerializer
    @action(detail=True, methods=['get'], url_path='wards')
    def get_wards(self, request, pk=None):

        district = self.get_object()
        wards = Ward.objects.filter(district=district).order_by('name')

        serializer = WardSerializer(wards, many=True)
        return Response(serializer.data)



class VerificationRequestViewSet(mixins.CreateModelMixin,
                                 mixins.ListModelMixin,
                                 mixins.RetrieveModelMixin,
                                 mixins.DestroyModelMixin,
                                 viewsets.GenericViewSet):


    lookup_field = 'uuid'

    def get_permissions(self):
        if self.action == 'verify':
            return [IsModerator()]
        if self.action in ['retrieve', 'list']:
            return [IsEmployerOrModerator()]
        return [IsEmployer()]

    def get_queryset(self):
        user = self.request.user
        if user.role == UserRole.MODERATOR:
            qs = VerificationRequest.objects.all().order_by('-created_date')
        else:
            qs = VerificationRequest.objects.filter(
                employer_profile=user.employer_profile
            ).order_by('-created_date')

        if self.action == 'retrieve':
            return qs.prefetch_related('images')
        return qs

    def get_serializer_class(self):

        if self.action == 'create':
            return CreateVerificationRequestSerializer
        elif self.action == 'list':
            return ListVerificationRequestSerializer
        else:
            return RetrieveVerificationRequestSerializer


    def perform_destroy(self, instance):

        if instance.status != VerificationStatus.PENDING:
            raise ValidationError({"detail": "Chỉ có thể hủy yêu cầu đang trong trạng thái chờ duyệt (PENDING)."})
        instance.delete()

    @action(methods=['patch'], detail=True, url_path='verify', permission_classes=[IsModerator])
    def verify(self, request, uuid=None):
        instance = self.get_object()
        serializer = UpdateVerificationRequestSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class SignUpView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = [AllowAny]

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request,*args,**kwargs):
        access_token = request.data.get('access_token')
        refresh_token = request.data.get('refresh_token')
        if not access_token or not refresh_token:
           return Response({"detail": "tokens missing."},
                                status=status.HTTP_400_BAD_REQUEST)
        payload_refresh = {
            'token' : refresh_token,
            'client_id': env('OAUTH2_CLIENT_ID'),
            'client_secret': env('OAUTH2_CLIENT_SECRET'),
        }
        payload_access = {
            'token' : access_token,
            'client_id': env('OAUTH2_CLIENT_ID'),
            'client_secret': env('OAUTH2_CLIENT_SECRET'),
        }
        revoke_endpoint = request.build_absolute_uri('/o/revoke_token')
        try:
            oauth_response = requests.post(revoke_endpoint,data=payload_refresh)
            response_data = oauth_response.json()

            if oauth_response.status_code == 200:
                oauth_response = requests.post(revoke_endpoint, data=payload_access)
                response_data = oauth_response.json()
                if oauth_response.status_code == 200:
                    return Response(response_data, status=status.HTTP_200_OK)
                else:
                    return Response(response_data, status=oauth_response.status_code)

            else:
                return Response(response_data, status=oauth_response.status_code)

        except requests.exceptions.RequestException as e:
            print(f"connection error: {e}")
            return Response({"detail": "connection error"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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

class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response({"detail": "refresh_token missing."},
                            status=status.HTTP_400_BAD_REQUEST)
        payload = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
            'client_id': env('OAUTH2_CLIENT_ID'),
            'client_secret': env('OAUTH2_CLIENT_SECRET'),
        }
        token_endpoint = request.build_absolute_uri('/o/token/')
        try:
            oauth_response = requests.post(token_endpoint, data=payload)
            response_data = oauth_response.json()
            return Response(response_data, status=oauth_response.status_code)
        except requests.exceptions.RequestException as e:
            return Response({"detail": "connection error"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
