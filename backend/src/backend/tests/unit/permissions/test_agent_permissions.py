from backend.api.properties.permissions import IsAuthenticatedAndAgentForWrite
from backend.tests import create_test_user, create_test_agent
from django.test import TestCase
from rest_framework.test import APIRequestFactory


class AgentPermissionsTests(TestCase):
    def setUp(self):
        """Set up test data"""
        self.factory = APIRequestFactory()
        self.permission = IsAuthenticatedAndAgentForWrite()
        self.regular_user = create_test_user()
        self.agent = create_test_agent()

    def test_unauthenticated_user(self):
        """Test permission denied for unauthenticated user"""
        request = self.factory.get("/")
        request.user = None
        self.assertFalse(self.permission.has_permission(request, None))

    def test_authenticated_non_agent_get(self):
        """Test permission allowed for GET request from non-agent authenticated user"""
        request = self.factory.get("/")
        request.user = self.regular_user
        self.assertTrue(self.permission.has_permission(request, None))

    def test_authenticated_non_agent_post(self):
        """Test permission denied for POST request from non-agent authenticated user"""
        request = self.factory.post("/")
        request.user = self.regular_user
        self.assertFalse(self.permission.has_permission(request, None))

    def test_authenticated_agent_get(self):
        """Test permission allowed for GET request from agent"""
        request = self.factory.get("/")
        request.user = self.agent
        self.assertTrue(self.permission.has_permission(request, None))

    def test_authenticated_agent_post(self):
        """Test permission allowed for POST request from agent"""
        request = self.factory.post("/")
        request.user = self.agent
        self.assertTrue(self.permission.has_permission(request, None))

    def test_authenticated_agent_put(self):
        """Test permission allowed for PUT request from agent"""
        request = self.factory.put("/")
        request.user = self.agent
        self.assertTrue(self.permission.has_permission(request, None))

    def test_authenticated_agent_delete(self):
        """Test permission allowed for DELETE request from agent"""
        request = self.factory.delete("/")
        request.user = self.agent
        self.assertTrue(self.permission.has_permission(request, None))
