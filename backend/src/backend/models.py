from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserRole(models.Model):
    ADMIN = "admin"
    AGENT = "agent"
    USER = "user"

    ROLE_CHOICES = [
        (ADMIN, _("Administrator")),
        (AGENT, _("Real Estate Agent")),
        (USER, _("Regular User")),
    ]

    name = models.CharField(max_length=50, choices=ROLE_CHOICES, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    modified_at = models.DateTimeField(_("modified at"), auto_now=True)

    class Meta:
        db_table = "user_roles"
        verbose_name = _("user role")
        verbose_name_plural = _("user roles")

    def __str__(self):
        return self.get_name_display()


class User(AbstractUser):
    roles = models.ManyToManyField(
        UserRole, related_name="users", verbose_name=_("user roles"), blank=True
    )
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    modified_at = models.DateTimeField(_("modified at"), auto_now=True)

    class Meta:
        db_table = "users"
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def __str__(self):
        return self.email if self.email else self.username

    def save(self, *args, **kwargs):
        """Ensure superusers have staff and admin privileges"""
        is_new = self.pk is None
        super().save(*args, **kwargs)

        if is_new and self.is_superuser:
            # If this is a new superuser, give them the admin role and staff status
            self.is_staff = True
            self.add_role(UserRole.ADMIN)
            super().save(update_fields=["is_staff"] if not is_new else None)

    @property
    def is_admin(self):
        """User is admin if they have admin role or are a superuser"""
        return self.is_superuser or self.roles.filter(name=UserRole.ADMIN).exists()

    @property
    def is_agent(self):
        """Agents are those with the agent role (superusers can also act as agents)"""
        return self.is_superuser or self.roles.filter(name=UserRole.AGENT).exists()

    @property
    def is_regular_user(self):
        """Regular users are those without admin or agent roles (superusers are never regular users)"""
        return not (self.is_superuser or self.is_admin or self.is_agent)

    def add_role(self, role_name):
        """Add a role to the user"""
        role, _ = UserRole.objects.get_or_create(
            name=role_name,
            defaults={"description": f"User with {role_name} privileges"},
        )
        self.roles.add(role)

    def remove_role(self, role_name):
        """Remove a role from the user"""
        # Prevent removing admin role from superusers
        if self.is_superuser and role_name == UserRole.ADMIN:
            return
        self.roles.filter(name=role_name).delete()

    def set_role(self, role_name):
        """Set a single role for the user, removing all other roles"""
        # Prevent removing admin role from superusers
        if self.is_superuser and role_name != UserRole.ADMIN:
            return
        self.roles.clear()
        self.add_role(role_name)
