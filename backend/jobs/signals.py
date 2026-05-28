import threading
from django.core.mail import EmailMessage
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from interactions.models import Follow
from .models import JobPost



def send_email_async(subject, message, bcc_list):
    email = EmailMessage(
        subject=subject,
        body=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        bcc=bcc_list,
    )

    email.send(fail_silently=False)


@receiver(post_save, sender=JobPost)
def notify_followers_on_new_job(sender, instance, created, **kwargs):
    if not created:
        return

    emails = list(Follow.objects.filter(
        followed=instance.employer_profile
    ).values_list('follower__user__email', flat=True))

    if not emails:
        return


    company_name = instance.employer_profile.company_name
    subject = f"[{company_name}] Có tin tuyển dụng mới hấp dẫn!"

    message = (
        f"Xin chào,\n\n"
        f"Công ty {company_name} mà bạn đang theo dõi vừa đăng tải một tin tuyển dụng mới:\n"
        f"🔥 Vị trí: {instance.title}\n\n"
        f"Mô tả công việc:\n{instance.description}\n\n"
        f"Hãy truy cập hệ thống để ứng tuyển ngay nhé!"
    )


    email_thread = threading.Thread(
        target=send_email_async,
        args=(subject, message, emails)
    )
    email_thread.start()