from rest_framework.permissions import IsAuthenticated


class IsAuthenticatedAndAgentForWrite(IsAuthenticated):
    """Custom permission to:
    - Require authentication for all operations
    - Only allow agents to create/edit properties
    - Agents can only modify their own property listings
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        if request.method in ["POST", "PUT", "PATCH", "DELETE"]:
            return request.user.is_agent
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in ["PUT", "PATCH", "DELETE"]:
            return obj.created_by == request.user
        return True
