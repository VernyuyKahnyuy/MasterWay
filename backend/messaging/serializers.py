#messaging/serializers.py

from rest_framework import serializers
from .models import Message


class MessageSerializer(
    serializers.ModelSerializer
):

    sender_username = serializers.CharField(
        source="sender.username",
        read_only=True
    )

    receiver_username = serializers.CharField(
        source="receiver.username",
        read_only=True
    )

    sender_profile_picture = serializers.SerializerMethodField()

    def get_sender_profile_picture(self, obj):
        try:
            pic = obj.sender.profile.profile_picture
            if not pic:
                return None
            request = self.context.get("request")
            return request.build_absolute_uri(pic.url) if request else pic.url
        except Exception:
            return None

    class Meta:

        model = Message
        fields = "__all__"
        read_only_fields = ['sender']
