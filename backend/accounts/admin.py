from django.contrib import admin
from .models import (
    User, CandidateProfile, EmployerProfile,
    Province, District, Ward,
    CompanyAddress, CompanyVerificationImage, VerificationRequest
)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff')
    search_fields = ('username', 'email')


@admin.register(EmployerProfile)
class EmployerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'company_name', 'tax_code', 'is_verified')
    list_filter = ('is_verified',)
    search_fields = ('company_name', 'tax_code')
    list_select_related = ('user',)


@admin.register(CandidateProfile)
class CandidateProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone')
    search_fields = ('user__username', 'phone')
    list_select_related = ('user',)



@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
    list_display = ('code', 'name')
    search_fields = ('code', 'name')


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'province')
    search_fields = ('code', 'name')
    list_filter = ('province',)
    list_select_related = ('province',)


@admin.register(Ward)
class WardAdmin(admin.ModelAdmin):

    list_display = ('code', 'name', 'district')
    search_fields = ('code', 'name')
    list_select_related = ('district', 'district__province')



@admin.register(CompanyAddress)
class CompanyAddressAdmin(admin.ModelAdmin):

    list_display = ('id', 'employer_profile', 'ward', 'full_address')

    list_select_related = ('employer_profile', 'ward', 'ward__district', 'ward__district__province')


# 1. Quên chưa đăng ký VerificationRequest nè, thêm vào để Admin còn có chỗ mà duyệt (ACCEPT/REJECT) nhé!
 # Nhớ import vào


@admin.register(VerificationRequest)
class VerificationRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'employer_profile', 'status', 'created_date')
    list_filter = ('status',)
    list_select_related = ('employer_profile', 'employer_profile__user')



@admin.register(CompanyVerificationImage)
class CompanyVerificationImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_employer_profile', 'verification_request')


    list_select_related = ('verification_request', 'verification_request__employer_profile')

    def get_employer_profile(self, obj):

        return obj.verification_request.employer_profile.company_name

    get_employer_profile.short_description = 'Company Name'