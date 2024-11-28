from rest_framework import viewsets, filters
from django_filters import rest_framework as django_filters
from backend.models import Property
from .serializers import PropertySerializer
from .filters import PropertyFilter
from ..permissions import IsAuthenticatedAndAgentForWrite


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticatedAndAgentForWrite]
    filter_backends = [
        django_filters.DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = PropertyFilter
    search_fields = ["title", "description", "address"]
    ordering_fields = ["price", "created_at", "size"]

    def get_queryset(self):
        """
        Optionally restricts the returned properties to those owned by the agent,
        by filtering against a `my_properties` query parameter.
        """
        queryset = super().get_queryset()
        my_properties = self.request.query_params.get("my_properties", None)
        if my_properties and self.request.user.is_agent:
            queryset = queryset.filter(created_by=self.request.user)
        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
