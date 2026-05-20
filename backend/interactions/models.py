from django.db import models

from accounts.models import CandidateProfile, EmployerProfile
from applications.models import JobApplication, ApplicationResult
from core.shared import BaseModel
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError

class Follow(BaseModel):
    follower = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='following')
    followed = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE, related_name='followers')

    class Meta:
        unique_together = ('follower', 'followed')

    def __str__(self):
        return f"{self.follower.user.username} follows {self.followed.user.username}"



class CandidateComment(BaseModel):

    job_application = models.OneToOneField(JobApplication, on_delete=models.CASCADE, related_name='candidate_comment')
    comment_author = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='authored_comments')

    review = models.TextField()
    recommendation_rate = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    def clean(self):
        super().clean()
        if self.job_application.result not in [ApplicationResult.ACCEPTED, ApplicationResult.REJECTED]:
            raise ValidationError("Chỉ được phép đánh giá khi đơn ứng tuyển đã có kết quả (Accepted/Rejected).")

class EmployerComment(BaseModel):
    job_application = models.OneToOneField(JobApplication, on_delete=models.CASCADE, related_name='employer_comment')
    comment_author = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE, related_name='authored_comments')

    review = models.TextField()
    recommendation_rate = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    def clean(self):
        super().clean()
        if self.job_application.result not in [ApplicationResult.ACCEPTED, ApplicationResult.REJECTED]:
            raise ValidationError("Chỉ được phép đánh giá khi đơn ứng tuyển đã có kết quả (Accepted/Rejected).")