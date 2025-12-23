import uuid

from django.views import View
from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from django.contrib import messages
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate, logout
from django.shortcuts import render, redirect, get_object_or_404

from .models import Customer, ResetPassword, PendingUser

# Create your views here.
def register_view(request):
    if request.method == 'POST':
        fullname = request.POST.get('fullname', '').strip()
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '').strip()
    
        if not all([fullname, email, password]):
            messages.error(request, 'All fields are required.')
            return redirect('register')
        
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists.')
            return redirect('register')
        
        token = uuid.uuid4()
        expires_at = timezone.now() + timedelta(hours=1)

        PendingUser.objects.create(
            username=email,
            email=email,
            password=password,
            fullname = fullname,
            token = token,
            expires_at=expires_at
        )

        reset_link = f"{settings.SITE_URL.rstrip('/')}/accounts/activate/{token}/"

        send_mail(
            subject="Reset Your Password",
            message=f"Click the link to Activate your account :\n{reset_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        messages.success(request, f"Activation link has been send to your account : {email}")
        return redirect('register')
    return render(request, 'accounts/signup.html')

def activate_user(request, token):
    pending_user = PendingUser.objects.filter(token=token).first()

    if not pending_user:
        messages.error(request, 'Invalid activation link!')
        return redirect('redister')
    
    if not pending_user.is_valid():
         messages.error(request, 'IActivation token expired!')
         pending_user.delete()
         return redirect('register')

    user = User.objects.create(
        username = pending_user.email,
        email = pending_user.email,
        first_name = pending_user.fullname,
    )
    user.set_password(pending_user.password)
    user.customer.email_varified = True
    user.customer.fullname = pending_user.fullname
    user.customer.save()

    user.save()
    pending_user.delete()
    login(request, user, backend='django.contrib.auth.backends.ModelBackend')
    messages.success(request, 'Your account has been acctivated successfully...')
    return redirect('dashboard')

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '').strip()
        
        if not all([email, password]):
            messages.error(request, 'Email and password are required')
            return redirect('login')
    
        try:
            user_info = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, 'Invalid email or password.')
            return redirect('login')

        if not user_info.customer.email_varified:
            messages.error(request, 'Please verify your email before login.')
            return redirect('login')

        user = authenticate(
            request,
            username = user_info.email,
            password = password
        )

        if user is None:
            messages.error(request, 'Invalid email or password.')
            return redirect('login')

        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        messages.success(request, 'Login successful!')
        return redirect('dashboard')


    return render(request, 'accounts/login.html')

@login_required
def logout_view(request):
    logout(request)
    return redirect('login')

class sendResetLink(View):
    def get(self, request):
        return render(request, 'accounts/forgot-password.html')
    
    def post(self, request):
        email = request.POST.get('resetEmail', '').strip()

        try:
            find_user = User.objects.get(email=email)
            # messages.success(request, f"User found: {find_user.email}")
        except User.DoesNotExist:
            messages.error(request, 'User not found!!!')
            return render(request, 'accounts/forgot-password.html')

        token_obj = ResetPassword.objects.create(user=find_user)
        
        reset_link = f"{settings.SITE_URL.rstrip('/')}/accounts/reset-password/{token_obj.token}/"

        send_mail(
            subject="Reset Your Password",
            message=f"Click the link to reset password:\n{reset_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        messages.success(request, f"Reset password link sent to your email: {email}")
        return redirect('forget_password')


def resetPassword(request, token):
    if request.method == "POST":
        password = request.POST.get('password', '').strip()
        confirm_password = request.POST.get('confirm_password', '').strip()

        if not all([password, confirm_password]):
            messages.error(request, 'Both fields are required!')
            return redirect('reset_password', token=token)
        
        if password != confirm_password:
            messages.error(request, 'Password does not match!')
            return redirect('reset_password', token=token)

        if len(password) < 8:
            messages.error(request, 'Password must be at least 8 characters')
            return redirect('reset_password', token=token)
    
        try:
            reset_token = ResetPassword.objects.get(token=token)
            if not reset_token.is_valid():
                messages.error(request, 'This reset link has expired or been used.')
                return redirect('reset_password', token=token)
            
            user = reset_token.user
            user.set_password(password)
            user.save()

            reset_token.is_used = True
            reset_token.save()

            messages.success(request, 'Password reset successful. Please login.')
            return redirect('login')
        except ResetPassword.DoesNotExist:
            messages.error(request, 'Invalid reset token...')
            return redirect('reset_password')
    return render(request, 'accounts/reset-password.html', {'token': token})

@login_required
def profile(request):
    customer = request.user.customer
    addresses = customer.addresses.all()
    order_count = 2
    wishlish_count = 4
    reviews_count = 2

    context = {
        'customer':customer,
        'addresses':addresses,
        'order_count':order_count,
        'wishlist_count' : wishlish_count,
        'reviews_count': reviews_count
    }
    return render(request, 'accounts/profile.html', context)