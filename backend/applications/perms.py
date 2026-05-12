from accounts.perms import IsBasicUser
from applications.models import ResumeStatus



class IsResumeOwner(IsBasicUser):
    def has_object_permission(self, request, view, obj):
        return hasattr(request.user, 'candidate_profile') and obj.candidate_profile == request.user.candidate_profile

class DetailResumePermission(IsBasicUser):
    def has_object_permission(self, request, view, obj):
        if hasattr(request.user, 'candidate_profile') and obj.candidate_profile == request.user.candidate_profile:
            return True

        return obj.status not in [ResumeStatus.DRAFT,ResumeStatus.PRIVATE]