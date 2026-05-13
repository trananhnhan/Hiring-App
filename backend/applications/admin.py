from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Resume, JobApplication

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('title', 'candidate_profile', 'status', 'created_date', 'updated_date')
    list_filter = ('status',)
    search_fields = ('title', 'candidate_profile__user__username', 'candidate_profile__user__email')
    # Giúp chọn nhiều CareerField dễ dàng hơn bằng 2 cột
    filter_horizontal = ('career_fields',)
    readonly_fields = ('uuid',)

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'job_post', 'result', 'created_date')
    list_filter = ('result',)
    search_fields = ('job_post__title', 'resume__title', 'resume__candidate_profile__user__username')
    readonly_fields = ('uuid',)