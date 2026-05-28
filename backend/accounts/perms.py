from rest_framework import permissions
from accounts.models import UserRole


class IsBasicUser(permissions.IsAuthenticated):

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role in [UserRole.EMPLOYER, UserRole.CANDIDATE]

class IsCandidate(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role == UserRole.CANDIDATE

class IsModerator(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role == UserRole.MODERATOR

class IsEmployer(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role == UserRole.EMPLOYER

class IsSuperUser(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role == UserRole.SUPER_USER

class IsEmployerOrModerator(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role in [UserRole.EMPLOYER, UserRole.MODERATOR]


class IsVerifiedEmployer(IsEmployer):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        if hasattr(request.user,'employer_profile'):
            return request.user.employer_profile.is_verified

        return False
