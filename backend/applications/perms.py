from accounts.models import UserRole
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


class IsApplicationParticipant(IsBasicUser):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.role == UserRole.CANDIDATE:
            return obj.resume.candidate_profile == user.candidate_profile
        if user.role == UserRole.EMPLOYER:
            return obj.job_post.employer_profile == user.employer_profile
        return False