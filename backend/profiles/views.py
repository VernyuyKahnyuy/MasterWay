from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

from .models import Profile
from .serializers import ProfileSerializer

class MyProfileView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request
    ):

        profile = Profile.objects.get(
                user=request.user
            )

        serializer = ProfileSerializer(
                profile
            )

        return Response(
            serializer.data
        )
    
class UpdateProfileView( generics.UpdateAPIView):

    serializer_class = ProfileSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_object(self):

        return Profile.objects.get(
            user=self.request.user
        )
    
class PublicProfileView( generics.RetrieveAPIView):

    serializer_class = ProfileSerializer

    queryset = Profile.objects.all()

    lookup_field = "user_id"
