from ... import create_test_user
from backend.models import UserRole
from django.contrib.auth import get_user_model
from django.test import TestCase

User = get_user_model()


class UserModelTests(TestCase):
    def setUp(self):
        """Set up test data"""
        self.test_user = create_test_user()
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
        }

    def test_user_creation(self):
        """Test user creation with basic fields"""
        self.assertEqual(self.test_user.username, self.user_data["username"])
        self.assertEqual(self.test_user.email, self.user_data["email"])
        self.assertTrue(self.test_user.check_password(self.user_data["password"]))

    def test_user_roles(self):
        """Test adding and checking user roles"""
        role = UserRole.objects.create(name=UserRole.AGENT)
        self.test_user.roles.add(role)
        self.assertEqual(self.test_user.roles.count(), 1)
        self.assertEqual(self.test_user.roles.first().name, UserRole.AGENT)

    def test_user_str_method(self):
        """Test the string representation of a user"""
        self.assertEqual(str(self.test_user), self.test_user.username)

    def test_user_email_normalized(self):
        """Test email is normalized when user is created"""
        email = "test@EXAMPLE.com"
        user = User.objects.create_user(
            username="test2", email=email, password="test123"
        )
        self.assertEqual(user.email, email.lower())

    def test_create_user_without_username_fails(self):
        """Test creating a user without a username raises error"""
        with self.assertRaises(ValueError):
            User.objects.create_user(
                username="", email="test@example.com", password="test123"
            )

    def test_create_superuser(self):
        """Test creating a superuser"""
        superuser = User.objects.create_superuser(
            username="admin", email="admin@example.com", password="admin123"
        )
        self.assertTrue(superuser.is_superuser)
        self.assertTrue(superuser.is_staff)
