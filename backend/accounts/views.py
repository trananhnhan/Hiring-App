from rest_framework import viewsets,generics,status,permissions
from rest_framework.generics import mixins
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView


from accounts.models import User,UserRole
from accounts import serializers,perms


class SignUpView(generics.CreateAPIView):
    queryset = User.objects.filter(is_active = True)
    serializer_class = serializers.UserSerializer

    permission_classes = [AllowAny]

class CurrentUserViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["get", "patch"],url_path="current-user")
    def current_user(self,request):
        user = request.user
        if request.method == "GET":
            user_id = user.id
            role = user.role
            if role == UserRole.CANDIDATE:
                user_profile = User.objects.select_related('candidate_profile').get(pk = user_id)
            elif role == UserRole.EMPLOYER:
                user_profile = User.objects.select_related('employer_profile').prefetch_related(
                    'employer_profile__addresses',
                    'employer_profile__verification_images'
                ).get(pk = user_id)
            else:
                user_profile = request.user

            current_user_serializer = serializers.CurrentUserSerializer(instance=user_profile)
            return Response(current_user_serializer.data, status=status.HTTP_200_OK)
        elif request.method == "PATCH":
            current_user_serializer = serializers.CurrentUserSerializer(user,data=request.data, partial=True)
            current_user_serializer.is_valid(raise_exception=True)
            user_profile = current_user_serializer.save()
            return Response(serializers.CurrentUserSerializer(user_profile).data, status=status.HTTP_200_OK)
        else:
            print("something went wrong ?")




