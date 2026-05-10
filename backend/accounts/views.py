import requests
from rest_framework import viewsets,generics,status,permissions
from rest_framework.generics import mixins
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView


from accounts.models import User,UserRole
from accounts import serializers,perms
from core import settings
from core.settings import env


class SignUpView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = [AllowAny]

class CurrentUserViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["get", "patch"],url_path="me")
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
            current_user_serializer.save()
            return Response(current_user_serializer.data, status=status.HTTP_200_OK)
        else:
            print("something went wrong !!")


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"detail": "username or password missing."},
                            status=status.HTTP_400_BAD_REQUEST)

        payload = {
            'grant_type': 'password',
            'username': username,
            'password': password,
            'client_id': env('OAUTH2_CLIENT_ID') ,
            'client_secret': env('OAUTH2_CLIENT_SECRET'),
        }
        token_endpoint = request.build_absolute_uri('/o/token/')

        try:
            oauth_response = requests.post(token_endpoint, data=payload)
            response_data = oauth_response.json()

            if oauth_response.status_code == 200:
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response(response_data, status=oauth_response.status_code)

        except requests.exceptions.RequestException as e:
            print(f"connection error: {e}")
            return Response({"detail": "connection error"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)




