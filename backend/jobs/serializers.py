from django.utils import timezone
from rest_framework import serializers

from accounts.models import CompanyAddress
from accounts.serializers import CompanyAddressSerializer, SimpleUserSerializer, SimpleEmployerSerializer, MiniEmployerSerializer
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
        fields = ['id', 'field_name']

class SimpleJobPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        fields = ['title','job_thumbnail']

class JobPostListSerializer(serializers.ModelSerializer):
    career_fields = CareerFieldSerializer(read_only=True,many=True)
    address = CompanyAddressSerializer(read_only=True)
    application_count = serializers.IntegerField(default=0,read_only=True)
    employer_profile = MiniEmployerSerializer(read_only=True)
    class Meta:
        model = JobPost
        fields = ['id','uuid','career_fields','address',
                  'title','job_thumbnail','salary_min',
                  'salary_max','slot','expiry_date','employer_profile','status','application_count']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.job_thumbnail:
            data['job_thumbnail'] = instance.job_thumbnail.url
        return data


class JobPostDetailSerializer(JobPostListSerializer):
    user = SimpleUserSerializer(source='employer_profile.user',read_only=True)
    work_days = WorkDaySerializer(many=True)
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
        fields = JobPostListSerializer.Meta.fields + ['description','user','career_fields_id','address_id','work_days']

    def validate(self, attrs):
        salary_min = attrs.get('salary_min')
        salary_max = attrs.get('salary_max')
        if salary_min is not None and salary_max is not None:
            if salary_min > salary_max:
                raise serializers.ValidationError({"salary_max": "Salary max must be greater than salary min."})

        status = attrs.get('status')
        expiry_date = attrs.get('expiry_date')
        if status == JobPostStatus.OPEN and expiry_date and expiry_date <= timezone.now():
            raise serializers.ValidationError({"expiry_date": "Expiry date must be in the future for OPEN status."})

        address = attrs.get('address')
        request = self.context.get('request')
        if request and hasattr(request.user, 'employer_profile'):
            employer = request.user.employer_profile
            if address and employer:
                if address.employer_id != employer.id:
                    raise serializers.ValidationError({'address': 'Address does not belong to this employer.'})

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

        # 3. Cập nhật các field cơ bản còn lại
        return super().update(instance, validated_data)