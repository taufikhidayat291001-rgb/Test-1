from rest_framework import serializers
from .models import Activity, Course, Participant


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class ParticipantSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = Participant
        fields = '__all__'
        read_only_fields = ('id', 'joined_at', 'course_title')


class ActivitySerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = Activity
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'course_title')