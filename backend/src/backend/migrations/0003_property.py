# Generated by Django 5.1.2 on 2024-11-19 03:41

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_add_user_role_management'),
    ]

    operations = [
        migrations.CreateModel(
            name='Property',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='title')),
                ('description', models.TextField(verbose_name='description')),
                ('property_type', models.CharField(choices=[('residential', 'Residential'), ('commercial', 'Commercial')], max_length=20, verbose_name='property type')),
                ('status', models.CharField(choices=[('on_market', 'On Market'), ('off_market', 'Off Market')], default='on_market', max_length=20, verbose_name='status')),
                ('price', models.DecimalField(decimal_places=2, max_digits=12, verbose_name='price')),
                ('size', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='size')),
                ('address', models.CharField(max_length=255, verbose_name='address')),
                ('city', models.CharField(max_length=100, verbose_name='city')),
                ('state', models.CharField(max_length=100, verbose_name='state')),
                ('zip_code', models.CharField(max_length=20, verbose_name='zip code')),
                ('latitude', models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True, verbose_name='latitude')),
                ('longitude', models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True, verbose_name='longitude')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('modified_at', models.DateTimeField(auto_now=True, verbose_name='modified at')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL, verbose_name='created by')),
            ],
            options={
                'verbose_name': 'property',
                'verbose_name_plural': 'properties',
                'db_table': 'properties',
                'ordering': ['-created_at'],
            },
        ),
    ]
