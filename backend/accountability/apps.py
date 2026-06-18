from django.apps import AppConfig


class AccountabilityConfig(AppConfig):
    name = 'accountability'

    def ready(self):
        import accountability.signals  # noqa: F401
