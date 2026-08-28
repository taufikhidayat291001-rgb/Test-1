from django.core.management.base import BaseCommand
from courses.models import Course


class Command(BaseCommand):
    help = 'Menambahkan data kursus contoh'

    def handle(self, *args, **options):
        samples = [
            {'title': 'Menulis untuk Internet', 'description': 'Bangun tulisan yang jelas, ringkas, dan berdaya.', 'instructor': 'Nadia Pratama', 'level': 'Pemula', 'duration': 6, 'price': 149000},
            {'title': 'Strategi Produk Digital', 'description': 'Dari ide menjadi produk yang dipakai banyak orang.', 'instructor': 'Raka Wijaya', 'level': 'Menengah', 'duration': 8, 'price': 249000},
            {'title': 'Data Storytelling', 'description': 'Ubah data kompleks menjadi cerita yang meyakinkan.', 'instructor': 'Maya Sari', 'level': 'Lanjutan', 'duration': 10, 'price': 299000},
        ]
        for sample in samples:
            Course.objects.get_or_create(title=sample['title'], defaults=sample)
        self.stdout.write(self.style.SUCCESS('Data kursus contoh berhasil ditambahkan.'))
