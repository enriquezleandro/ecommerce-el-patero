import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from './ui/badge';
import { Logo } from './Logo';

interface HeaderProps {
  onNavigate: (page: string, productId?: string, category?: string) => void;
  onSearch: (query: string) => void;
  currentPage: string;
  categoryFilter?: string;
}

export function Header({ onNavigate, onSearch, currentPage, categoryFilter = '' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { getCartCount } = useCart();
  const { user, isAuthenticated } = useAuth();

  const categories = [
    { name: 'Indoor', value: 'indoor', isCategory: true },
    { name: 'Parafernalia', value: 'parafernalia', isCategory: true },
    { name: 'Fertilizantes', value: 'fertilizantes', isCategory: true },
    { name: 'Macetas', value: 'macetas', isCategory: true },
    { name: 'Indumentaria', value: 'indumentaria', isCategory: true },
    { name: 'Ofertas', value: 'ofertas', isCategory: false },
    { name: 'Info & Multimedia', value: 'info', isCategory: false },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      onNavigate('catalog');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-1">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">🌿 Envío gratis en compras superiores a $50.000 🌿</p>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="hover:opacity-80 transition-opacity cursor-pointer"
          >
            <Logo width={220} height={60} className="w-[160px] md:w-[220px]" />
          </button>

          {/* Search bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input-background"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden md:inline-flex"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate(isAuthenticated ? 'profile' : 'auth')}
            >
              <User className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => onNavigate('cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground"
                >
                  {getCartCount()}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Search bar - Mobile */}
        <form onSubmit={handleSearch} className="md:hidden mt-1 mb-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background"
            />
          </div>
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-6 -mt-1 pb-1">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors cursor-pointer ${
              currentPage === 'home' ? 'text-primary' : 'text-foreground hover:text-primary'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => onNavigate('catalog', undefined, '')}
            className={`transition-colors cursor-pointer ${
              currentPage === 'catalog' && !categoryFilter ? 'text-primary' : 'text-foreground hover:text-primary'
            }`}
          >
            Productos
          </button>
          {categories.map((cat) => {
            const isActive = cat.isCategory 
              ? (currentPage === 'catalog' && categoryFilter === cat.value)
              : currentPage === cat.value;
            
            return (
              <button
                key={cat.value}
                onClick={() => {
                  if (cat.isCategory) {
                    onNavigate('catalog', undefined, cat.value);
                  } else {
                    onNavigate(cat.value);
                  }
                }}
                className={`transition-colors cursor-pointer ${
                  isActive ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`text-left cursor-pointer ${
                currentPage === 'home' ? 'text-primary' : 'text-foreground'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => {
                onNavigate('catalog');
                setMobileMenuOpen(false);
              }}
              className={`text-left cursor-pointer ${
                currentPage === 'catalog' && !categoryFilter ? 'text-primary' : 'text-foreground'
              }`}
            >
              Productos
            </button>
            {categories.map((cat) => {
              const isActive = cat.isCategory 
                ? (currentPage === 'catalog' && categoryFilter === cat.value)
                : currentPage === cat.value;
              
              return (
                <button
                  key={cat.value}
                  onClick={() => {
                    if (cat.isCategory) {
                      onNavigate('catalog', undefined, cat.value);
                    } else {
                      onNavigate(cat.value);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left cursor-pointer ${
                    isActive ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span>{theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}</span>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
