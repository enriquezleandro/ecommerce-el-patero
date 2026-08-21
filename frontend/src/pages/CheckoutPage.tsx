import React, { useEffect, useState } from 'react';
import { ChevronLeft, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { createPreference, createOrder } from '../lib/api';
import { toast } from 'sonner@2.0.3';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
  initialStep?: CheckoutStep;
}

type CheckoutStep = 1 | 2 | 3;

// El pedido para Mercado Pago se crea ANTES de redirigir (no cuando vuelve):
// así el webhook (ver backend/src/controllers/payments.controller.js) es la
// única fuente de verdad de si se pagó o no, en vez de confiar en que el
// navegador vuelva. Acá solo se guarda el id para poder mostrarlo en la
// pantalla de confirmación después del reload que hace MP al volver.
const LAST_ORDER_ID_KEY = 'lastOrderId';

export function CheckoutPage({ onNavigate, initialStep }: CheckoutPageProps) {
  const { items, getCartTotal, clearCart } = useCart();
  const { user, token, isAuthenticated } = useAuth();
  const [step, setStep] = useState<CheckoutStep>(initialStep ?? 1);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Se llega acá con initialStep=3 cuando Mercado Pago redirige de vuelta
    // (ver App.tsx). El pedido ya existe desde antes de ir a pagar y el
    // webhook es quien lo va a marcar como pagado — acá solo queda mostrar
    // el número de pedido guardado y vaciar el carrito.
    if (initialStep !== 3) return;

    const lastOrderId = localStorage.getItem(LAST_ORDER_ID_KEY);
    if (lastOrderId) {
      setConfirmedOrderId(lastOrderId);
      localStorage.removeItem(LAST_ORDER_ID_KEY);
    }

    // Se borra la key de localStorage directo, no clearCart() del contexto:
    // este es el primer montado de la página (volver de MP es un reload
    // completo), y el efecto de CartProvider que carga el carrito desde
    // localStorage corre DESPUÉS que este por ser ancestro — si solo
    // tocáramos el estado de React acá, ese efecto posterior pisaría el
    // carrito vacío con el valor viejo que todavía sigue en localStorage.
    localStorage.removeItem('cart');
  }, [initialStep]);

  // Shipping info
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.address?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    province: user?.address?.province || '',
    postalCode: user?.address?.postalCode || '',
  });

  // Payment info
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'credit' | 'debit'>('mercadopago');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 50000 ? 0 : 5000;
  const total = subtotal + shipping;

  if (items.length === 0 && step !== 3) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
        <Button onClick={() => onNavigate('catalog')}>Ir a Comprar</Button>
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Por favor inicia sesión para continuar');
      onNavigate('auth');
      return;
    }
    setStep(2);
  };

  const shippingAddress = {
    street: shippingInfo.street,
    city: shippingInfo.city,
    province: shippingInfo.province,
    postalCode: shippingInfo.postalCode,
    phone: shippingInfo.phone,
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'mercadopago') {
      if (!token) {
        toast.error('Por favor inicia sesión para continuar');
        onNavigate('auth');
        return;
      }

      setProcessingPayment(true);
      try {
        // El pedido se crea ANTES de ir a pagar, con estado "pending": es el
        // webhook el que después lo confirma o lo cancela, nunca este código.
        const order = await createOrder(token, { items, total, shippingAddress, paymentMethod: 'Mercado Pago' });
        localStorage.setItem(LAST_ORDER_ID_KEY, order.id);

        const { init_point, sandbox_init_point } = await createPreference(items, shipping, order.id);
        window.location.href = init_point || sandbox_init_point;
      } catch {
        localStorage.removeItem(LAST_ORDER_ID_KEY);
        toast.error('No pudimos iniciar el pago con Mercado Pago. Intentá de nuevo.');
        setProcessingPayment(false);
      }
      return;
    }

    // Tarjeta de crédito/débito: no hay procesador real integrado todavía,
    // se mantiene la simulación existente, pero el pedido que queda
    // registrado en el perfil ya es real.
    setProcessingPayment(true);
    setTimeout(async () => {
      if (token) {
        try {
          const order = await createOrder(token, {
            items,
            total,
            shippingAddress,
            paymentMethod: paymentMethod === 'credit' ? 'Tarjeta de Crédito' : 'Tarjeta de Débito',
          });
          setConfirmedOrderId(order.id);
        } catch {
          toast.error('No pudimos guardar el pedido en tu historial, pero el pago simulado se completó.');
        }
      }
      setProcessingPayment(false);
      setStep(3);
      clearCart();
      toast.success('¡Pedido realizado con éxito!');
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      {step !== 3 && (
        <Button
          variant="ghost"
          onClick={() => step === 1 ? onNavigate('cart') : setStep((step - 1) as CheckoutStep)}
          className="mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      )}

      <h1 className="mb-8">Checkout</h1>

      {/* Steps indicator */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-4">
          {[
            { number: 1, label: 'Envío', icon: Truck },
            { number: 2, label: 'Pago', icon: CreditCard },
            { number: 3, label: 'Confirmación', icon: CheckCircle },
          ].map(({ number, label, icon: Icon }) => (
            <React.Fragment key={number}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    step >= number
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm mt-2 hidden sm:block">{label}</span>
              </div>
              {number < 3 && (
                <div
                  className={`w-16 h-0.5 ${
                    step > number ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="mb-6">Información de Envío</h2>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nombre Completo</Label>
                    <Input
                      id="fullName"
                      required
                      value={shippingInfo.fullName}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    required
                    value={shippingInfo.phone}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="street">Dirección</Label>
                  <Input
                    id="street"
                    required
                    value={shippingInfo.street}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, street: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      required
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, city: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="province">Provincia</Label>
                    <Input
                      id="province"
                      required
                      value={shippingInfo.province}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, province: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Código Postal</Label>
                    <Input
                      id="postalCode"
                      required
                      value={shippingInfo.postalCode}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, postalCode: e.target.value })
                      }
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Continuar al Pago
                </Button>
              </form>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="mb-6">Método de Pago</h2>
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                  <div className="flex items-center space-x-2 p-4 border border-border rounded-lg">
                    <RadioGroupItem value="mercadopago" id="mercadopago" />
                    <Label htmlFor="mercadopago" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span>Mercado Pago</span>
                        <span className="text-sm text-muted-foreground">Tarjetas, efectivo, etc.</span>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border border-border rounded-lg">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit" className="flex-1 cursor-pointer">
                      Tarjeta de Crédito
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border border-border rounded-lg">
                    <RadioGroupItem value="debit" id="debit" />
                    <Label htmlFor="debit" className="flex-1 cursor-pointer">
                      Tarjeta de Débito
                    </Label>
                  </div>
                </RadioGroup>

                {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        required
                        value={cardInfo.number}
                        onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                      <Input
                        id="cardName"
                        required
                        value={cardInfo.name}
                        onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Vencimiento</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/AA"
                          required
                          value={cardInfo.expiry}
                          onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          required
                          value={cardInfo.cvv}
                          onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={processingPayment}>
                  Confirmar Pedido
                </Button>
              </form>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="bg-secondary/20 text-secondary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="mb-4">¡Pedido Confirmado!</h2>
              <p className="text-muted-foreground mb-8">
                Gracias por tu compra. Recibirás un email con los detalles de tu pedido.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 mb-8">
                <p className="text-sm text-muted-foreground mb-2">Número de Pedido</p>
                <p className="text-2xl text-primary">
                  #{(confirmedOrderId || Date.now().toString()).slice(-8)}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => onNavigate('profile')}>
                  Ver Mis Pedidos
                </Button>
                <Button variant="outline" onClick={() => onNavigate('home')}>
                  Volver al Inicio
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        {step !== 3 && (
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h3 className="mb-6">Resumen del Pedido</h3>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 flex-shrink-0 rounded bg-muted overflow-hidden">
                      <ImageWithFallback
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x ${item.product.price.toLocaleString('es-AR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-secondary">Gratis</span>
                    ) : (
                      `$${shipping.toLocaleString('es-AR')}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">
                    ${total.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
