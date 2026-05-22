import django_filters
from django.db.models import Q

from interactions.models import Follow
from jobs.models import JobPost


class JobPostListFilter(django_filters.FilterSet):
    expected_salary = django_filters.NumberFilter(method='filter_by_expected_salary')
    career_field = django_filters.NumberFilter(field_name='career_fields__id')
    work_day = django_filters.CharFilter(field_name='work_days__day_of_week',lookup_expr='iexact')
    is_followed = django_filters.BooleanFilter(method='filter_by_followed_employer')

    ward = django_filters.NumberFilter(field_name='address__ward__id')
    district = django_filters.NumberFilter(field_name='address__ward__district__id')
    province = django_filters.NumberFilter(field_name='address__ward__district__province__id')

    class Meta:
        model = JobPost
        fields = ['career_field', 'work_day', 'ward', 'district', 'province']

    def filter_by_expected_salary(self,queryset,name,value):
        return queryset.filter(
            Q(salary_min__lte=value, salary_max__gte=value) |
            Q(salary_min__lte = value, salary_max__isnull = True) |
            Q(salary_min__isnull = True, salary_max__gte=value)|
            Q(salary_min__isnull=True, salary_max__isnull=True)
        )

    def filter_by_followed_employer(self, queryset, name, value):
        if value:
            user = self.request.user

            if user.is_authenticated and hasattr(user, 'candidate_profile'):
                candidate = user.candidate_profile

                followed_employer_ids = Follow.objects.filter(
                    follower=candidate
                ).values_list('followed_id', flat=True)

                return queryset.filter(employer_profile_id__in=followed_employer_ids)
            else:
                return queryset.none()
        return queryset

class JobPostListOwnerFilter(JobPostListFilter):
    class Meta:
        model = JobPostListFilter.Meta.model
        fields = JobPostListFilter.Meta.fields + ['status']