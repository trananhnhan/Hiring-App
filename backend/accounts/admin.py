from django.contrib import admin
# Register your models here.
from .models import (
    User, CandidateProfile, EmployerProfile,
    Province, District, Ward,
    CompanyAddress, CompanyVerificationImage
)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    # Các cột sẽ hiển thị ra bảng ngoài
    list_display = ('username', 'email', 'role', 'is_active', 'is_staff')
    # Bộ lọc bên tay phải
    list_filter = ('role', 'is_active', 'is_staff')
    # Thanh tìm kiếm
    search_fields = ('username', 'email')

@admin.register(EmployerProfile)
class EmployerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'company_name', 'tax_code', 'is_verified')
    list_filter = ('is_verified',)
    search_fields = ('company_name', 'tax_code')

@admin.register(CandidateProfile)
class CandidateProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'date_of_birth')
    search_fields = ('user__username', 'phone')

# Các bảng phụ trợ đăng ký nhanh
admin.site.register(Province)
admin.site.register(District)
admin.site.register(Ward)
admin.site.register(CompanyAddress)
admin.site.register(CompanyVerificationImage)