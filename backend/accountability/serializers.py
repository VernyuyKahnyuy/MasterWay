from rest_framework import serializers

from .models import StudyUpdate


class StudyUpdateSerializer(
    serializers.ModelSerializer
):

    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    user = serializers.IntegerField(
        source="user.id",
        read_only=True
    )

    room_title = serializers.CharField(
        source="room.title",
        read_only=True
    )

    profile_picture = serializers.SerializerMethodField()

    def get_profile_picture(self, obj):
        try:
            pic = obj.user.profile.profile_picture
            if not pic:
                return None
            request = self.context.get("request")
            return request.build_absolute_uri(pic.url) if request else pic.url
        except Exception:
            return None

    class Meta:

        model = StudyUpdate

        fields = "__all__"

        read_only_fields = [
            "user"
        ]