from backend.models import Property
from backend.tests import create_test_agent, create_test_property
from decimal import Decimal
from django.core.exceptions import ValidationError
from django.test import TestCase


class PropertyModelTests(TestCase):
    def setUp(self):
        """Set up test data"""
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
        self.test_property = create_test_property(self.agent)

    def test_property_creation(self):
        """Test creating a property with valid data"""
        self.assertEqual(self.test_property.title, self.property_data["title"])
        self.assertEqual(self.test_property.status, self.property_data["status"])
        self.assertEqual(self.test_property.created_by, self.agent)

    def test_property_status_choices(self):
        """Test property status must be one of the defined choices"""
        self.assertIn(self.test_property.status, dict(Property.STATUS_CHOICES))

        # Test invalid status
        self.test_property.status = "invalid_status"
        with self.assertRaises(ValidationError):
            self.test_property.full_clean()

    def test_property_type_validation(self):
        """Test property type must be one of the defined choices"""
        self.assertIn(self.test_property.property_type, dict(Property.PROPERTY_TYPES))

        # Test invalid property type
        self.test_property.property_type = "invalid_type"
        with self.assertRaises(ValidationError):
            self.test_property.full_clean()

    def test_price_validation(self):
        """Test price must be positive"""
        with self.assertRaises(ValidationError):
            create_test_property(self.agent, price=Decimal("-100.00"))

    def test_size_validation(self):
        """Test size must be positive"""
        with self.assertRaises(ValidationError):
            create_test_property(self.agent, size=Decimal("-50.00"))

    def test_property_str_method(self):
        """Test the string representation of a property"""
        expected_str = f"{self.test_property.title} - {self.test_property.get_property_type_display()}"
        self.assertEqual(str(self.test_property), expected_str)

    def test_property_ordering(self):
        """Test properties are ordered by created_at in descending order"""
        property1 = self.test_property
        property2 = create_test_property(self.agent, title="Second Property")

        properties = Property.objects.all()
        self.assertEqual(properties[0], property2)  # Most recent first
        self.assertEqual(properties[1], property1)
