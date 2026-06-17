from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('api/rooms/', include('rooms.urls')),
    
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    path('api/users/', include('users.urls')),
    
    path('api/lessons/', include('lessons.urls')),

    path('api/enrollments/', include('progress.urls')),

    path('api/community/', include('community.urls')),

    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/ai/', include('ai_tools.urls')),

    path('api/profiles/', include('profiles.urls')), 

    path('api/messages/', include('messaging.urls')),

    path("api/accountability/", include("accountability.urls")
),

]

urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]

