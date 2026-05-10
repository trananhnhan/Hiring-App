from datetime import timedelta

import django_filters
from django.db.models import Q
from django.utils import timezone

from applications.models import Resume


class ResumeListFilter(django_filters.FilterSet):
    career_field = django_filters.NumberFilter(field_name='career_fields__id')
    days_ago = django_filters.NumberFilter(method='filter_for_time_period')

    class Meta:
        model = Resume
        fields = ['career_field']

    def filter_for_time_period(self,queryset,name,value):
        if value:
            past_date = timezone.now() - timedelta(days = value)
            return queryset.filter('created_date__gte=past_date')
        return queryset




class ResumeOwnerListFilter(ResumeListFilter):
    class Meta:
        model = ResumeListFilter.Meta.model
        fields = ResumeListFilter.Meta.fields + ['status']