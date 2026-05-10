from django.utils import timezone
from rest_framework import serializers

from accounts.models import UserRole
from accounts.serializers import MiniUserSerializer
from applications.models import JobApplication, Resume, ResumeStatus, ApplicationResult
from jobs.models import JobPost, JobPostStatus
from jobs.serializers import SimpleJobPostSerializer

class SimpleResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['title','updated_date']

class ListApplicationSerializer(serializers.ModelSerializer):
    candidate_user = MiniUserSerializer(read_only=True)

    class Meta:
        fields = ['created_date','result','candidate_user']
        model = JobApplication

class SimpleApplicationSerializer(serializers.ModelSerializer):
    resume = SimpleResumeSerializer(read_only=True, source='resume.candidate_profile.user')

    class Meta:
        fields = ['resume','created_date','message','result','result_detail']
        model = JobApplication

class DetailCandidateApplicationSerializer(serializers.ModelSerializer):
    job_post = SimpleJobPostSerializer(read_only=True)
    class Meta:
        fields = ['job_post']
        model = JobApplication

class DetailEmployerApplicationSerializer(serializers.ModelSerializer):
    candidate_user = MiniUserSerializer(source='resume.candidate.user',read_only=True)

    class Meta:
        fields = ['candidate_user']
        model = JobApplication

class DetailApplicationSerializer(SimpleApplicationSerializer):
    detail = serializers.SerializerMethodField()

    class Meta:
        fields = SimpleApplicationSerializer.Meta.fields + ['detail']
        model = SimpleApplicationSerializer.Meta.model

    def get_detail(self,obj):
        request = self.context.get('request')
        if request.user.role == UserRole.CANDIDATE:
            return DetailCandidateApplicationSerializer(obj).data
        elif request.user.role == UserRole.EMPLOYER:
            return DetailEmployerApplicationSerializer(obj).data
        return None

class UpdateCandidateApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        fields = ['message']
        model = JobApplication
    def validate(self, attrs):
        if self.instance.application_result != ApplicationResult.PENDING:
            raise serializers.ValidationError({
                'result' : 'chỉ có thể thay đổi nội dung khi kết quả đang là PENDING'
            })
        return attrs

class UpdateEmployerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['result','result_detail']
        model = JobApplication

    def validate(self, attrs):
        editable_results = [ApplicationResult.PENDING, ApplicationResult.REVIEWING]
        result = attrs.get('result')

        if result and result == ApplicationResult.PENDING:
            raise serializers.ValidationError({
                'result': 'không được thay đổi result về Pending'
            })

        if not self.instance.application_result in editable_results:
            raise serializers.ValidationError({
                'result' : 'chỉ có thể thay đổi nội dung khi kết quả đang là Pending hoặc Reviewing'
            })
        return attrs




class CreateApplicationSerializer(serializers.ModelSerializer):
    job_post = serializers.SlugRelatedField(
        slug_field='uuid',
        queryset=JobPost.objects.all()
    )
    resume = serializers.SlugRelatedField(
        slug_field='uuid',
        queryset=Resume.objects.all()
    )

    class Meta:
        model = JobApplication
        fields = ['job_post', 'resume', 'message']

    def validate(self, attrs):
        job_post = attrs.get('job_post')
        resume = attrs.get('resume')
        candidate_profile = self.context['request'].user.candidate_profile

        if resume.candidate_profile  != candidate_profile:
            raise serializers.ValidationError({
                "resume": "Bạn không có quyền sử dụng hồ sơ này."
            })

        if resume.status == ResumeStatus.DRAFT:
            raise serializers.ValidationError({
                "resume": "Không thể nộp hồ sơ đang ở trạng thái Nháp (DRAFT)."
            })

        if job_post.status != JobPostStatus.OPEN:
            raise serializers.ValidationError({
                "job_post": "Bài đăng tuyển dụng này hiện không nhận hồ sơ."
            })

        if job_post.expiry_date and job_post.expiry_date <= timezone.now():
            raise serializers.ValidationError({
                "job_post": "Bài đăng tuyển dụng này đã hết hạn ứng tuyển."
            })

        if JobApplication.objects.filter(job_post=job_post,resume=resume).exists():
            raise serializers.ValidationError({
                "detail": "Bạn đã nộp hồ sơ này cho vị trí này rồi."
            })
        return attrs