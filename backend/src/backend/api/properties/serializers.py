from rest_framework import serializers
from backend.models import Property


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            "id",
            "title",
            "description",
            "property_type",
            "status",
            "price",
            "size",
            "address",
            "city",
            "state",
            "zip_code",
            "latitude",
            "longitude",
            "created_at",
            "modified_at",
        ]
