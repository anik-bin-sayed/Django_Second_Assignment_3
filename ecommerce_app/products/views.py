from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, UpdateView, DeleteView, DetailView
from django.contrib.auth.decorators import login_required
from django.views import View
from django.contrib import messages
from django.db import transaction

from orders.sslcommerz_service import SSLCommerzService

from products.models import (
    Category, Product, Cart, CartItem, ProductVariant
)
from accounts.models import (
    Customer, Address
)

from orders.models import (
    Order, OrderItem, Payment
)


# Create your views here.

class ProductListView(ListView):
    model = Product
    template_name = 'products/dashboard.html'
    context_object_name = 'products'
    paginate_by = 8

    def get_queryset(self):
        queryset  = Product.objects.filter(
            is_active = True,
            category__is_active = True
            ).select_related('category')
        category_slug = self.kwargs.get('slug')
        if category_slug:
            try:
                category = Category.objects.get(slug=category_slug, is_active=True)

                child_categories = category.children.all()
                if child_categories.exists():
                    queryset = queryset.filter(category__in=child_categories)
                else:
                    queryset = queryset.filter(category=category)
            except Category.DoesNotExist:
                queryset = queryset.none()
        sort = self.request.GET.get('sort')

        if sort == 'featured':
            queryset = queryset.filter(is_featured=True)
        elif sort == 'price_low':
            queryset = queryset.order_by('base_price')
        elif sort == 'price-high':
            queryset = queryset.order_by('-base_price')
        else:
            queryset = queryset.order_by('-created_at')
        
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.filter(
            is_active=True,
            parent__isnull=True
        )
        context['current_sort'] = self.request.GET.get('sort', 'newest')

        context['featured_products'] = Product.objects.filter(
            is_active=True,
            is_featured=True,
            category__is_active=True
        ).select_related('category')[:8]
        return context

def product_detail(request, slug):
    product = get_object_or_404(
        Product,
        category__slug=slug,
        is_active=True
    )

    variants = product.variants.filter(is_active=True)
    images = product.images.all()

    context = {
        'product': product,
        'variants': variants,
        'images': images,
    }

    return render(request, 'products/product-details.html', context)



def HomePage(request):
    return render(request, 'products/index.html')


def get_cart(request):
    """Get or create cart for user/session"""
    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(customer=request.user.customer)
    else:
        session_id = request.session.session_key
        if not session_id:
            request.session.create()
            session_id = request.session.session_key
        cart, created = Cart.objects.get_or_create(session_id=session_id)
    return cart


def cart_detail(request):
    cart = get_cart(request)
    items = cart.items.select_related('variant', 'variant__product')
    total = sum([item.subtotal for item in items])
    return render(request, 'products/cart.html', {
        'cart_items': items,
        'total': total
    })

def add_to_cart(request, variant_id):
    variant = get_object_or_404(ProductVariant, id=variant_id)
    cart = get_cart(request)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, variant=variant)
    if not created:
        cart_item.quantity += 1
        cart_item.save()
    return redirect('list_product')

def remove_cart_item(request, item_id):
    item = get_object_or_404(CartItem, id=item_id)
    item.delete()
    return redirect('cart_detail')

def update_cart_quantity(request, item_id, action):
    item = get_object_or_404(CartItem, id=item_id)
    if action == 'increase':
        item.quantity += 1
    elif action == 'decrease' and item.quantity > 1:
        item.quantity -= 1
    item.save()
    return redirect('cart_detail')

@login_required
def wishlist(request):
    return render(request, 'products/wishlist.html')

from django.views import View
from django.shortcuts import render, redirect
from django.contrib import messages
from django.db import transaction


