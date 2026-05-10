
from rest_framework import mixins, viewsets
# Create your views here.

class JobApplicationViewSet(mixins.CreateModelMixin,
                            mixins.RetrieveModelMixin,
                            mixins.UpdateModelMixin,
                            mixins.DestroyModelMixin,
                            viewsets.GenericViewSet):
    lookup_field = 'uuid'
    http_method_names = ['get','post','patch','delete']

    def get_queryset(self):
        pass