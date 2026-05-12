from cloudinary.models import CloudinaryField
from django.db import models
import uuid

from django.utils import timezone

from accounts.models import CandidateProfile
from core.shared import BaseModel
from jobs.models import CareerField, JobPost, JobPostStatus
from django.core.exceptions import ValidationError


# Create your models here.
class ResumeStatus(models.TextChoices):
    DRAFT = 'DRAFT', 'Draft'
    PUBLIC = 'PUBLIC', 'Public'
    PRIVATE = 'PRIVATE','Private'

class ApplicationResult(models.TextChoices):
    PENDING = 'PENDING', 'Pending'
    REVIEWING = 'REVIEWING','Reviewing'
    ACCEPTED = 'ACCEPTED', 'Accepted'
    REJECTED = 'REJECTED', 'Rejected'

class Resume(BaseModel):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    candidate_profile = models.ForeignKey(CandidateProfile,on_delete=models.CASCADE,related_name='resumes')
    career_fields = models.ManyToManyField(CareerField, related_name='resumes', blank=True)
    description = models.TextField(blank=True, null=True,db_index=True)
    title = models.CharField(max_length=255, db_index=True)
    resume_img = CloudinaryField( blank=True, null=True)
    status = models.CharField(max_length=10,choices=ResumeStatus.choices, default=ResumeStatus.DRAFT)

    def __str__(self):
        return self.title

class JobApplication(BaseModel):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    job_post = models.ForeignKey(JobPost, on_delete=models.CASCADE, related_name='job_applications')
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='job_applications')
    message = models.TextField(blank=True, null=True)
    result = models.CharField(max_length=20, choices=ApplicationResult.choices, default=ApplicationResult.PENDING)
    result_detail = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('job_post', 'resume')

    def clean(self):
        super().clean()
        if self.resume.status == ResumeStatus.DRAFT:
            raise ValidationError({
                "resume": "Không thể nộp hồ sơ đang ở trạng thái Nháp (DRAFT)."
            })

        if self.job_post.status != JobPostStatus.OPEN:
            raise ValidationError({
                "job_post": "Bài đăng tuyển dụng này hiện không nhận hồ sơ."
            })
        if self.job_post.expiry_date and self.job_post.expiry_date <= timezone.now():
            raise ValidationError({
                "job_post": "Bài đăng tuyển dụng này đã hết hạn ứng tuyển."
            })

    def __str__(self):
        return f"Application: {self.resume.candidate.user.username} -> {self.job_post.title}"



