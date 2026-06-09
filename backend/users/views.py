from django.shortcuts import render
from .models import User
from .serializers import RegisterSerializer
from rest_framework.generics import CreateAPIView

class RegisterView(CreateAPIView):

    queryset = User.objects.all()
    serializer_class = RegisterSerializer

