from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from cloudinary.models import CloudinaryField
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from core.shared import BaseModel
import uuid

class UserRole(models.TextChoices):
    EMPLOYER = 'EMPLOYER', 'Employer'
    CANDIDATE = 'CANDIDATE', 'Candidate'
    MODERATOR = 'MODERATOR', 'Moderator'
    SUPER_USER = 'SUPER_USER', 'Super User'

class VerificationStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending'
    REJECTED = 'REJECTED', 'Rejected'
    ACCEPTED = 'ACCEPTED', 'Accepted'

class SimpleUserNameValidator(UnicodeUsernameValidator):
    regex = r"^[\w-]+\Z"
    message = _(
        "Enter a valid username. This value may contain only unaccented lowercase a-z "
        "and uppercase A-Z letters, numbers, and - or _ characters."
    )
class User(AbstractUser):
    username_validator = SimpleUserNameValidator()
    username = models.CharField(
        _("username"),
        max_length=150,
        unique=True,
        help_text=_(
            "Required. 150 characters or fewer. Letters, digits and -/_ only."
        ),
        validators=[username_validator],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
        db_index= True,
    )
    avatar = CloudinaryField(null = True, blank = True)
    role = models.CharField(
        max_length= 20,
        choices= UserRole.choices,
        default = UserRole.CANDIDATE
    )


    def save(self,*args,**kwargs):
        if self.role == UserRole.SUPER_USER:
            self.is_staff = True
            self.is_superuser = True

        self.clean()

        super().save(*args,**kwargs)

    def __str__(self):
        return self.username

class CandidateProfile(models.Model):
    user = models.OneToOneField(User, on_delete= models.CASCADE, related_name='candidate_profile')
    phone = models.CharField(max_length=15, null=True,blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    def __str__(self):
        return self.user.username

class EmployerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')
    company_name = models.CharField(max_length=250, null=True, blank=True)
    tax_code = models.CharField(max_length=50, unique=True, null=True,blank=True)
    is_verified = models.BooleanField(default=False)
    company_description = models.TextField(null=True,blank=True)

    def clean(self):
        super().clean()
        if self.pk and self.is_verified:
            origin = EmployerProfile.objects.get(pk = self.pk)
            if not origin.is_verified:
                if not self.tax_code or not self.company_name:
                    raise ValidationError({"null field":"Employer must have a company name and tax_code"})
                if self.addresses.count() < 1:
                    raise ValidationError({"company_address":"Employer must have at least 1 address to be verified."})

    def __str__(self):
        return self.user.username

class Province(BaseModel):
    code =  models.IntegerField(unique=True, default= 0)
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class District(BaseModel):
    code = models.IntegerField(unique=True,default= 0)
    name = models.CharField(max_length=100 )
    province = models.ForeignKey(Province, on_delete=models.CASCADE, related_name='districts')
    def __str__(self):
        return f"{self.name}, {self.province.name}"

class Ward(BaseModel):
    code = models.IntegerField(unique=True,default= 0)
    name = models.CharField(max_length=100)
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='wards')
    def __str__(self):
        return f"{self.name}, {self.district.name}, {self.district.province.name}"

class CompanyAddress(BaseModel):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    employer_profile = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE, related_name='addresses')
    ward = models.ForeignKey(Ward, on_delete=models.SET_NULL, null=True)
    full_address = models.CharField(max_length=255, default='', blank= True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def save(self,*args,**kwargs):
        if self.full_address == '':
            self.full_address = self.ward.__str__()
        super().save(*args,**kwargs)
    def __str__(self):
        return self.full_address

class VerificationRequest(BaseModel):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    employer_profile = models.ForeignKey(
        EmployerProfile, on_delete=models.CASCADE, related_name='verification_requests'
    )
    status = models.CharField(max_length=20,choices=VerificationStatus.choices,default=VerificationStatus.PENDING)


class CompanyVerificationImage(BaseModel):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    verification_request = models.ForeignKey(
        VerificationRequest, on_delete=models.CASCADE, related_name='images'
    )
    image = CloudinaryField('verification_image')

    def clean(self):
        super().clean()
        if not self.pk and self.verification_request.images.count() >= 10:
            raise ValidationError("Không thể upload quá 10 ảnh xác thực.")


    def __str__(self):
        return self.verification_request.employer_profile.user.username