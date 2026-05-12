from django.db import models


class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class CloudinaryImageMixin:
    cloudinary_fields = []

    def to_representation(self, instance):
        data = super().to_representation(instance)
        for field_name in self.cloudinary_fields:
            if getattr(instance, field_name, None):
                data[field_name] = getattr(instance, field_name).url
        return data