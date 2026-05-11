from cloudinary.models import CloudinaryField
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
import uuid
from core.shared import BaseModel
from accounts.models import EmployerProfile, CompanyAddress
# Create your models here.

class JobPostStatus(models.TextChoices):
    DRAFT = 'DRAFT', 'Draft'
    OPEN = 'OPEN', 'Open'
    CLOSED = 'CLOSED','Closed'

class DayOfWeek(models.TextChoices):
    MON = 'MON', 'Monday'
    TUE = 'TUE', 'Tuesday'
    WED = 'WED', 'Wednesday'
    THU = 'THU', 'Thursday'
    FRI = 'FRI', 'Friday'
    SAT = 'SAT', 'Saturday'
    SUN = 'SUN', 'Sunday'

class CareerField(BaseModel):
    parent = models.ForeignKey('self',on_delete=models.SET_NULL,null=True,blank=True,related_name='children')
    field_name = models.CharField(max_length=255,unique=True)
    field_description = models.TextField(null=True,blank=True)

    def clean(self):
        super().clean()
        if self.parent:
            current_parent = self.parent
            visited = set()

            while current_parent is not None:
                if current_parent == self:
                    raise ValidationError({
                        'parent': 'Circular dependency detected! A career field cannot be its own ancestor.'
                    })
                if current_parent in visited:
                    raise ValidationError({
                        'parent': 'Data integrity error: circular reference detected in existing data.'
                    })
                visited.add(current_parent)
                current_parent = current_parent.parent

    def __str__(self):

        return self.field_name

class JobPost(BaseModel):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    employer_profile = models.ForeignKey(EmployerProfile,on_delete=models.CASCADE,related_name='job_posts')
    career_fields = models.ManyToManyField(CareerField,related_name='job_posts')
    address = models.ForeignKey(CompanyAddress,on_delete=models.SET_NULL,related_name='job_posts',null=True)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True,blank=True)
    job_thumbnail = CloudinaryField(null = True, blank = True)

    salary_min = models.PositiveIntegerField(null=True,blank=True)
    salary_max = models.PositiveIntegerField(null = True,blank=True)
    slot = models.PositiveIntegerField(default=1)

    expiry_date = models.DateTimeField()
    status = models.CharField(max_length=20,choices=JobPostStatus.choices,default=JobPostStatus.DRAFT)

    def clean(self):
        super().clean()
        if self.salary_min is not None and self.salary_max is not None:
            if self.salary_min > self.salary_max:
                raise ValidationError({"salary_max": "Salary max must be greater than salary min."})

        if self.status == JobPostStatus.OPEN and self.expiry_date <= timezone.now():
            raise ValidationError({"expiry_date": "Expiry date must be in the future for OPEN status."})
        if self.address and self.employer_profile:
            if self.address.employer_id != self.employer_id:
                raise ValidationError({
                    'address' : 'Address does not belong to this employer.'
                })

    def __str__(self):
        return self.title

class WorkDay(BaseModel):
    job_post = models.ForeignKey(JobPost,on_delete=models.CASCADE,related_name='work_days')
    day_of_week = models.CharField(max_length=3,choices=DayOfWeek.choices)
    work_start = models.TimeField()
    work_end = models.TimeField()
    break_start = models.TimeField(null = True,blank=True)
    break_end = models.TimeField(null = True,blank= True)
    class Meta:
        unique_together = ('job_post','day_of_week')

    def clean(self):
        super().clean()
        if self.work_start >= self.work_end:
            raise ValidationError("Work end time must be after work start time.")
        if self.break_start and self.break_end and self.break_start >= self.break_end:
            raise ValidationError("Break end time must be after break start time.")
