from rest_framework import serializers

from accounts.serializers import MiniUserSerializer, MiniEmployerSerializer
from applications.models import ApplicationResult, JobApplication
from interactions.models import CandidateComment, EmployerComment, Follow
from jobs.serializers import MiniJobPostSerializer, SimpleJobPostSerializer


class EmployerReceivedCommentSerializer(serializers.ModelSerializer):
    job_post = MiniJobPostSerializer(read_only=True, source='job_application.job_post')
    author = MiniUserSerializer(read_only=True, source='comment_author.user')

    class Meta:
        model = CandidateComment
        fields = ['id','review', 'recommendation_rate', 'created_date', 'author', 'job_post']

class EmployerCommentWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerComment
        fields = ['review', 'recommendation_rate']

    def validate(self, attrs):
        application = self.context['job_application']
        user = self.context['request'].user

        if application.job_post.employer_profile != user.employer_profile:
            raise serializers.ValidationError({'detail' : "Bạn không có quyền đánh giá đơn ứng tuyển của người khác."})
        if EmployerComment.objects.filter(job_application=application).exists():
            raise serializers.ValidationError({'detail':'Đã có đánh giá cho đơn này.'})

        if application.result not in [ApplicationResult.ACCEPTED, ApplicationResult.REJECTED]:
            raise serializers.ValidationError({'detail':"Chỉ được phép đánh giá khi đơn đã có kết quả (Accepted/Rejected)."})

        return attrs

class CandidateReceivedCommentSerializer(serializers.ModelSerializer):
    job_post = MiniJobPostSerializer(read_only=True, source='job_application.job_post')
    author = MiniUserSerializer(read_only=True, source='comment_author.user')

    class Meta:
        model = EmployerComment
        fields = ['id','review', 'recommendation_rate', 'created_date', 'author', 'job_post']

class MiniEmployerCommentSerializer(serializers.ModelSerializer):
    author = MiniUserSerializer(read_only=True, source='comment_author.user')
    class Meta:
        model = EmployerComment
        fields = ['id','review', 'recommendation_rate', 'created_date', 'author']

class MiniCandidateCommentSerializer(serializers.ModelSerializer):
    author = MiniUserSerializer(read_only=True, source='comment_author.user')
    class Meta:
        model = CandidateComment
        fields = ['id','review', 'recommendation_rate', 'created_date', 'author']

class JobApplicationReceivedCommentSerializer(serializers.ModelSerializer):
    job_post = SimpleJobPostSerializer(read_only=True)
    candidate_comment = MiniCandidateCommentSerializer(read_only=True)
    employer_comment = MiniEmployerCommentSerializer(read_only=True)
    you_commented = serializers.SerializerMethodField()
    class Meta:
        model = JobApplication
        fields = ['candidate_comment','employer_comment','job_post','you_commented']

    def get_you_commented(self, obj):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            return False
        if hasattr(request.user, 'candidate_profile'):
            return CandidateComment.objects.filter(
                comment_author=request.user.candidate_profile,
                job_application=obj
            ).exists()
        else:
            return EmployerComment.objects.filter(
                comment_author=request.user.employer_profile,
                job_application=obj
            ).exists()

class CandidateCommentWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateComment
        fields = ['review', 'recommendation_rate']

    def validate(self, attrs):
        application = self.context['job_application']
        user = self.context['request'].user

        if application.resume.candidate_profile != user.candidate_profile:
            raise serializers.ValidationError({'detail' : "Bạn không có quyền đánh giá đơn ứng tuyển của người khác."})

        if CandidateComment.objects.filter(job_application=application).exists():
            raise serializers.ValidationError({'detail':'Đã có đánh giá cho đơn này.'})

        if application.result not in [ApplicationResult.ACCEPTED, ApplicationResult.REJECTED]:
            raise serializers.ValidationError({'detail':"Chỉ được phép đánh giá khi đơn đã có kết quả (Accepted/Rejected)."})
        return attrs


class FollowerListSerializer(serializers.ModelSerializer):
    user = MiniUserSerializer(read_only=True, source='follower.user')

    class Meta:
        model = Follow
        fields = ['id', 'user', 'created_date']


class FollowingListSerializer(serializers.ModelSerializer):
    user = MiniUserSerializer(read_only=True, source='followed.user')
    followed = MiniEmployerSerializer(read_only=True)
    you_followed = serializers.SerializerMethodField()
    class Meta:
        model = Follow
        fields = ['id', 'user', 'followed', 'you_followed', 'created_date']

    def get_you_followed(self,obj):
        request = self.context.get('request')
        if not hasattr(request.user, 'candidate_profile'):
            return False
        followed_employer_ids = self.context.get('followed_employer_ids', [])
        return obj.followed_id in followed_employer_ids

