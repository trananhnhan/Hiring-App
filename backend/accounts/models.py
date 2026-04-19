from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField
from django.core.exceptions import ValidationError

from core.shared import BaseModel


class UserRole(models.TextChoices):
    EMPLOYER = 'EMPLOYER', 'Employer'
    CANDIDATE = 'CANDIDATE', 'Candidate'
    MODERATOR = 'MODERATOR', 'Moderator'
    SUPER_USER = 'SUPER_USER', 'Super User'

class User(AbstractUser):
    avatar = CloudinaryField(null = True, blank = True)
    role = models.CharField(
        max_length= 20,
        choices= UserRole.choices,
        default = UserRole.CANDIDATE
    )
    bio = models.TextField(null=True,blank = True)

    def save(self,*args,**kwargs):
        if self.role == UserRole.SUPER_USER:
            self.is_staff = True
            self.is_superuser = True

        self.full_clean()

        super().save(*args,**kwargs)

    def __str__(self):
        return self.username

class CandidateProfile(models.Model):
    user = models.OneToOneField(User, on_delete= models.CASCADE, related_name='candidate_profile')
    phone = models.CharField(max_length=15, null=True,blank=True)
    date_of_birth = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.user.username

class EmployerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')
    company_name = models.CharField(max_length=250)
    tax_code = models.CharField(max_length=50, unique=True)
    is_verified = models.BooleanField(default=False)
    company_description = models.TextField(null=True,blank=True)

    def clean(self):
        if self.pk and self.is_verified:
            origin = EmployerProfile.objects.get(pk = self.pk)
            if not origin.is_verified:
                if self.addresses.count() < 1:
                    raise ValidationError("Employer must have at least 1 address to be verified.")
                if self.verification_images.count() < 3:
                    raise ValidationError("Employer must have at least 3 verification images to be verified.")


    def save(self,*args,**kwargs):
        self.full_clean()
        super().save(*args,**kwargs)

    def __str__(self):
        return self.user.username

class Province(BaseModel):
    name = models.CharField(max_length=100)
    def __str__(self): return self.name

class District(BaseModel):
    name = models.CharField(max_length=100)
    province = models.ForeignKey(Province, on_delete=models.CASCADE, related_name='districts')
    def __str__(self): return f"{self.name}, {self.province.name}"

class Ward(BaseModel):
    name = models.CharField(max_length=100)
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='wards')
    def __str__(self): return f"{self.name}, {self.district.name}"

class CompanyAddress(BaseModel):
    employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE, related_name='addresses')
    ward = models.ForeignKey(Ward, on_delete=models.SET_NULL, null=True)
    full_address = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def clean(self):
        super().clean()
        if not self.pk and self.employer.addresses.count() >= 20:
            raise ValidationError('An employer cannot have more than 20 addresses.')

    def save(self,*args,**kwargs):
        self.full_clean()
        super().save(*args,**kwargs)

class CompanyVerificationImage(BaseModel):
    employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE, related_name='verification_images')
    image = CloudinaryField('verification_image') # Upload ảnh xác thực lên Cloudinary

    def clean(self):
        super().clean()
        if not self.pk and self.employer.verification_images.count() >= 10:
            raise ValidationError("An employer cannot have more than 10 verification images.")

    def save(self,*args,**kwargs):
        self.full_clean()
        super().save(*args,**kwargs)

    def __str__(self):
        return self.employer.company_name