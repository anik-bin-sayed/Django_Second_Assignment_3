from django.contrib import admin
from accounts.models import (
    Customer, EmailVarificationToken, PendingUser, Address
)
# Register your models here.

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'phone',
        'fullname',
        'email_varified',
        'created_at',
    )
    list_filter = ('email_varified', 'created_at')
    search_fields =(
        'user__fullname',
        'user__email',
        'phone'
    )
    ordering = ('-created_at',)

@admin.register(EmailVarificationToken)
class EmailVarificationTokenAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'token',
        'created_at',
        'expires_at',
    )
    list_filter = ('created_at', 'expires_at')
    search_fields = (
        'user__first_name',
        'user__email',
        'token',
    )
    ordering = ('-created_at',)

@admin.register(PendingUser)
class PendingUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'token')

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name")