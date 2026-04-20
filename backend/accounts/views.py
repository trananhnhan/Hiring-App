from rest_framework import viewsets,generics
from rest_framework.permissions import AllowAny
from accounts.models import User
from accounts.serializers import UserSerializer


class UserViewSet(viewsets.ViewSet,generics.CreateAPIView):
    queryset = User.objects.filter(is_active = True)
    serializer_class = UserSerializer

    permission_classes = [AllowAny]