from django.shortcuts import render

from .models import User
from .models import UserInterest

from .serializers import (UserInterestSerializer)
from .serializers import RegisterSerializer

from rest_framework.generics import CreateAPIView, ListAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView

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

    # Ensure WordNet and POS Taggers are loaded once when the class is initialized
    try:
        wordnet.ensure_loaded()
    except LookupError:
        print("Downloading NLTK databases... Please Wait.")
        nltk.download('wordnet')
        nltk.download('punkt')
        nltk.download('punkt_tab', quiet=True)  # Handles newer NLTK version variations
        nltk.download('averaged_perceptron_tagger')
        nltk.download('averaged_perceptron_tagger_eng', quiet=True)
        print("Download complete! \n")

    def extract_keywords(self, text):
        """Extracts significant content words (nouns/verbs) from a sentence/phrase."""
        words = nltk.word_tokenize(text.lower())
        tagged_words = nltk.pos_tag(words)
        
        # Keep only Nouns (NN) and Verbs (VB) since they carry the interest's meaning
        keywords = [word for word, tag in tagged_words if tag.startswith('NN') or tag.startswith('VB')]
        
        # Fallback: if no nouns/verbs found, just return all tokens
        return keywords if keywords else words

    def get_text_synsets(self, text):
        """Gives back a combined set of all meanings for a word or an entire sentence."""
        words = text.split()
        
        # If it's a multi-word sentence, extract key words first
        if len(words) > 1:
            words = self.extract_keywords(text)
            
        all_synsets = set()
        for word in words:
            all_synsets.update(wordnet.synsets(word))
        return all_synsets

    def has_similar_synonym(self, user, new_interest_text):
        """Returns True if any key meaning overlaps with an existing interest."""
        new_synsets = self.get_text_synsets(new_interest_text)
        
        # If WordNet doesn't find any concepts, allow it to save (safe fallback)
        if not new_synsets:
            return False

        # Fetch existing user interests
        existing_interests = UserInterest.objects.filter(user=user).values_list('interest', flat=True)

        for existing_text in existing_interests:
            # Check for exact string match first to save processing time
            if new_interest_text.lower().strip() == existing_text.lower().strip():
                return True
                
            existing_synsets = self.get_text_synsets(existing_text)
            
            # Check for semantic overlap
            if new_synsets.intersection(existing_synsets):
                return True
                
        return False

    def create(self, request, *args, **kwargs):
        interest_text = request.data.get("interest", "").strip()
        
        if not interest_text:
            return Response(
                {"error": "Interest field is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 1: Run the smart text/sentence similarity check
        if self.has_similar_synonym(request.user, interest_text):
            return Response(
                {"message": "A similar or identical interest already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 2: Save the unique interest
        serializer = self.get_serializer(data={"interest": interest_text.lower()})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, 
            status=status.HTTP_201_CREATED, 
            headers=headers
        )
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserInterestListView(ListAPIView):
    serializer_class = (UserInterestSerializer)
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            UserInterest.objects.filter(
                user=self.request.user
            ).order_by("-created_at")
        )

class UserInterestDeleteView(DestroyAPIView):
    serializer_class=(UserInterestSerializer)
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            UserInterest.objects.filter(
                user = self.request.user
            )
        )


class AdminInterestCreateView(APIView):
    """Admin-only: add an interest to any user by user_id."""
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, user_id):
        interest_text = request.data.get("interest", "").strip().lower()
        if not interest_text:
            return Response({"detail": "Interest is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            target_user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        obj = UserInterest.objects.create(user=target_user, interest=interest_text)
        return Response(UserInterestSerializer(obj).data, status=status.HTTP_201_CREATED)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        u = request.user
        return Response({
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'role': u.role,
            'is_staff': u.is_staff,
            'is_superuser': u.is_superuser,
        })


class ElevateToAdminView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.is_superuser and user.is_staff:
            return Response({"detail": "Already an admin.", "already": True})

        user.is_staff = True
        user.is_superuser = True
        user.save(update_fields=["is_staff", "is_superuser"])

        return Response({
            "detail": f"{user.username} is now a Django admin.",
            "admin_url": "/admin/",
        })