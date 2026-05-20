import math
from rest_framework.response import Response
from rest_framework import pagination

class BaseCustomPaginator(pagination.PageNumberPagination):
    page_size_query_param = 'page-size'
    max_page_size = 50

    def get_paginated_response(self, data):
        total_pages = math.ceil(self.page.paginator.count / self.get_page_size(self.request))

        return Response({
            'count': self.page.paginator.count,
            'total_pages': total_pages,
            'current_page': self.page.number,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })

class BasePaginator(BaseCustomPaginator):
    page_size = 4

class ApplicationPaginator(BaseCustomPaginator):
    page_size = 10
