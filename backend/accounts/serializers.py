from rest_framework import serializers
from .models import User, UserRole, CompanyAddress, EmployerProfile, CandidateProfile,CompanyVerificationImage


class SimpleUserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name','name', 'role', 'avatar','username', 'email']
        extra_kwargs = {
            'first_name': {'write_only': True},
            'last_name': {'write_only': True},
            'username' : {'read_only' : True},
            'role' : {'read_only' : True}
        }

    def get_name(self,obj):
        return f"{obj.last_name} {obj.first_name}".strip()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            data['avatar'] = instance.avatar.url
        return data

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

class CompanyAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyAddress
        fields = ['id','full_address','latitude','longitude','ward']

class CompanyVerificationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyVerificationImage
        fields = ['id','image']

class SimpleEmployerSerializer(serializers.ModelSerializer):
    addresses = CompanyAddressSerializer(many=True,read_only=True)
    class Meta:
        model = EmployerProfile
        fields = ['id','company_name','company_description','is_verified']

class EmployerSerializer(SimpleEmployerSerializer):

    verification_images = CompanyVerificationImageSerializer(many=True, read_only=True)
    class Meta:
        model = SimpleEmployerSerializer.Meta.model
        fields = SimpleEmployerSerializer.Meta.fields + ['tax_code','addresses','verification_images',]

class SimpleCandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = ['id','date_of_birth']

class CandidateSerializer(SimpleCandidateSerializer):
    class Meta:
        model = SimpleCandidateSerializer.Meta.model
        fields = SimpleCandidateSerializer.Meta.fields +['phone']

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