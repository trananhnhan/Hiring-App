from rest_framework import serializers
from .models import User,UserRole

class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'role', 'avatar']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            data['avatar'] = instance.avatar.url
        return data

class UserSerializer(SimpleUserSerializer):
    class Meta:
        model = SimpleUserSerializer.Meta.model
        fields = SimpleUserSerializer.Meta.fields + ['username','password']

        extra_kwargs = {
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