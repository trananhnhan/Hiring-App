from django.contrib import admin
from .models import Follow, CandidateComment, EmployerComment


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    # Hiển thị: ID | Tên Ứng viên | Tên Công ty | Ngày bấm theo dõi
    list_display = ('id', 'get_follower', 'get_followed', 'created_date')

    # Tối ưu truy vấn dữ liệu liên kết
    list_select_related = ('follower__user', 'followed')

    # Cho phép Admin tìm kiếm theo username của ứng viên hoặc tên công ty
    search_fields = ('follower__user__username', 'followed__company_name')
    list_filter = ('created_date',)

    def get_follower(self, obj):
        return f"{obj.follower.user.last_name} {obj.follower.user.first_name}".strip() or obj.follower.user.username

    get_follower.short_description = 'Ứng viên (Follower)'

    def get_followed(self, obj):
        return obj.followed.company_name

    get_followed.short_description = 'Công ty (Followed)'


@admin.register(CandidateComment)
class CandidateCommentAdmin(admin.ModelAdmin):
    # Hiển thị: ID | Người đánh giá | Đánh giá công ty nào | Số sao | Ngày tạo
    list_display = ('id', 'get_candidate', 'get_company', 'recommendation_rate', 'created_date')

    # Bộ lọc nhanh theo số sao và mốc thời gian ở cột bên phải
    list_filter = ('recommendation_rate', 'created_date')

    # Tìm kiếm theo nội dung review, username ứng viên, hoặc tiêu đề công việc
    search_fields = ('review', 'comment_author__user__username', 'job_application__job_post__title')

    # Chặn đứng N+1 Query cho đống liên kết lồng nhau
    list_select_related = (
        'comment_author__user',
        'job_application__job_post__employer_profile'
    )

    def get_candidate(self, obj):
        return obj.comment_author.user.username

    get_candidate.short_description = 'Ứng viên đánh giá'

    def get_company(self, obj):
        return obj.job_application.job_post.employer_profile.company_name

    get_company.short_description = 'Công ty được đánh giá'


@admin.register(EmployerComment)
class EmployerCommentAdmin(admin.ModelAdmin):
    # Hiển thị: ID | Công ty đánh giá | Đánh giá ứng viên nào | Số sao | Ngày tạo
    list_display = ('id', 'get_employer', 'get_candidate', 'recommendation_rate', 'created_date')
    list_filter = ('recommendation_rate', 'created_date')
    search_fields = ('review', 'comment_author__company_name', 'job_application__resume__title')

    # Đi đường vòng qua Resume để lấy User của Candidate
    list_select_related = (
        'comment_author',
        'job_application__resume__candidate_profile__user'
    )

    def get_employer(self, obj):
        return obj.comment_author.company_name

    get_employer.short_description = 'Công ty đánh giá'

    def get_candidate(self, obj):
        user = obj.job_application.resume.candidate_profile.user
        return user.username

    get_candidate.short_description = 'Ứng viên được đánh giá'