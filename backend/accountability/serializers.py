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
        read_only = True
    )

    room_title = serializers.CharField(
        source="room.title",
        read_only=True
    )

    class Meta:

        model = StudyUpdate

        fields = "__all__"

        read_only_fields = [
            "user"
        ]