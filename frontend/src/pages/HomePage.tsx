import React from 'react';
import { ChevronRight, Lightbulb, Droplets, Package, Shirt, Tag, BookOpen, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { ProductCarousel } from '../components/ProductCarousel';
import { Product } from '../lib/types';
import { useCart } from '../contexts/CartContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface HomePageProps {
  onNavigate: (page: string, productId?: string, category?: string) => void;
  products: Product[];
}

export function HomePage({ onNavigate, products }: HomePageProps) {
  const { addToCart } = useCart();

  const featuredProducts = products.filter(p => p.isFeatured);
  const offerProducts = products.filter(p => p.isOnSale);

  const categories = [
    {
      name: 'Indoor',
      icon: Lightbulb,
      image: 'https://images.unsplash.com/photo-1681313409698-dbe22c68cfce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Luces, carpas y ventilación'
    },
    {
      name: 'Fertilizantes',
      icon: Droplets,
      image: 'https://images.unsplash.com/photo-1676083826533-1997f6a8dc28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Nutrientes de calidad'
    },
    {
      name: 'Macetas',
      icon: Package,
      image: 'https://images.unsplash.com/photo-1697813769280-0b46901aabb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Macetas y sustratos'
    },
    {
      name: 'Indumentaria',
      icon: Shirt,
      image: 'https://images.unsplash.com/photo-1696086152504-4843b2106ab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Moda urbana y cómoda'
    },
    {
      name: 'Parafernalia',
      icon: Package,
      image: 'https://images.unsplash.com/photo-1681313409698-dbe22c68cfce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Papeles, picadores y más'
    }
  ];

  const handleAddToCart = (product: Product) => {
    if (product.category === 'indumentaria' && (product.sizes || product.colors)) {
      // Redirect to product page for customization
      onNavigate('product', product.id);
    } else {
      addToCart(product);
      toast.success(`${product.name} agregado al carrito`);
    }
  };

  return (
    <div>
      {/* Hero Section with YouTube Video Background */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden h-[70vh] md:h-[80vh]">
        {/* YouTube Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <iframe
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full scale-150 md:scale-100 md:w-[100vw] md:h-[56.25vw] md:min-h-[100vh] md:min-w-[177.77vh]"
              src="https://www.youtube.com/embed/ega7TUTcfXI?autoplay=1&mute=1&loop=1&playlist=ega7TUTcfXI&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&vq=hd2160"
              title="Hero Video Background"
              allow="autoplay; encrypted-media"
              style={{ pointerEvents: 'none' }}
            />
          </div>
        </div>
        
        {/* Gradient Overlay - más sutil arriba, más oscuro abajo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70 z-[1]"></div>
        
        {/* Botones centrados en mobile, izquierda en desktop */}
        <div className="container mx-auto px-4 h-full relative z-10 flex items-end pb-12 md:pb-16 justify-center md:justify-start">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button
                size="lg"
                onClick={() => onNavigate('catalog', undefined, '')}
                className="bg-[#7FC06E] text-white hover:bg-[#2E5D3C] transition-colors duration-200 shadow-xl"
              >
                Ver Productos
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                onClick={() => onNavigate('ofertas')}
                className="bg-[#FF7E5F] text-white hover:bg-[#d96952] transition-colors duration-200 shadow-xl"
              >
                <Tag className="mr-2 w-5 h-5" />
                Ver Ofertas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-[2.1rem]">Categorías</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explora nuestras categorías especializadas en cultivo indoor y streetwear
          </p>
        </div>

        {/* Carrusel responsive para todos los tamaños */}
        <div className="block sm:hidden">
          {/* Mobile: 1 item */}
          <ProductCarousel itemsPerView={1}>
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                icon={category.icon}
                image={category.image}
                description={category.description}
                onClick={() => {
                  const categoryValue = category.name.toLowerCase();
                  if (categoryValue === 'macetas' || categoryValue === 'fertilizantes' || categoryValue === 'indoor' || categoryValue === 'indumentaria' || categoryValue === 'parafernalia') {
                    onNavigate('catalog', undefined, categoryValue);
                  } else {
                    onNavigate('catalog');
                  }
                }}
              />
            ))}
          </ProductCarousel>
        </div>
        
        <div className="hidden sm:block md:hidden">
          {/* Tablet: 2 items */}
          <ProductCarousel itemsPerView={2}>
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                icon={category.icon}
                image={category.image}
                description={category.description}
                onClick={() => {
                  const categoryValue = category.name.toLowerCase();
                  if (categoryValue === 'macetas' || categoryValue === 'fertilizantes' || categoryValue === 'indoor' || categoryValue === 'indumentaria' || categoryValue === 'parafernalia') {
                    onNavigate('catalog', undefined, categoryValue);
                  } else {
                    onNavigate('catalog');
                  }
                }}
              />
            ))}
          </ProductCarousel>
        </div>
        
        <div className="hidden md:block lg:hidden">
          {/* Tablet grande: 3 items */}
          <ProductCarousel itemsPerView={3}>
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                icon={category.icon}
                image={category.image}
                description={category.description}
                onClick={() => {
                  const categoryValue = category.name.toLowerCase();
                  if (categoryValue === 'macetas' || categoryValue === 'fertilizantes' || categoryValue === 'indoor' || categoryValue === 'indumentaria' || categoryValue === 'parafernalia') {
                    onNavigate('catalog', undefined, categoryValue);
                  } else {
                    onNavigate('catalog');
                  }
                }}
              />
            ))}
          </ProductCarousel>
        </div>
        
        <div className="hidden lg:block">
          {/* Desktop: 4 items */}
          <ProductCarousel itemsPerView={4}>
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                icon={category.icon}
                image={category.image}
                description={category.description}
                onClick={() => {
                  const categoryValue = category.name.toLowerCase();
                  if (categoryValue === 'macetas' || categoryValue === 'fertilizantes' || categoryValue === 'indoor' || categoryValue === 'indumentaria' || categoryValue === 'parafernalia') {
                    onNavigate('catalog', undefined, categoryValue);
                  } else {
                    onNavigate('catalog');
                  }
                }}
              />
            ))}
          </ProductCarousel>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-[2.1rem]">Productos Destacados</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Los mejores productos para tu cultivo y tu estilo
            </p>
            <Button variant="outline" onClick={() => onNavigate('catalog', undefined, '')}>
              Ver Todos
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* Carrusel responsive para todos los tamaños */}
          <div className="block sm:hidden">
            {/* Mobile: 1 item */}
            <ProductCarousel itemsPerView={1}>
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onNavigate('product', product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </ProductCarousel>
          </div>
          
          <div className="hidden sm:block md:hidden">
            {/* Tablet: 2 items */}
            <ProductCarousel itemsPerView={2}>
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onNavigate('product', product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </ProductCarousel>
          </div>
          
          <div className="hidden md:block lg:hidden">
            {/* Tablet grande: 3 items */}
            <ProductCarousel itemsPerView={3}>
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onNavigate('product', product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </ProductCarousel>
          </div>
          
          <div className="hidden lg:block">
            {/* Desktop: 4 items */}
            <ProductCarousel itemsPerView={4}>
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onNavigate('product', product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </ProductCarousel>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      {offerProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-[2.1rem]">Ofertas Especiales</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Aprovechá los mejores descuentos del mes
            </p>
            <Button variant="outline" onClick={() => onNavigate('ofertas')}>
              Ver Todas
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* Carrusel responsive para todos los tamaños */}
          <div className="block sm:hidden">
            {/* Mobile: 1 item */}
            <ProductCarousel itemsPerView={1}>
              {offerProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onNavigate('product', product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </ProductCarousel>
          </div>
          
          <div className="hidden sm:block md:hidden">
            {/* Tablet: 2 items */}
            <ProductCarousel itemsPerView={2}>
              {offerProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onNavigate('product', product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </ProductCarousel>
          </div>
          
          <div className="hidden md:block lg:hidden">
            {/* Tablet grande: 3 items */}
            <ProductCarousel itemsPerView={3}>
              {offerProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onNavigate('product', product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </ProductCarousel>
          </div>
          
          <div className="hidden lg:block">
            {/* Desktop: 4 items */}
            <ProductCarousel itemsPerView={4}>
              {offerProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onNavigate('product', product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </ProductCarousel>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="mb-2">Envíos Rápidos</h3>
            <p className="text-muted-foreground">
              Recibí tu pedido en 24-48hs en AMBA
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-secondary text-secondary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="mb-2">Calidad Garantizada</h3>
            <p className="text-muted-foreground">
              Productos de marcas reconocidas mundialmente
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-accent text-accent-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="mb-2">Asesoramiento</h3>
            <p className="text-muted-foreground">
              Guías y tutoriales para tu cultivo
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary text-secondary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-secondary-foreground">
            ¿Primera vez cultivando?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-secondary-foreground/90">
            Visitá nuestra sección Info & Multimedia con guías completas, 
            tutoriales en video y consejos de expertos.
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate('info')}
            className="bg-[#FF7E5F] text-white hover:bg-[#d96952] transition-colors duration-200"
          >
            <BookOpen className="mr-2 w-5 h-5" />
            Ver Guías
          </Button>
        </div>
      </section>
    </div>
  );
}
