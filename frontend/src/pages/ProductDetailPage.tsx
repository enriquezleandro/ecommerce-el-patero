import React, { useState } from 'react';
import { Star, ShoppingCart, Minus, Plus, ChevronLeft, Package, Shield, TruckIcon } from 'lucide-react';
import { Product } from '../lib/types';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useCart } from '../contexts/CartContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (page: string) => void;
}

export function ProductDetailPage({ product, onNavigate }: ProductDetailPageProps) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes?.[0]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors?.[0]
  );

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.category === 'indumentaria') {
      if (!selectedSize && product.sizes) {
        toast.error('Por favor selecciona un talle');
        return;
      }
      if (!selectedColor && product.colors) {
        toast.error('Por favor selecciona un color');
        return;
      }
    }

    addToCart(product, quantity, selectedSize, selectedColor);
    toast.success(`${quantity} ${product.name} agregado${quantity > 1 ? 's' : ''} al carrito`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => onNavigate('catalog')}
        className="mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Volver al catálogo
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <ImageWithFallback
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isOnSale && (
              <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                -{discount}% OFF
              </Badge>
            )}
            {product.isNew && (
              <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                Nuevo
              </Badge>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-border'
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="mb-2">{product.name}</h1>
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating!)
                          ? 'fill-accent text-accent'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span>{product.rating}</span>
                {product.reviews && (
                  <span className="text-muted-foreground">
                    ({product.reviews.length} reviews)
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-3xl text-primary">
              ${product.price.toLocaleString('es-AR')}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString('es-AR')}
              </span>
            )}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {/* Sizes (for clothing) */}
          {product.sizes && (
            <div>
              <h4 className="mb-3">Talle</h4>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Colors (for clothing) */}
          {product.colors && (
            <div>
              <h4 className="mb-3">Color</h4>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {product.colors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h4 className="mb-3">Cantidad</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-6">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stock} disponibles
              </span>
            </div>
          </div>

          {/* Add to cart */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
          </Button>

          {/* Benefits */}
          <div className="space-y-3 pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <TruckIcon className="w-5 h-5 text-primary" />
              <span className="text-sm">Envío gratis en compras superiores a $50.000</span>
            </div>
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-primary" />
              <span className="text-sm">Entrega en 24-48hs en AMBA</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm">Garantía de calidad</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="specs">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="specs">Especificaciones</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="specs" className="mt-6">
            {product.specifications ? (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="mb-4">Especificaciones Técnicas</h3>
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="text-muted-foreground">{key}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No hay especificaciones disponibles</p>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="mb-4">Reviews de Clientes</h3>
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span>{review.userName}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'fill-accent text-accent' : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                      <p className="text-xs text-muted-foreground mt-2">{review.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Aún no hay reviews. ¡Sé el primero en dejar uno!
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
