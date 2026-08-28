from django.contrib import admin
from .models import Activity, Course, Participant


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'level', 'price', 'is_published')
    list_filter = ('level', 'is_published')
    search_fields = ('title', 'instructor')


@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'course', 'status', 'joined_at')
    list_filter = ('status', 'course')
    search_fields = ('name', 'email')


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('message', 'action', 'course', 'created_at')
    list_filter = ('action',)
