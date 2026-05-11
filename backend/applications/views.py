
from rest_framework import mixins, viewsets
from rest_framework import permissions

from accounts.models import UserRole
from accounts.perms import IsCandidate
from applications import serializers
from applications.models import JobApplication


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
            if self.request.user.role == UserRole.CANDIDATE:
                return serializers.UpdateCandidateApplicationSerializer
            elif self.request.user.role == UserRole.EMPLOYER:
                return serializers.UpdateEmployerApplicationSerializer

        return serializers.RetrieveApplicationSerializer
