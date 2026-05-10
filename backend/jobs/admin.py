
from django.contrib import admin
from .models import CareerField, JobPost, WorkDay

class WorkDayInline(admin.TabularInline):
    model = WorkDay
    extra = 1


@admin.register(CareerField)
class CareerFieldAdmin(admin.ModelAdmin):
    list_display = ['id', 'field_name', 'parent', 'active']
    search_fields = ['field_name']
    list_filter = ['active']


@admin.register(JobPost)
class JobPostAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'employer', 'status', 'expiry_date', 'active']
    list_filter = ['status', 'active', 'created_date']
    search_fields = ['title', 'employer__company_name', 'employer__user__username']


    filter_horizontal = ['career_fields']


    inlines = [WorkDayInline]

    # Không cho phép sửa uuid
    readonly_fields = ['uuid', 'created_date', 'updated_date']

    # (Tùy chọn) Nếu bảng Address quá nhiều, dùng autocomplete để trang admin không bị lag
    # raw_id_fields = ['address', 'employer']