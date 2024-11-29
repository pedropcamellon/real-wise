from backend.api.permissions import IsAuthenticatedAndAgentForWrite
from backend.models import Property
from backend.tests import create_test_agent, create_test_user
from django.test import TestCase
from rest_framework.test import APIRequestFactory


class AgentPermissionsTests(TestCase):
    def setUp(self):
        """Set up test data"""
        self.factory = APIRequestFactory()
        self.permission = IsAuthenticatedAndAgentForWrite()
        self.regular_user = create_test_user()
        self.agent = create_test_agent()
        self.property_data = {
            "title": "Test Property",
            "description": "A test property listing",
            "property_type": "residential",
            "status": "on_market",
            "price": "100000.00",
            "size": "150.00",
            "address": "123 Test St",
            "city": "Test City",
            "state": "Test State",
            "zip_code": "12345",
        }

    def test_unauthenticated_user(self):
        """Test permission denied for unauthenticated user"""
        request = self.factory.get("/")
        request.user = None
        self.assertFalse(self.permission.has_permission(request, None))

    def test_read_permission_regular_user(self):
        """Test permission allowed for GET request from non-agent authenticated user"""
        request = self.factory.get("/")
        request.user = self.regular_user
        self.assertTrue(self.permission.has_permission(request, None))

    def test_write_permission_regular_user(self):
        """Test permission denied for POST request from non-agent authenticated user"""
        request = self.factory.post("/")
        request.user = self.regular_user
        self.assertFalse(self.permission.has_permission(request, None))

    def test_read_permission_agent(self):
        """Test permission allowed for GET request from agent"""
        request = self.factory.get("/")
        request.user = self.agent
        self.assertTrue(self.permission.has_permission(request, None))

    def test_write_permission_agent(self):
        """Test permission allowed for POST request from agent"""
        request = self.factory.post("/")
        request.user = self.agent
        self.assertTrue(self.permission.has_permission(request, None))

    def test_update_permission_agent(self):
        """Test permission allowed for PUT request from agent"""
        request = self.factory.put("/")
        request.user = self.agent
        self.assertTrue(self.permission.has_permission(request, None))

    def test_delete_permission_agent(self):
        """Test permission allowed for DELETE request from agent"""
        request = self.factory.delete("/")
        request.user = self.agent
        self.assertTrue(self.permission.has_permission(request, None))

    def test_agent_can_update_own_property(self):
        """Test that agents can update their own properties"""
        property = Property.objects.create(created_by=self.agent, **self.property_data)
        request = self.factory.put(f"/api/properties/{property.id}/")
        request.user = self.agent
        self.assertTrue(self.permission.has_object_permission(request, None, property))

    def test_agent_cannot_update_others_property(self):
        """Test that agents cannot update properties created by others"""
        other_agent = create_test_agent()
        property = Property.objects.create(created_by=other_agent, **self.property_data)
        request = self.factory.put(f"/api/properties/{property.id}/")
        request.user = self.agent
        self.assertFalse(self.permission.has_object_permission(request, None, property))

    def test_read_permissions_all_users(self):
        """Test that all authenticated users can read properties"""
        property = Property.objects.create(created_by=self.agent, **self.property_data)

        # Test regular user can read
        request = self.factory.get("/api/properties/")
        request.user = self.regular_user
        self.assertTrue(self.permission.has_permission(request, None))
        self.assertTrue(self.permission.has_object_permission(request, None, property))

        # Test agent can read
        request.user = self.agent
        self.assertTrue(self.permission.has_permission(request, None))
        self.assertTrue(self.permission.has_object_permission(request, None, property))
