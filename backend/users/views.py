from django.shortcuts import render

from .models import User
from .models import UserInterest

from .serializers import (UserInterestSerializer)
from .serializers import RegisterSerializer

from rest_framework.generics import CreateAPIView
from rest_framework.permissions import (IsAuthenticated)


class RegisterView(CreateAPIView):

    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class UserInterestCreateView(CreateAPIView):
    serializer_class = (UserInterestSerializer)
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)