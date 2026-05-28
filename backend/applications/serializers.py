from django.utils import timezone
from rest_framework import serializers
from core import shared
from accounts.models import UserRole
from accounts.serializers import MiniUserSerializer, MiniEmployerSerializer, SimpleUserSerializer, \
    MiniUserEmployerSerializer
from applications.models import JobApplication, Resume, ResumeStatus, ApplicationResult
from jobs.models import JobPost, JobPostStatus, CareerField
from jobs.serializers import SimpleJobPostSerializer, CareerFieldSerializer



class SimpleResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['title','updated_date','status','uuid']

class DetailResumeSerializer(shared.CloudinaryImageMixin,SimpleResumeSerializer):
    cloudinary_fields = ['resume_img']
    candidate_user = MiniUserSerializer(read_only=True,source='resume.candidate_profile.user')
    career_fields = CareerFieldSerializer(read_only=True, many=True)
    is_owner = serializers.SerializerMethodField(read_only=True)
    career_fields_id = serializers.PrimaryKeyRelatedField(
        queryset= CareerField.objects.all(),
        source= 'career_fields',
        write_only= True,
        many=True
    )
    class Meta:
        model = SimpleResumeSerializer.Meta.model
        fields = SimpleResumeSerializer.Meta.fields + ['candidate_user','resume_img','description','status','career_fields','career_fields_id','is_owner']

    def get_is_owner(self,obj):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated or not hasattr(request.user,'candidate_profile'):
            return False
        candidate_profile = request.user.candidate_profile
        return obj.candidate_profile == candidate_profile



class ListApplicationSerializer(serializers.ModelSerializer):
    candidate_user = MiniUserSerializer(read_only=True,source='resume.candidate_profile.user')

    class Meta:
        fields = ['uuid','created_date','result','candidate_user']
        model = JobApplication


class CandidateJobApplicationListSerializer(serializers.ModelSerializer):
    job_post = SimpleJobPostSerializer(read_only=True)
    resume = SimpleResumeSerializer(read_only=True)
    employer_profile = MiniEmployerSerializer(read_only=True, source='job_post.employer_profile')

    class Meta:
        model = JobApplication
        fields = [
            'uuid','job_post','resume','employer_profile', 'result', 'created_date'
        ]

class SimpleApplicationSerializer(serializers.ModelSerializer):
    resume = SimpleResumeSerializer(read_only=True)

    class Meta:
        fields = ['uuid','resume','created_date','updated_date','message','result','result_detail']
        model = JobApplication


class RetrieveApplicationSerializer(SimpleApplicationSerializer):
    candidate = MiniUserSerializer(read_only=True,source='resume.candidate_profile.user')
    employer = MiniUserEmployerSerializer(read_only=True,source='job_post.employer_profile.user')
    job_post = SimpleJobPostSerializer(read_only=True)

    class Meta:
        fields = SimpleApplicationSerializer.Meta.fields + ['candidate','employer','job_post']
        model = SimpleApplicationSerializer.Meta.model


class UpdateCandidateApplicationSerializer(serializers.ModelSerializer):
    resume = serializers.SlugRelatedField('uuid',queryset=Resume.objects.all())
    class Meta:
        fields = ['message','resume']
        model = JobApplication

    def validate_resume(self, value):
        request = self.context.get('request')
        if value.candidate_profile != request.user.candidate_profile:
            raise serializers.ValidationError('resume không thuộc về bạn')
        return value

    def validate(self, attrs):
        if self.instance.result != ApplicationResult.PENDING:
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

        if not self.instance.result in editable_results:
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

