from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, UserRole, CandidateProfile, EmployerProfile, VerificationRequest, VerificationStatus


@receiver(post_save, sender=User)
def create_user_profile(sender,instance,created,**kwargs):
    if created:
        if instance.role == UserRole.CANDIDATE:
            CandidateProfile.objects.get_or_create(user = instance)
        elif instance.role == UserRole.EMPLOYER:
            EmployerProfile.objects.get_or_create(user = instance)

@receiver(post_save, sender=VerificationRequest)
def handle_verification_status(sender, instance, **kwargs):
    if instance.status == VerificationStatus.ACCEPTED:
        if not instance.employer_profile.is_verified:
            instance.employer_profile.is_verified = True
            instance.employer_profile.save()

