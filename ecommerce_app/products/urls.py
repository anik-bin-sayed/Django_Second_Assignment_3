from django.urls import path
from products.views import (
    ProductListView,
    HomePage,
    wishlist,
    cart_detail,
    add_to_cart,
    remove_cart_item,
    update_cart_quantity,
    product_detail,
    CheckoutView
)

urlpatterns = [
    path(
        'dashboard/',
        ProductListView.as_view(),
        name='list_product'
    ),
    path(
        'category/<slug:slug>/',
        ProductListView.as_view(),
        name='category_products'
    ),
    path('product/<slug:slug>/', product_detail, name='product_details'),

    path('wishlist/', wishlist, name='wishlist'),

    path('cart/', cart_detail, name='cart_detail'),
    path('cart/add/<int:variant_id>/', add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:item_id>/', remove_cart_item, name='remove_cart_item'),
    path('cart/update/<int:item_id>/<str:action>/', update_cart_quantity, name='update_cart_quantity'),

    path('checkout/', CheckoutView.as_view(), name='checkout'),


    path('', HomePage, name='home'),
]
