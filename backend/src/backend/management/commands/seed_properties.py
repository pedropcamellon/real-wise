from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from backend.models import Property
from faker import Faker
from decimal import Decimal
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with 1000 properties'

    def handle(self, *args, **options):
        fake = Faker()
        
        # Get or create a user for the properties
        user, _ = User.objects.get_or_create(
            username='admin',
            defaults={
                'is_staff': True,
                'is_superuser': True,
                'email': 'admin@example.com'
            }
        )
        
        # Set password if user was just created
        if _:
            user.set_password('admin')
            user.save()

        property_types = ['residential', 'commercial']
        statuses = ['on_market', 'off_market']

        self.stdout.write('Starting to seed properties...')

        for i in range(1000):
            property = Property.objects.create(
                title=fake.sentence(nb_words=4)[:-1],  # Remove trailing period
                description=fake.text(max_nb_chars=100),
                property_type=random.choice(property_types),
                status=random.choice(statuses),
                price=Decimal(str(random.uniform(100000, 2000000))).quantize(Decimal('0.01')),
                size=Decimal(str(random.uniform(500, 10000))).quantize(Decimal('0.01')),
                address=fake.street_address(),
                city=fake.city(),
                state=fake.state(),
                zip_code=fake.zipcode(),
                latitude=Decimal(str(fake.latitude())),
                longitude=Decimal(str(fake.longitude())),
                created_by=user
            )
            
            if (i + 1) % 100 == 0:
                self.stdout.write(f'Created {i + 1} properties...')

        self.stdout.write(self.style.SUCCESS('Successfully created 1000 properties!'))
