from products.models import Category, Cart, Product

def category_context(request):
    categories = Category.objects.filter(
        is_active=True,
        parent__isnull = True
    ).prefetch_related('children')

    return {
        'categories':categories,
    }


def featured_products(request):
    return {
        'featured_products': Product.objects.filter(
            is_active=True,
            is_featured=True,
            category__is_active=True
        ).select_related('category')[:8]
    }

def cart_item_count(request):
    total_items = 0

    try:
        if request.user.is_authenticated:
            cart = Cart.objects.filter(customer=request.user.customer).first()
        else:
            session_id = request.session.session_key
            if not session_id:
                request.session.create()
                session_id = request.session.session_key
            cart = Cart.objects.filter(session_id=session_id).first()

        if cart:
            total_items = sum(item.quantity for item in cart.items.all())

    except Exception:
        total_items = 0

    return {
        'cart_item_count': total_items
    }
