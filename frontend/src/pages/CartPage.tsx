import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCart } from '../contexts/CartContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export function CartPage({ onNavigate }: CartPageProps) {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-muted rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="mb-4">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-8">
            ¡Descubre nuestros productos y encuentra lo que necesitas!
          </p>
          <Button onClick={() => onNavigate('catalog')}>
            Explorar Productos
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 50000 ? 0 : 5000;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
              className="bg-card border border-border rounded-lg p-4 flex gap-4"
            >
              <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                <ImageWithFallback
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="mb-1 truncate">{item.product.name}</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  {item.selectedSize && <p>Talle: {item.selectedSize}</p>}
                  {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                </div>
                <p className="text-primary mt-2">
                  ${item.product.price.toLocaleString('es-AR')}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="h-8 w-8"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="px-3 text-sm">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="h-8 w-8"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={clearCart}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Vaciar Carrito
          </Button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <h3 className="mb-6">Resumen del Pedido</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-secondary">Gratis</span>
                  ) : (
                    `$${shipping.toLocaleString('es-AR')}`
                  )}
                </span>
              </div>
              {subtotal < 50000 && (
                <p className="text-xs text-muted-foreground">
                  Te faltan ${(50000 - subtotal).toLocaleString('es-AR')} para envío gratis
                </p>
              )}
              <div className="border-t border-border pt-4">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-primary">
                    ${total.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="w-full mb-3"
              size="lg"
              onClick={() => onNavigate('checkout')}
            >
              Proceder al Pago
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => onNavigate('catalog')}
            >
              Continuar Comprando
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
