from rest_framework import serializers

from accounts.serializers import MiniUserSerializer, MiniEmployerSerializer
from applications.models import ApplicationResult
from interactions.models import CandidateComment, EmployerComment, Follow
from jobs.serializers import MiniJobPostSerializer


class EmployerReceivedCommentSerializer(serializers.ModelSerializer):
    job_post = MiniJobPostSerializer(read_only=True, source='job_application.job_post')
    user = MiniUserSerializer(read_only=True, source='comment_author.user')

    class Meta:
        model = CandidateComment
        fields = ['id','review', 'recommendation_rate', 'created_date', 'user', 'job_post']

class EmployerCommentWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerComment
        fields = ['review', 'recommendation_rate']

    def validate(self, attrs):
        application = self.context['job_application']
        if EmployerComment.objects.filter(job_application=application).exists():
            raise serializers.ValidationError("Đã có đánh giá cho đơn này.")

        if application.result not in [ApplicationResult.ACCEPTED, ApplicationResult.REJECTED]:
            raise serializers.ValidationError("Chỉ được phép đánh giá khi đơn đã có kết quả (Accepted/Rejected).")

        return attrs

class CandidateReceivedCommentSerializer(serializers.ModelSerializer):
    job_post = MiniJobPostSerializer(read_only=True, source='job_application.job_post')
    user = MiniUserSerializer(read_only=True, source='comment_author.user')

    class Meta:
        model = EmployerComment
        fields = ['id','review', 'recommendation_rate', 'created_date', 'user', 'job_post']



class CandidateCommentWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateComment
        fields = ['review', 'recommendation_rate']

    def validate(self, attrs):
        application = self.context['job_application']
        if CandidateComment.objects.filter(job_application=application).exists():
            raise serializers.ValidationError("Đã có đánh giá cho đơn này.")

        if application.result not in [ApplicationResult.ACCEPTED, ApplicationResult.REJECTED]:
            raise serializers.ValidationError("Chỉ được phép đánh giá khi đơn đã có kết quả (Accepted/Rejected).")
        return attrs


class FollowerListSerializer(serializers.ModelSerializer):
    user = MiniUserSerializer(read_only=True, source='follower.user')

    class Meta:
        model = Follow
        fields = ['id', 'user', 'created_date']


class FollowingListSerializer(serializers.ModelSerializer):
    user = MiniUserSerializer(read_only=True, source='followed.user')
    followed = MiniEmployerSerializer(read_only=True)

    class Meta:
        model = Follow
        fields = ['id','user','followed', 'created_date']