class CheckoutView(View):
    def get(self, request):
        address = None
        cart = None

        if request.user.is_authenticated and not (
            request.user.is_staff or request.user.is_superuser
        ):
            customer, _ = Customer.objects.get_or_create(user=request.user)
            address = customer.addresses.order_by('-updated_at').first()
            cart = Cart.objects.filter(customer=customer).first()
        else:
            if not request.session.session_key:
                request.session.create()
            cart = Cart.objects.filter(
                session_id=request.session.session_key
            ).first()

        cart_items = []
        cart_subtotal = 0

        if cart:
            cart_items = cart.items.select_related(
                'variant', 'variant__product'
            )
            cart_subtotal = sum(item.subtotal for item in cart_items)

        context = {
            'address': address,
            'cart': cart,
            'cart_items': cart_items,
            'subtotal': cart_subtotal,
            'total': cart_subtotal,
            'selected_payment_type': request.session.get('payment_type'),
        }

        return render(request, 'products/checkout.html', context)

    def post(self, request):
        payment_type = request.POST.get('payment_type')

        if payment_type not in ('sslcommerz', 'cod'):
            messages.error(request, 'Please select a payment method.')
            return redirect('checkout')

        cart = None
        cart_items = []
        customer = None
        address = None

        if request.user.is_authenticated and not (
            request.user.is_staff or request.user.is_superuser
        ):
            customer, _ = Customer.objects.get_or_create(user=request.user)
            cart = Cart.objects.filter(customer=customer).first()
            address = customer.addresses.order_by('-updated_at').first()
        else:
            if not request.session.session_key:
                request.session.create()
            cart = Cart.objects.filter(
                session_id=request.session.session_key
            ).first()

        if cart:
            cart_items = list(
                cart.items.select_related(
                    'variant', 'variant__product'
                )
            )

        if not cart_items:
            messages.error(request, 'Your cart is empty.')
            return redirect('cart')

        # Form data
        first_name = (request.POST.get('first_name') or '').strip()
        last_name = (request.POST.get('last_name') or '').strip()
        full_name = f"{first_name} {last_name}".strip()

        phone = (request.POST.get('phone') or '').strip() or None
        address_line1 = (request.POST.get('address_line1') or '').strip()
        address_line2 = (request.POST.get('address_line2') or '').strip() or None
        city = (request.POST.get('city') or '').strip() or None
        state = (request.POST.get('state') or '').strip() or None
        postal_code = (request.POST.get('postal_code') or '').strip() or None
        country = (request.POST.get('country') or '').strip() or None

        if not address_line1:
            messages.error(request, 'Street address is required.')
            return redirect('checkout')

        
        if address is None:
            address = Address.objects.create(
                customer=customer,
                address_line1=address_line1
            )

        address.customer = customer
        address.full_name = full_name
        address.phone = phone
        address.address_line1 = address_line1
        address.address_line2 = address_line2
        address.city = city
        address.state = state
        address.postal_code = postal_code
        address.country = country
        address.save()

        with transaction.atomic():
            order_subtotal = sum(item.subtotal for item in cart_items)

            order = Order.objects.create(
                customer=customer,
                session_id=request.session.session_key if not customer else None,
                subtotal=order_subtotal,
                total=order_subtotal,
                status=Order.Status.PENDING,
            )

            for item in cart_items:
                if not item.variant:
                    continue
                OrderItem.objects.create(
                    order=order,
                    variant=item.variant,
                    quantity=item.quantity,
                    unit_price=item.variant.product.current_price,
                )

            payment = Payment.objects.create(
                order=order,
                payment_type=payment_type,
                amount=order.total,
                status=Payment.Status.PENDING,
            )

            address.order = order
            address.save(update_fields=['order', 'updated_at'])

            if payment_type == 'sslcommerz':
                try:
                    sslcz_service = SSLCommerzService()
                    tran_id, response = sslcz_service.create_payment_session(
                        order, customer, address
                    )

                    payment.tran_id = tran_id
                    payment.save(update_fields=['tran_id'])

                    if response.get('status') == 'SUCCESS':
                        return redirect(response.get('GatewayPageURL'))
                    else:
                        messages.error(request, 'Payment initialization failed.')
                        return redirect('cart_detail')

                except Exception as e:
                    messages.error(request, f'Payment error: {str(e)}')
                    return redirect('cart_detail')

            # Cash on Delivery
            cart.items.all().delete()
            request.session.pop('payment_type', None)
            messages.success(request, 'Order placed successfully.')
            return redirect('cart_detail')
