from rest_framework import permissions
from accounts.models import UserRole


class IsBasicUser(permissions.IsAuthenticated):

    def has_permission(self, request, view):

        if not super().has_permission(request, view):
            return False

        return request.user.role in [UserRole.EMPLOYER, UserRole.CANDIDATE]