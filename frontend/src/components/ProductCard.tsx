import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../lib/types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart: () => void;
}

export function ProductCard({ product, onClick, onAddToCart }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      indoor: 'Indoor',
      parafernalia: 'Parafernalia',
      fertilizantes: 'Fertilizantes',
      macetas: 'Macetas',
      indumentaria: 'Indumentaria'
    };
    return labels[category] || category;
  };

  return (
    <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative aspect-square overflow-hidden" onClick={onClick}>
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-card/90 backdrop-blur-sm">
            {getCategoryLabel(product.category)}
          </Badge>
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-secondary text-secondary-foreground">Nuevo</Badge>
          )}
          {product.isOnSale && (
            <Badge className="bg-accent text-accent-foreground">-{discount}%</Badge>
          )}
        </div>
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="destructive">¡Últimas unidades!</Badge>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2">Sin Stock</Badge>
          </div>
        )}
      </div>

      <div className="p-4" onClick={onClick}>
        <h3 className="line-clamp-2 mb-2">{product.name}</h3>
        
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm">{product.rating}</span>
          </div>
        )}

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-primary">${product.price.toLocaleString('es-AR')}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toLocaleString('es-AR')}
            </span>
          )}
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="w-full"
          disabled={product.stock === 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Agregar al Carrito
        </Button>
      </div>
    </div>
  );
}
