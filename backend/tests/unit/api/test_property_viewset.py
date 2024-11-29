from ... import create_test_agent, create_test_property
from backend.api.properties.views import PropertyViewSet
from backend.models import Property
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate
import pytest


@pytest.fixture
def api_client():
    return APIClient()


class TestPropertyViewSet:
    def test_list_properties_unauthenticated(self, api_client):
        """Test that unauthenticated users can't list properties"""
        response = api_client.get("/api/properties/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_properties_authenticated(
        self, api_client, test_user, property_data, test_agent
    ):
        """Test that authenticated users can list properties"""
        # Create a test property
        Property.objects.create(created_by=test_agent, **property_data)

        # Authenticate user
        api_client.force_authenticate(user=test_user)
        response = api_client.get("/api/properties/")

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]["title"] == property_data["title"]

    def test_create_property_as_agent(self, api_client, test_agent, property_data):
        """Test that agents can create properties"""
        api_client.force_authenticate(user=test_agent)
        response = api_client.post("/api/properties/", property_data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["title"] == property_data["title"]
        assert Property.objects.count() == 1

    def test_create_property_as_user(self, api_client, test_user, property_data):
        """Test that regular users cannot create properties"""
        api_client.force_authenticate(user=test_user)
        response = api_client.post("/api/properties/", property_data)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert Property.objects.count() == 0

    def test_update_property_as_agent(self, api_client, test_agent, property_data):
        """Test that agents can update their own properties"""
        property = Property.objects.create(created_by=test_agent, **property_data)

        api_client.force_authenticate(user=test_agent)
        updated_data = property_data.copy()
        updated_data["title"] = "Updated Title"

        response = api_client.put(f"/api/properties/{property.id}/", updated_data)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == "Updated Title"

    def test_delete_property_as_agent(self, api_client, test_agent, property_data):
        """Test that agents can delete their own properties"""
        property = Property.objects.create(created_by=test_agent, **property_data)

        api_client.force_authenticate(user=test_agent)
        response = api_client.delete(f"/api/properties/{property.id}/")

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Property.objects.count() == 0

    def test_filter_properties_by_price(self, api_client, test_agent, property_data):
        """Test filtering properties by price range"""
        Property.objects.create(
            created_by=test_agent,
            price="100000.00",
            **{k: v for k, v in property_data.items() if k != "price"},
        )
        Property.objects.create(
            created_by=test_agent,
            price="200000.00",
            **{k: v for k, v in property_data.items() if k != "price"},
        )

        api_client.force_authenticate(user=test_agent)
        response = api_client.get("/api/properties/", {"min_price": 150000})

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert float(response.data[0]["price"]) >= 150000


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
