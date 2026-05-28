
from rest_framework import mixins, viewsets, status
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.models import UserRole
from accounts.perms import IsCandidate, IsBasicUser
from applications import serializers
from applications.models import JobApplication, Resume, ApplicationResult
from applications.perms import IsResumeOwner, DetailResumePermission, IsApplicationParticipant
from applications.serializers import DetailResumeSerializer
from interactions.models import CandidateComment, EmployerComment
from interactions.serializers import CandidateCommentWriteSerializer, EmployerCommentWriteSerializer, \
    JobApplicationReceivedCommentSerializer





class JobApplicationViewSet(mixins.CreateModelMixin,
                            mixins.RetrieveModelMixin,
                            mixins.UpdateModelMixin,
                            mixins.DestroyModelMixin,
                            viewsets.GenericViewSet):
    lookup_field = 'uuid'
    http_method_names = ['get','post','patch','delete']

    def get_permissions(self):
        if self.action == 'create':
            return [IsCandidate()]
        if self.action == 'destroy':
            return [IsCandidate(), IsApplicationParticipant()]
        return [IsApplicationParticipant()]

    def get_queryset(self):
        user = self.request.user

        qs = JobApplication.objects.select_related('resume','job_post',
                                                   'resume__candidate_profile__user',
                                                   'job_post__employer_profile__user')
        if user.role == UserRole.CANDIDATE:
            return qs.filter(resume__candidate_profile = user.candidate_profile)
        elif user.role == UserRole.EMPLOYER:
            return qs.filter(job_post__employer_profile = user.employer_profile)

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

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.user.role == UserRole.EMPLOYER and instance.result == ApplicationResult.PENDING:
            instance.result = ApplicationResult.REVIEWING
            instance.save(update_fields=['result'])

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(methods=['post', 'delete','get'], detail=True, url_path='comments',permission_classes=[IsApplicationParticipant])
    def handle_comment(self, request, uuid=None):
        job_application = self.get_object()

        is_candidate = request.user.role == UserRole.CANDIDATE
        CommentModel = CandidateComment if is_candidate else EmployerComment
        author_profile = request.user.candidate_profile if is_candidate else request.user.employer_profile
        SerializerClass = CandidateCommentWriteSerializer if is_candidate else EmployerCommentWriteSerializer

        existing_comment = CommentModel.objects.filter(job_application=job_application).first()
        if request.method == 'GET':
            job_application = JobApplication.objects.select_related(
                'candidate_comment', 'employer_comment',
                'job_post',
                'resume__candidate_profile__user',
                'job_post__employer_profile__user'
            ).get(uuid=uuid)
            return Response(JobApplicationReceivedCommentSerializer(
                instance=job_application,
                context={'request': request}
            ).data, status=status.HTTP_200_OK)

        if request.method == 'DELETE':
            if not existing_comment:
                return Response({"detail": "Chưa có đánh giá nào để xóa."}, status=status.HTTP_404_NOT_FOUND)
            existing_comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        if request.method == 'POST':
            serializer = SerializerClass(data=request.data, context={'job_application': job_application,'request' : request})
            if serializer.is_valid():
                serializer.save(job_application=job_application, comment_author=author_profile)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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