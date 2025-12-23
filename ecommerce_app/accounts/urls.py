from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('activate/<uuid:token>/', views.activate_user, name='activate'),
    path('forget_password/', views.sendResetLink.as_view(), name='forget_password'),
    path('reset-password/<uuid:token>/', views.resetPassword, name='reset_password'),

    path('logout/', views.logout_view, name='logout'),
    
    path('profile/', views.profile, name='profile')
]
