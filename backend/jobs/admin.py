from django.contrib import admin
from .models import CareerField, JobPost, WorkDay

@admin.register(CareerField)
class CareerFieldAdmin(admin.ModelAdmin):
    list_display = ('field_name', 'parent', 'created_date')
    search_fields = ('field_name',)
    list_filter = ('parent',)

# Cho phép thêm WorkDay ngay trong trang tạo JobPost
class WorkDayInline(admin.TabularInline):
    model = WorkDay
    extra = 1

@admin.register(JobPost)
class JobPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'employer_profile', 'status', 'expiry_date', 'slot', 'created_date')
    list_filter = ('status',)
    search_fields = ('title', 'employer_profile__company_name', 'employer_profile__user__username')
    filter_horizontal = ('career_fields',)
    readonly_fields = ('uuid',)
    inlines = [WorkDayInline]

@admin.register(WorkDay)
class WorkDayAdmin(admin.ModelAdmin):
    list_display = ('job_post', 'day_of_week', 'work_start', 'work_end')
    list_filter = ('day_of_week',)
    search_fields = ('job_post__title',)