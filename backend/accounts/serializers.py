from datetime import date

from rest_framework import serializers

from core.shared import CloudinaryImageMixin
from interactions.models import Follow
from .models import User, UserRole, CompanyAddress, EmployerProfile, CandidateProfile, CompanyVerificationImage, \
    District, Province, Ward, VerificationRequest, VerificationStatus


class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = ['id','name']

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ['id','name']
class WardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ward
        fields = ['id','name']

# CompanyAddress
class MiniCompanyAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyAddress
        fields = ['full_address']

class CompanyAddressSerializer(serializers.ModelSerializer):
    district = DistrictSerializer(source='ward.district', read_only=True)
    province = ProvinceSerializer(source='ward.district.province', read_only=True)
    ward = WardSerializer(read_only=True)
    ward_id = serializers.PrimaryKeyRelatedField(
        queryset=Ward.objects.all(),
        source='ward',
        write_only=True
    )
    class Meta:
        model = CompanyAddress
        fields = ['uuid', 'full_address', 'latitude', 'longitude','ward_id' ,'ward','district','province']

# CompanyVerification
class CompanyVerificationImageSerializer(CloudinaryImageMixin,serializers.ModelSerializer):
    cloudinary_fields = ['image']
    class Meta:
        model = CompanyVerificationImage
        fields = ['uuid', 'image']

class ListVerificationRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = VerificationRequest
        fields = ['uuid', 'status', 'created_date']
class RetrieveVerificationRequestSerializer(serializers.ModelSerializer):
    images = CompanyVerificationImageSerializer(many=True, read_only=True)

    class Meta:
        model = VerificationRequest
        fields = ['uuid', 'status', 'created_date', 'images']

class CreateVerificationRequestSerializer(serializers.ModelSerializer):
    upload_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False),
        write_only=True,
        max_length=10,
        min_length=3
    )

    class Meta:
        model = VerificationRequest
        fields = ['uuid', 'status', 'created_date', 'upload_images']
        extra_kwargs = {
            'uuid' : {'read_only' : True},
            'status' : {'read_only' : True},
            'created_date': {'read_only': True},
        }

    def validate(self, attrs):
        employer_profile = self.context['request'].user.employer_profile
        if employer_profile.verification_requests.filter(
                status__in=[VerificationStatus.PENDING, VerificationStatus.ACCEPTED]
        ).exists():
            raise serializers.ValidationError({'detail':"Không thể gửi request mới khi đang pending hoặc đã được xác thực."})
        if not employer_profile.company_name.strip() :
            raise serializers.ValidationError({'detail':"Không thể gửi request mới khi công ty chưa có tên."})
        if not employer_profile.tax_code.strip():
            raise serializers.ValidationError({'detail':"Không thể gửi request mới khi công ty chưa có mã thuế."})

        return attrs

    def create(self, validated_data):
        images = validated_data.pop('upload_images')
        employer_profile = self.context['request'].user.employer_profile

        verification_request = VerificationRequest.objects.create(employer_profile=employer_profile)
        for image in images:
            CompanyVerificationImage.objects.create(
                verification_request=verification_request,
                image=image
            )
        return verification_request
#employer
class MiniEmployerSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerProfile
        fields = ['company_name']

class UpdateEmployerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerProfile
        fields = ['company_name', 'tax_code', 'company_description']



class SimpleEmployerSerializer(serializers.ModelSerializer):
    addresses = CompanyAddressSerializer(many=True,read_only=True)
    class Meta:
        model = EmployerProfile
        fields = ['company_name','company_description','is_verified','addresses']

class EmployerSerializer(SimpleEmployerSerializer):

    verification_requests = ListVerificationRequestSerializer(read_only=True,many=True)
    class Meta:
        model = SimpleEmployerSerializer.Meta.model
        fields = SimpleEmployerSerializer.Meta.fields + ['tax_code','verification_requests',]


#candidate
class SimpleCandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = ['date_of_birth']

class UpdateCandidateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = ['phone', 'date_of_birth', 'bio']

class CandidateSerializer(SimpleCandidateSerializer):
    class Meta:
        model = SimpleCandidateSerializer.Meta.model
        fields = SimpleCandidateSerializer.Meta.fields +['phone']

#user
class MiniUserSerializer(CloudinaryImageMixin, serializers.ModelSerializer):
    cloudinary_fields = ['avatar']
    name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['name', 'avatar', 'username','role']
        extra_kwargs = {
            'username' : {'read_only' : True},
            'role' : {'read_only' : True}
        }

    def get_name(self,obj):
        return f"{obj.last_name} {obj.first_name}".strip()

class SimpleUserSerializer(CloudinaryImageMixin, serializers.ModelSerializer):
    cloudinary_fields = ['avatar']
    name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [ 'first_name', 'last_name','name', 'role', 'avatar','username', 'email']
        extra_kwargs = {
            'first_name': {'write_only': True},
            'last_name': {'write_only': True},
            'username' : {'read_only' : True},
            'role' : {'read_only' : True}
        }

    def get_name(self,obj):
        return f"{obj.last_name} {obj.first_name}".strip()


class UserSerializer(SimpleUserSerializer):
    class Meta:
        model = SimpleUserSerializer.Meta.model
        fields = SimpleUserSerializer.Meta.fields + ['password',]

        extra_kwargs =  {
            'password' : {'write_only' : True}
        }

    def validate_role(self,value):
        forbidden_roles = [UserRole.SUPER_USER, UserRole.MODERATOR]
        if value in forbidden_roles:
            raise serializers.ValidationError(f"you can't sign up for {value} role")
        return value

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class CurrentUserSerializer(SimpleUserSerializer):
    profile = serializers.SerializerMethodField()
    class Meta:
        model = SimpleUserSerializer.Meta.model
        fields = SimpleUserSerializer.Meta.fields + ['profile']
        extra_kwargs = {
            'role' : {'read_only' : True},
            'first_name': {'write_only': True},
            'last_name': {'write_only': True},
            'username': {'read_only': True},
        }
    def get_profile(self, obj):
        if obj.role == UserRole.EMPLOYER:
            return EmployerSerializer(obj.employer_profile).data
        if obj.role == UserRole.CANDIDATE:
            return CandidateSerializer(obj.candidate_profile).data
        return None

#employer
class PublicEmployerProfileSerializer(serializers.ModelSerializer):
    user = MiniUserSerializer(read_only=True)
    addresses = MiniCompanyAddressSerializer(read_only=True,many=True)
    is_owner = serializers.SerializerMethodField()
    you_followed = serializers.SerializerMethodField()
    class Meta:
        model = EmployerProfile
        fields = ['company_name','company_description','user','addresses','is_owner','you_followed']

    def get_you_followed(self,obj):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated or not hasattr(request.user,'candidate_profile'):
            return False
        candidate_profile = request.user.candidate_profile
        return Follow.objects.filter(follower = candidate_profile, followed = obj).exists()

    def get_is_owner(self,obj):
        request = self.context.get('request')

        if not request or not request.user or not request.user.is_authenticated:
            return False
        return obj.user == request.user


class PublicCandidateProfileSerializer(serializers.ModelSerializer):
    user = MiniUserSerializer(read_only=True)
    approximate_age = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    class Meta:
        model = CandidateProfile
        fields = ['user','bio','approximate_age','is_owner']

    def get_approximate_age(self, obj):
        if not obj.date_of_birth:
            return None
        return date.today().year - obj.date_of_birth.year

    def get_is_owner(self,obj):
        request = self.context.get('request')

        if not request or not request.user or not request.user.is_authenticated:
            return False
        return obj.user == request.user

