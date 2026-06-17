from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from collections import defaultdict

from users.models import UserInterest
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

        profile, _ = Profile.objects.get_or_create(
                user=request.user
            )

        serializer = ProfileSerializer(
            profile,
            context={'request': request}
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

        profile, _ = Profile.objects.get_or_create(
            user=self.request.user
        )
        return profile
    
class PublicProfileView( generics.RetrieveAPIView):

    serializer_class = ProfileSerializer

    queryset = Profile.objects.all()

    lookup_field = "user_id"


class SimilarLearnersView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        my_interests = UserInterest.objects.filter(
            user=request.user
        )

        my_interest_names = [
            interest.interest.lower().strip()
            for interest in my_interests
            if interest.interest
        ]

        print(
            "My interests:",
            my_interest_names
        )

        if not my_interest_names:

            return Response([])

        scores = defaultdict(int)

        for interest in my_interest_names:

            matching_interests = UserInterest.objects.filter(
                interest__iexact=interest
            ).exclude(
                user=request.user
            )

            for match in matching_interests:

                scores[match.user.id] += 1

        sorted_users = sorted(
            scores.items(),
            key=lambda x: x[1],
            reverse=True
        )

        user_ids = [
            user_id
            for user_id, score in sorted_users
        ]

        profiles = Profile.objects.filter(
            user_id__in=user_ids
        )

        data = []

        for user_id, score in sorted_users:
        
            try:
            
                profile = Profile.objects.get(
                    user_id=user_id
                )

                serialized = ProfileSerializer(
                    profile
                ).data

                serialized[
                    "shared_interests"
                ] = score

                data.append(
                    serialized
                )

            except Profile.DoesNotExist:
            
                pass
            
        return Response(data)

        # return Response(
        #     serializer.data
        # )
    