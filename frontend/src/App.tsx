import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { OffersPage } from './pages/OffersPage';
import { InfoPage } from './pages/InfoPage';
import { Product } from './lib/types';
import { getProducts } from './lib/api';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'checkout' | 'auth' | 'profile' | 'ofertas' | 'info';

// Mercado Pago redirige de vuelta acá con ?checkout=success|failure|pending
// (esta app no usa react-router, así que no hay /checkout/success real).
function readCheckoutStatusFromUrl(): 'success' | 'failure' | 'pending' | null {
  const status = new URLSearchParams(window.location.search).get('checkout');
  if (status === 'success' || status === 'failure' || status === 'pending') return status;
  return null;
}

export default function App() {
  const checkoutStatus = readCheckoutStatusFromUrl();

  const [currentPage, setCurrentPage] = useState<Page>(checkoutStatus ? 'checkout' : 'home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => toast.error('No pudimos cargar el catálogo. Intentá de nuevo en unos minutos.'));
  }, []);

  useEffect(() => {
    if (!checkoutStatus) return;

    // Limpia el query param para no re-disparar esto si se refresca la página.
    window.history.replaceState({}, '', window.location.pathname);

    if (checkoutStatus === 'failure') {
      toast.error('El pago no se pudo completar. Tus productos siguen en el carrito.');
      setCurrentPage('cart');
    } else if (checkoutStatus === 'pending') {
      toast.info('Tu pago está pendiente de confirmación.');
      setCurrentPage('cart');
    }
    // 'success' se maneja pasando initialStep=3 a CheckoutPage más abajo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigate = (page: string, productId?: string, category?: string) => {
    setCurrentPage(page as Page);
    if (productId) {
      setSelectedProductId(productId);
    }
    
    // Limpiar búsqueda cuando se navega a otra página (excepto catalog)
    if (page !== 'catalog') {
      setSearchQuery('');
      setCategoryFilter('');
    }
    
    // Si se pasa una categoría, setearla
    if (category !== undefined) {
      setCategoryFilter(category);
    }
    
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCategoryFilter(''); // Limpiar filtro de categoría cuando se busca
  };

  const selectedProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId)
    : null;

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} products={products} />;
      case 'catalog':
        return <CatalogPage products={products} onNavigate={handleNavigate} searchQuery={searchQuery} categoryFilter={categoryFilter} />;
      case 'product':
        return selectedProduct ? (
          <ProductDetailPage product={selectedProduct} onNavigate={handleNavigate} />
        ) : (
          <div className="container mx-auto px-4 py-16 text-center">
            <p>Producto no encontrado</p>
          </div>
        );
      case 'cart':
        return <CartPage onNavigate={handleNavigate} />;
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} initialStep={checkoutStatus === 'success' ? 3 : undefined} />;
      case 'auth':
        return <AuthPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case 'ofertas':
        return <OffersPage products={products} onNavigate={handleNavigate} />;
      case 'info':
        return <InfoPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} products={products} />;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header
              onNavigate={handleNavigate}
              onSearch={handleSearch}
              currentPage={currentPage}
              categoryFilter={categoryFilter}
            />
            <main className="flex-1">
              {renderPage()}
            </main>
            <Footer />
            <Toaster position="bottom-right" />
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
