from backend.api.properties.filters import PropertyFilter
from backend.models import Property
from backend.tests import create_test_agent, create_test_property
from decimal import Decimal
from django.test import TestCase


class PropertyFilterTests(TestCase):
    def setUp(self):
        """Set up test data"""
        self.agent = create_test_agent()

        # Create test properties
        self.cheap_property = create_test_property(
            self.agent, title="Cheap Property", price=Decimal("100000.00")
        )
        self.expensive_property = create_test_property(
            self.agent, title="Expensive Property", price=Decimal("200000.00")
        )
        self.small_property = create_test_property(
            self.agent, title="Small Property", size=Decimal("100.00")
        )
        self.large_property = create_test_property(
            self.agent, title="Large Property", size=Decimal("200.00")
        )
        self.residential_property = create_test_property(
            self.agent, title="Residential Property", property_type="residential"
        )
        self.commercial_property = create_test_property(
            self.agent, title="Commercial Property", property_type="commercial"
        )
        self.on_market_property = create_test_property(
            self.agent, title="On Market Property", status="on_market"
        )
        self.off_market_property = create_test_property(
            self.agent, title="Off Market Property", status="off_market"
        )
        self.ny_property = create_test_property(
            self.agent, title="New York Property", city="New York"
        )
        self.la_property = create_test_property(
            self.agent, title="LA Property", city="Los Angeles"
        )

    def test_price_filter(self):
        """Test filtering properties by price range"""
        # Test min_price filter
        filter_set = PropertyFilter(
            {"min_price": "150000"}, queryset=Property.objects.all()
        )
        self.assertEqual(filter_set.qs.count(), 1)
        self.assertGreaterEqual(float(filter_set.qs.first().price), 150000)

        # Test max_price filter
        filter_set = PropertyFilter(
            {"max_price": "150000"}, queryset=Property.objects.all()
        )
        self.assertEqual(filter_set.qs.count(), 1)
        self.assertLessEqual(float(filter_set.qs.first().price), 150000)

    def test_size_filter(self):
        """Test filtering properties by size range"""
        # Test min_size filter
        filter_set = PropertyFilter(
            {"min_size": "150"}, queryset=Property.objects.all()
        )
        self.assertEqual(filter_set.qs.count(), 1)
        self.assertGreaterEqual(float(filter_set.qs.first().size), 150)

    def test_property_type_filter(self):
        """Test filtering properties by type"""
        filter_set = PropertyFilter(
            {"property_type": "residential"}, queryset=Property.objects.all()
        )
        self.assertEqual(filter_set.qs.count(), 1)
        self.assertEqual(filter_set.qs.first().property_type, "residential")

    def test_status_filter(self):
        """Test filtering properties by status"""
        filter_set = PropertyFilter(
            {"status": "on_market"}, queryset=Property.objects.all()
        )
        self.assertEqual(filter_set.qs.count(), 1)
        self.assertEqual(filter_set.qs.first().status, "on_market")

    def test_city_filter(self):
        """Test filtering properties by city"""
        # Test exact match
        filter_set = PropertyFilter(
            {"city": "New York"}, queryset=Property.objects.all()
        )
        self.assertEqual(filter_set.qs.count(), 1)

        # Test contains match
        filter_set = PropertyFilter(
            {"city__icontains": "york"}, queryset=Property.objects.all()
        )
        self.assertEqual(filter_set.qs.count(), 1)
