from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Profile

User = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    user = serializers.IntegerField(
        source="user.id",
        read_only=True,
    )

    class Meta:
        model = Profile
        fields = "__all__"


class AdminUserSerializer(serializers.ModelSerializer):
    """Flat user + profile snapshot for the admin panel user list."""
    profile_bio = serializers.SerializerMethodField()
    profile_interests = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()

    def get_profile_bio(self, obj):
        try:
            return obj.profile.bio
        except Exception:
            return ""

    def get_profile_interests(self, obj):
        try:
            return obj.profile.interests
        except Exception:
            return ""

    def get_profile_picture(self, obj):
        try:
            pic = obj.profile.profile_picture
            if not pic:
                return None
            request = self.context.get("request")
            return request.build_absolute_uri(pic.url) if request else pic.url
        except Exception:
            return None

    def get_streak_override(self, obj):
        try:
            return obj.profile.streak_override
        except Exception:
            return None

    streak_override = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "role",
            "is_staff", "date_joined",
            "profile_bio", "profile_interests", "profile_picture",
            "streak_override",
        ]