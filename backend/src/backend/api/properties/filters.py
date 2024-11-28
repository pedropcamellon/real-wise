from django_filters import rest_framework as filters
from backend.models import Property


class PropertyFilter(filters.FilterSet):
    price_min = filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = filters.NumberFilter(field_name="price", lookup_expr="lte")
    size_min = filters.NumberFilter(field_name="size", lookup_expr="gte")
    size_max = filters.NumberFilter(field_name="size", lookup_expr="lte")

    class Meta:
        model = Property
        fields = {
            "property_type": ["exact"],
            "status": ["exact"],
            "city": ["exact", "icontains"],
            "state": ["exact"],
            "zip_code": ["exact"],
        }
