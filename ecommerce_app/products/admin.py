from django.contrib import admin

from products.models import (
    Product,
    Category,
    ProductVariant,
    ProductImage,
    Cart,
    CartItem,
    Wishlist
)

# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {"slug": ("name",)}

class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'base_price', 'buying_price', 'discount_price', 'is_active', 'is_featured', 'created_at']
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline, ProductVariantInline]

admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Wishlist)