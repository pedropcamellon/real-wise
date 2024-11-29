from backend.models import UserRole, Property
from django.contrib.auth import get_user_model


def create_test_user(
    username="testuser", password="testpass123", email="test@example.com"
):
    User = get_user_model()
    return User.objects.create_user(username=username, password=password, email=email)


def create_test_agent():
    agent = create_test_user(username="agent", email="agent@example.com")
    role = UserRole.objects.create(name=UserRole.AGENT)
    agent.roles.add(role)
    return agent


def create_test_property(agent, **kwargs):
    defaults = {
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
    defaults.update(kwargs)
    property = Property(**defaults, created_by=agent)
    property.full_clean()  # Validate before saving
    property.save()
    return property
