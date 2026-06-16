from django.shortcuts import render

from .models import User
from .models import UserInterest

from .serializers import (UserInterestSerializer)
from .serializers import RegisterSerializer

from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import (IsAuthenticated)

from rest_framework.response import Response
from rest_framework import status

import nltk
from nltk.corpus import wordnet

class RegisterView(CreateAPIView):

    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class UserInterestCreateView(CreateAPIView):
    serializer_class = (UserInterestSerializer)
    permission_classes = [IsAuthenticated]

    try:
        wordnet.ensure_loaded()
    except LookupError:
        print("Downloading WordNet database... Please Wait.")
        nltk.download('wordnet')
        print("Download complete! \n")

    def create(self, request, *args, **kwargs):
        interest_text = request.data.get("interest")
        interest, created = (
            UserInterest.objects.get_or_create(
                user = request.user,
                interest = interest_text.lower()
            )
        )

        serializer = (
            UserInterestSerializer(
                interest
            )
        )

        if created:
            return Response(
                serializer.data,
                status = status.HTTP_201_CREATED
            )
        
        return Response(
            {
                "message": "Interest already exist",
                "interest": serializer.data
            }
        )
    

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)


class UserInterestListView(ListAPIView):
    serializer_class = (UserInterestSerializer)
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return(
            UserInterest.objects.filter(
                user = self.request.user
            ).order_by("-created_at")
        )
