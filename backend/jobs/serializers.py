from django.utils import timezone
from rest_framework import serializers

from accounts.models import CompanyAddress
from accounts.serializers import CompanyAddressSerializer, SimpleUserSerializer, SimpleEmployerSerializer, \
    MiniEmployerSerializer, MiniCompanyAddressSerializer
from applications.models import JobApplication
from core.shared import CloudinaryImageMixin
from jobs.models import WorkDay, CareerField, JobPost, JobPostStatus


class WorkDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkDay
        fields = ['id', 'day_of_week', 'work_start', 'work_end', 'break_start', 'break_end']

    def validate(self, attrs):
        if attrs['work_start'] >= attrs['work_end']:
            raise serializers.ValidationError("Work end time must be after work start time.")

        if attrs.get('break_start') and attrs.get('break_end'):
            if attrs['break_start'] >= attrs['break_end']:
                raise serializers.ValidationError("Break end time must be after break start time.")

        return attrs

class CareerFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerField
        fields = ['id', 'field_name',]


class NestedCareerFieldSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = CareerField
        fields = ['id', 'field_name', 'children']

    def get_children(self, obj):
        children = obj.children.all()
        if not children:
            return []
        return NestedCareerFieldSerializer(children, many=True).data

class MiniJobPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        fields = ['title','uuid']

class SimpleJobPostSerializer(CloudinaryImageMixin, serializers.ModelSerializer):
    cloudinary_fields = ['job_thumbnail']

    class Meta:
        model = JobPost
        fields = ['uuid','title','job_thumbnail']

class JobPostListSerializer(CloudinaryImageMixin, serializers.ModelSerializer):
    cloudinary_fields = ['job_thumbnail']

    address = MiniCompanyAddressSerializer(read_only=True)
    application_count = serializers.IntegerField(default=0,read_only=True)
    employer_profile = MiniEmployerSerializer(read_only=True)
    class Meta:
        model = JobPost
        fields = ['uuid','address',
                  'title','job_thumbnail','salary_min',
                  'salary_max','slot','expiry_date','employer_profile','status','application_count']



class JobPostDetailSerializer(JobPostListSerializer):
    user = SimpleUserSerializer(source='employer_profile.user',read_only=True)
    address = CompanyAddressSerializer(read_only=True)
    work_days = WorkDaySerializer(many=True)
    is_applied = serializers.SerializerMethodField()
    career_fields = CareerFieldSerializer(many=True)
    is_owner = serializers.SerializerMethodField()
    career_fields_id = serializers.PrimaryKeyRelatedField(
        queryset= CareerField.objects.all(),
        source= 'career_fields',
        write_only= True,
        many=True
    )
    address_id = serializers.PrimaryKeyRelatedField(
        queryset= CompanyAddress.objects.all(),
        source = 'address',
        write_only= True,
    )
    class Meta:
        model = JobPostListSerializer.Meta.model
        fields = JobPostListSerializer.Meta.fields + ['description','user','career_fields_id','address_id'
                                                      ,'is_applied','work_days','career_fields','is_owner']

    def get_is_applied(self, obj):
        request = self.context.get('request')
        if not request.user.is_authenticated:
            return None
        if hasattr(request.user, 'employer_profile'):
            return None

        application = JobApplication.objects.filter(
            job_post=obj,
            resume__candidate_profile=request.user.candidate_profile
        ).first()

        if not application:
            return None

        return {
            "applied": True,
            "uuid": str(application.uuid)
        }

    def get_is_owner(self, obj):
        request = self.context.get('request')
        if not request.user.is_authenticated:
            return False
        if hasattr(request.user, 'candidate_profile'):
            return False
        return obj.employer_profile.user == request.user

    def validate(self, attrs):
        salary_min = attrs.get('salary_min')
        salary_max = attrs.get('salary_max')
        if salary_min is not None and salary_max is not None:
            if salary_min > salary_max:
                raise serializers.ValidationError({"detail": "Salary max must be greater than salary min."})

        status = attrs.get('status')
        expiry_date = attrs.get('expiry_date')
        if status == JobPostStatus.OPEN and expiry_date and expiry_date <= timezone.now():
            raise serializers.ValidationError({"detail": "Expiry date must be in the future for OPEN status."})

        address = attrs.get('address')
        request = self.context.get('request')
        if request and hasattr(request.user, 'employer_profile'):
            employer = request.user.employer_profile
            if address and employer:
                if address.employer_id != employer.id:
                    raise serializers.ValidationError({'detail': 'Address does not belong to this employer.'})

        if self.instance:
            if self.instance.status == JobPostStatus.CLOSED:
                raise serializers.ValidationError(
                    {'detail': "Can't change closed job post."}
                )

        return attrs

    def create(self, validated_data):
        work_days_data = validated_data.pop('work_days')
        career_fields_data = validated_data.pop('career_fields')

        job_post = JobPost.objects.create(**validated_data)

        for work_day in work_days_data:
            WorkDay.objects.create(job_post = job_post,**work_day)

        job_post.career_fields.set(career_fields_data)

    def update(self, instance, validated_data):
        career_fields_data = validated_data.pop('career_fields', None)

        if career_fields_data is not None:
            instance.career_fields.set(career_fields_data)

        work_days_data = validated_data.pop('work_days', None)
        if work_days_data is not None:
            instance.work_days.all().delete()
            for work_day in work_days_data:
                WorkDay.objects.create(job_post=instance, **work_day)

        return super().update(instance, validated_data)