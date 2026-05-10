from django.db.models.aggregates import Count
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets,filters,generics,mixins

from accounts.perms import IsBasicUser, IsEmployer, IsVerifiedEmployer
from jobs.perms import IsJobPostOwner
from jobs.filters import JobPostListFilter
from core.paginators import JobPostPaginator
from jobs.models import JobPost, JobPostStatus
from jobs.serializers import JobPostListSerializer, JobPostDetailSerializer


# Create your views here.

class JobPostViewSet(viewsets.ModelViewSet):
    http_method_names = ['get','post','patch','delete']
    permission_classes = [IsBasicUser]

    queryset = JobPost.objects.filter(active = True).all()
    lookup_field = 'uuid'
    pagination_class = JobPostPaginator
    filter_backends = [DjangoFilterBackend, filters.SearchFilter,filters.OrderingFilter]
    filterset_class = JobPostListFilter

    search_fields = ['title', 'description', 'employer__company_name']
    ordering_fields = ['created_date','salary_max','salary_min']
    ordering = ['-id']

    def get_queryset(self):

        qs = (super().get_queryset().select_related(
            'employer','address',
            'address__ward','address__ward__district','address__ward__district__province'
        ).prefetch_related('career_fields','work_days')
        # .annotate(
        #     application_count = Count('job_applications')
        # )
        )
        if self.action == 'list':
            qs = qs.filter(status = JobPostStatus.OPEN).filter(expiry_date__gt=timezone.now()).all()
        else:
            qs = qs.select_related('employer__user')
        return qs

    def get_serializer_class(self):
        if self.action == 'list':
            return JobPostListSerializer
        return JobPostDetailSerializer

    def perform_create(self, serializer):
        serializer.save(employer = self.request.user.employer_profile)

    def get_permissions(self):
        if self.action in ['create']:
            return [IsVerifiedEmployer()]
        elif self.action in ['update','partial_update','destroy']:
            return [IsJobPostOwner(),IsVerifiedEmployer()]
        return [IsBasicUser()]
