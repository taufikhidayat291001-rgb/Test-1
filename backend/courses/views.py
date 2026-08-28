import requests
from django.conf import settings
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Activity, Course, Participant
from .serializers import ActivitySerializer, CourseSerializer, ParticipantSerializer


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]


class ParticipantViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.select_related('course').all()
    serializer_class = ParticipantSerializer
    permission_classes = [AllowAny]


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.select_related('course').all()
    serializer_class = ActivitySerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
def weather(request):
    city = request.query_params.get('city', '').strip()
    if not city:
        return Response({'detail': 'Parameter city wajib diisi.'}, status=status.HTTP_400_BAD_REQUEST)
    if not settings.OPENWEATHER_API_KEY:
        return Response({'detail': 'OPENWEATHER_API_KEY belum dikonfigurasi.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    for attempt in range(2):
        try:
            response = requests.get(
                'https://api.openweathermap.org/data/2.5/weather',
                params={'q': city, 'appid': settings.OPENWEATHER_API_KEY, 'units': 'metric', 'lang': 'id'},
                timeout=15,
            )
            return Response(response.json(), status=response.status_code)
        except requests.RequestException:
            if attempt == 1:
                return Response({'detail': 'OpenWeather sedang tidak dapat dihubungi. Coba lagi sebentar.'}, status=status.HTTP_502_BAD_GATEWAY)
