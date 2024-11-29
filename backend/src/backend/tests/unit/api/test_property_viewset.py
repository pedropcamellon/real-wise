from backend.api.properties.views import PropertyViewSet
from backend.tests import create_test_agent, create_test_property
from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate


class PropertyViewSetTests(TestCase):
    def setUp(self):
        """Set up test data"""
        self.factory = APIRequestFactory()
        self.agent = create_test_agent()
        self.property = create_test_property(self.agent)
        self.viewset = PropertyViewSet.as_view({"get": "list", "post": "create"})

    def test_list_properties(self):
        """Test listing properties"""
        request = self.factory.get("/api/properties/")
        force_authenticate(request, user=self.agent)
        response = self.viewset(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], self.property.title)

    def test_create_property(self):
        """Test creating a new property"""
        data = {
            "title": "New Property",
            "description": "A new test property",
            "property_type": "residential",
            "status": "on_market",
            "price": "150000.00",
            "size": "180.00",
            "address": "456 New St",
            "city": "New City",
            "state": "New State",
            "zip_code": "54321",
        }

        request = self.factory.post("/api/properties/", data)
        force_authenticate(request, user=self.agent)
        response = self.viewset(request)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["title"], data["title"])
        self.assertEqual(response.data["created_by"], self.agent.id)

    def test_retrieve_property(self):
        """Test retrieving a specific property"""
        viewset = PropertyViewSet.as_view({"get": "retrieve"})
        request = self.factory.get(f"/api/properties/{self.property.id}/")
        force_authenticate(request, user=self.agent)
        response = viewset(request, pk=self.property.id)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], self.property.title)

    def test_update_property(self):
        """Test updating a property"""
        viewset = PropertyViewSet.as_view({"put": "update"})
        data = {
            "title": "Updated Property",
            "description": self.property.description,
            "property_type": self.property.property_type,
            "status": self.property.status,
            "price": str(self.property.price),
            "size": str(self.property.size),
            "address": self.property.address,
            "city": self.property.city,
            "state": self.property.state,
            "zip_code": self.property.zip_code,
        }

        request = self.factory.put(f"/api/properties/{self.property.id}/", data)
        force_authenticate(request, user=self.agent)
        response = viewset(request, pk=self.property.id)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], "Updated Property")

    def test_delete_property(self):
        """Test deleting a property"""
        viewset = PropertyViewSet.as_view({"delete": "destroy"})
        request = self.factory.delete(f"/api/properties/{self.property.id}/")
        force_authenticate(request, user=self.agent)
        response = viewset(request, pk=self.property.id)

        self.assertEqual(response.status_code, 204)
