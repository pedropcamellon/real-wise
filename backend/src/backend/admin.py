from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User, UserRole


@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "created_at", "modified_at")
    search_fields = ("name", "description")
    ordering = ("name",)
    readonly_fields = ("created_at", "modified_at")


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "is_staff",
        "is_active",
    )
    list_filter = ("is_staff", "is_active", "roles")
    search_fields = ("username", "first_name", "last_name", "email")
    ordering = ("username",)

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "email")}),
        ("Roles and Permissions", {"fields": ("roles", "is_staff", "is_active")}),
        (
            "Important dates",
            {"fields": ("last_login", "date_joined", "created_at", "modified_at")},
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "email",
                    "password1",
                    "password2",
                    "roles",
                ),
            },
        ),
    )
    readonly_fields = ("created_at", "modified_at", "last_login", "date_joined")
