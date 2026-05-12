
from rest_framework import mixins, viewsets
from rest_framework import permissions

from accounts.models import UserRole
from accounts.perms import IsCandidate, IsBasicUser
from applications import serializers
from applications.models import JobApplication, Resume
from applications.perms import IsResumeOwner, DetailResumePermission
from applications.serializers import DetailResumeSerializer


# Create your views here.

class JobApplicationViewSet(mixins.CreateModelMixin,
                            mixins.RetrieveModelMixin,
                            mixins.UpdateModelMixin,
                            mixins.DestroyModelMixin,
                            viewsets.GenericViewSet):
    lookup_field = 'uuid'
    http_method_names = ['get','post','patch','delete']

    def get_permissions(self):
        if self.action in ['create','destroy']:
            return [IsCandidate()]
        else:
            return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        qs = JobApplication.objects.select_related('resume','job_post')
        if user.role == UserRole.CANDIDATE:
            return qs.select_related('resume__candidate_profile').filter(resume__candidate_profile = user.candidate_profile)
        elif user.role == UserRole.EMPLOYER:
            return qs.select_related('resume__candidate_profile__user').filter(job_post__employer_profile = user.employer_profile)

        return qs.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return serializers.CreateApplicationSerializer

        if self.action == 'partial_update':
            if getattr(self.request.user, 'role', None) == UserRole.CANDIDATE:
                return serializers.UpdateCandidateApplicationSerializer
            elif getattr(self.request.user, 'role', None) == UserRole.EMPLOYER:
                return serializers.UpdateEmployerApplicationSerializer

        return serializers.RetrieveApplicationSerializer


class ResumeViewSet(mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    viewsets.GenericViewSet):
    serializer_class = DetailResumeSerializer
    permission_classes = [IsBasicUser]
    lookup_field = 'uuid'
    http_method_names = ['get', 'post', 'patch', 'delete']
    queryset = Resume.objects.filter(active = True).select_related('candidate_profile__user').prefetch_related('career_fields')

    def get_permissions(self):
        if self.action == 'retrieve':
            return [DetailResumePermission()]
        elif self.action == 'create':
            return [IsCandidate()]
        elif self.action in ['partial_update', 'destroy']:
            return [IsCandidate(), IsResumeOwner()]
        else:
            return [IsBasicUser()]


    def perform_create(self, serializer):
        serializer.save(candidate_profile=self.request.user.candidate_profile)