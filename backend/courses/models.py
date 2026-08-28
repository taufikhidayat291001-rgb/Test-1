from django.db import models


class Course(models.Model):
    LEVELS = [
        ('Pemula', 'Pemula'),
        ('Menengah', 'Menengah'),
        ('Lanjutan', 'Lanjutan'),
    ]

    title = models.CharField(max_length=160)
    description = models.TextField()
    instructor = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=LEVELS, default='Pemula')
    duration = models.PositiveIntegerField(help_text='Durasi dalam jam')
    price = models.DecimalField(max_digits=12, decimal_places=2)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Participant(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='participants')
    status = models.CharField(max_length=20, choices=[('Aktif', 'Aktif'), ('Selesai', 'Selesai')], default='Aktif')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-joined_at']

    def __str__(self):
        return self.name


class Activity(models.Model):
    ACTIONS = [('Pendaftaran', 'Pendaftaran'), ('Publikasi', 'Publikasi'), ('Pembaruan', 'Pembaruan')]
    message = models.CharField(max_length=220)
    action = models.CharField(max_length=20, choices=ACTIONS, default='Pembaruan')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True, related_name='activities')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.message
