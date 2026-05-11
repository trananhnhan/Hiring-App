from accounts.perms import IsEmployer


class IsJobPostOwner(IsEmployer):
    def has_object_permission(self, request, view, obj):
        return obj.employer_profile == request.user.employer_profile