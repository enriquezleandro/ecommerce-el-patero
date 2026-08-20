import React, { useState, useMemo } from "react";
import {
  Filter,
  SlidersHorizontal,
  Plus,
  Minus,
} from "lucide-react";
import { Product, ProductCategory } from "../lib/types";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner@2.0.3";

interface CatalogPageProps {
  products: Product[];
  onNavigate: (
    page: string,
    productId?: string,
    category?: string,
  ) => void;
  searchQuery?: string;
  categoryFilter?: string;
}

type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "popular";

export function CatalogPage({
  products,
  onNavigate,
  searchQuery = "",
  categoryFilter = "",
}: CatalogPageProps) {
  const { addToCart } = useCart();

  const maxPrice = React.useMemo(() => {
    return Math.max(...products.map((p) => p.price));
  }, [products]);

  const [selectedCategories, setSelectedCategories] = useState<
    ProductCategory[]
  >([]);
  const [priceRange, setPriceRange] = useState<
    [number, number]
  >([0, maxPrice]);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [showSaleOnly, setShowSaleOnly] = useState(false);

  // Estados temporales para los inputs
  const [tempMinPrice, setTempMinPrice] = useState("0");
  const [tempMaxPrice, setTempMaxPrice] = useState(
    String(maxPrice),
  );

  // Refs para los intervalos de mantener presionado
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Refs para controlar edición sin causar re-renders
  const isEditingMinRef = React.useRef(false);
  const isEditingMaxRef = React.useRef(false);

  // Refs para los inputs
  const minPriceInputRef = React.useRef<HTMLInputElement>(null);
  const maxPriceInputRef = React.useRef<HTMLInputElement>(null);

  // Sincronizar el máximo cuando cambia
  React.useEffect(() => {
    setPriceRange([0, maxPrice]);
    if (!isEditingMinRef.current) setTempMinPrice("0");
    if (!isEditingMaxRef.current)
      setTempMaxPrice(String(maxPrice));
  }, [maxPrice]);

  // Sincronizar valores temporales cuando priceRange cambia (desde el slider o botones)
  React.useEffect(() => {
    if (!isEditingMinRef.current) {
      setTempMinPrice(String(priceRange[0]));
    }
    if (!isEditingMaxRef.current) {
      setTempMaxPrice(String(priceRange[1]));
    }
  }, [priceRange]);

  // Aplicar filtro de categoría desde la navegación
  React.useEffect(() => {
    if (categoryFilter) {
      setSelectedCategories([
        categoryFilter as ProductCategory,
      ]);
    } else if (categoryFilter === "") {
      // Si es string vacío, mostrar todas las categorías
      setSelectedCategories([]);
    }
  }, [categoryFilter]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          p.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category),
      );
    }

    // Price filter
    filtered = filtered.filter(
      (p) =>
        p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    // New products filter
    if (showNewOnly) {
      filtered = filtered.filter((p) => p.isNew);
    }

    // Sale products filter
    if (showSaleOnly) {
      filtered = filtered.filter((p) => p.isOnSale);
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort(
          (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0),
        );
        break;
      case "popular":
        filtered.sort(
          (a, b) => (b.rating || 0) - (a.rating || 0),
        );
        break;
      case "featured":
      default:
        filtered.sort(
          (a, b) =>
            (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0),
        );
        break;
    }

    return filtered;
  }, [
    products,
    searchQuery,
    selectedCategories,
    priceRange,
    sortBy,
    showNewOnly,
    showSaleOnly,
  ]);

  const toggleCategory = (category: ProductCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
    setShowNewOnly(false);
    setShowSaleOnly(false);
  };

  const handlePriceRangeChange = (values: number[]) => {
    if (values.length === 2) {
      setPriceRange([values[0], values[1]]);
    }
  };

  const handleMinPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setTempMinPrice(value);
    }
  };

  const handleMaxPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setTempMaxPrice(value);
    }
  };

  // 🔹 Cuando el usuario termina de editar el precio mínimo (onBlur)
  const handleMinPriceBlur = () => {
    const newMin = Math.max(0, Number(tempMinPrice) || 0);
    const [, max] = priceRange;
    const clampedMin = Math.min(newMin, max);
    setPriceRange([clampedMin, max]);
    setTempMinPrice(String(clampedMin));
    isEditingMinRef.current = false;
  };

  // 🔹 Cuando el usuario termina de editar el precio máximo (onBlur)
  const handleMaxPriceBlur = () => {
    const newMax = Math.min(
      maxPrice,
      Number(tempMaxPrice) || maxPrice,
    );
    const [min] = priceRange;
    const clampedMax = Math.max(newMax, min);
    setPriceRange([min, clampedMax]);
    setTempMaxPrice(String(clampedMax));
    isEditingMaxRef.current = false;
  };

  const handleMinPriceFocus = () => {
    isEditingMinRef.current = true;
  };

  const handleMaxPriceFocus = () => {
    isEditingMaxRef.current = true;
  };

  const handleMinPriceKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      minPriceInputRef.current?.blur();
    }
  };

  const handleMaxPriceKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      maxPriceInputRef.current?.blur();
    }
  };

  const incrementMinPrice = () => {
    setPriceRange((prev) => {
      const newValue = Math.min(prev[0] + 1000, prev[1]);
      return [newValue, prev[1]];
    });
  };

  const decrementMinPrice = () => {
    setPriceRange((prev) => {
      const newValue = Math.max(prev[0] - 1000, 0);
      return [newValue, prev[1]];
    });
  };

  const incrementMaxPrice = () => {
    setPriceRange((prev) => {
      const newValue = Math.min(prev[1] + 1000, maxPrice);
      return [prev[0], newValue];
    });
  };

  const decrementMaxPrice = () => {
    setPriceRange((prev) => {
      const newValue = Math.max(prev[1] - 1000, prev[0]);
      return [prev[0], newValue];
    });
  };

  // Handlers para mantener presionado
  const clearTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startRepeat = (action: () => void) => {
    clearTimers();
    action(); // Ejecutar inmediatamente

    // Esperar 300ms antes de empezar la repetición
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(action, 100);
    }, 300);
  };

  const handleMouseDown = (action: () => void) => {
    startRepeat(action);
  };

  const handleMouseUp = () => {
    clearTimers();
  };

  const handleAddToCart = (product: Product) => {
    if (
      product.category === "indumentaria" &&
      (product.sizes || product.colors)
    ) {
      onNavigate("product", product.id);
    } else {
      addToCart(product);
      toast.success(`${product.name} agregado al carrito`);
    }
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="mb-3">Categorías</h4>
        <div className="space-y-2">
          {(
            [
              "indoor",
              "parafernalia",
              "fertilizantes",
              "macetas",
              "indumentaria",
            ] as ProductCategory[]
          ).map((cat) => (
            <div
              key={cat}
              className="flex items-center space-x-2"
            >
              <Checkbox
                id={`cat-${cat}`}
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
              />
              <Label
                htmlFor={`cat-${cat}`}
                className="cursor-pointer capitalize"
              >
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="mb-3">Rango de Precio</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <Label
                htmlFor="min-price"
                className="text-xs mb-1 block"
              >
                Mínimo
              </Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onMouseDown={() =>
                    handleMouseDown(decrementMinPrice)
                  }
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={() =>
                    handleMouseDown(decrementMinPrice)
                  }
                  onTouchEnd={handleMouseUp}
                  disabled={priceRange[0] === 0}
                  className="absolute left-0 top-0 h-9 w-5 z-10 hover:bg-[#2E5D3C]/15 dark:hover:bg-[#7FC06E]/20 active:bg-[#2E5D3C]/25 dark:active:bg-[#7FC06E]/30 p-0 rounded-l-md rounded-r-none transition-colors"
                >
                  <Minus className="h-2.5 w-2.5" />
                </Button>
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xs z-10 pointer-events-none">
                  $
                </span>
                <Input
                  ref={minPriceInputRef}
                  type="text"
                  inputMode="numeric"
                  value={tempMinPrice}
                  onFocus={handleMinPriceFocus}
                  onChange={handleMinPriceChange}
                  onBlur={handleMinPriceBlur}
                  onKeyDown={handleMinPriceKeyDown}
                  className="w-24 text-center"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onMouseDown={() =>
                    handleMouseDown(incrementMinPrice)
                  }
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={() =>
                    handleMouseDown(incrementMinPrice)
                  }
                  onTouchEnd={handleMouseUp}
                  disabled={priceRange[0] >= priceRange[1]}
                  className="absolute right-0 top-0 h-9 w-5 z-10 hover:bg-[#2E5D3C]/15 dark:hover:bg-[#7FC06E]/20 active:bg-[#2E5D3C]/25 dark:active:bg-[#7FC06E]/30 p-0 rounded-r-md rounded-l-none transition-colors"
                >
                  <Plus className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>
            <div>
              <Label
                htmlFor="max-price"
                className="text-xs mb-1 block"
              >
                Máximo
              </Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onMouseDown={() =>
                    handleMouseDown(decrementMaxPrice)
                  }
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={() =>
                    handleMouseDown(decrementMaxPrice)
                  }
                  onTouchEnd={handleMouseUp}
                  disabled={priceRange[1] <= priceRange[0]}
                  className="absolute left-0 top-0 h-9 w-5 z-10 hover:bg-[#2E5D3C]/15 dark:hover:bg-[#7FC06E]/20 active:bg-[#2E5D3C]/25 dark:active:bg-[#7FC06E]/30 p-0 rounded-l-md rounded-r-none transition-colors"
                >
                  <Minus className="h-2.5 w-2.5" />
                </Button>
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xs z-10 pointer-events-none">
                  $
                </span>
                <Input
                  ref={maxPriceInputRef}
                  type="text"
                  inputMode="numeric"
                  value={tempMaxPrice}
                  onFocus={handleMaxPriceFocus}
                  onChange={handleMaxPriceChange}
                  onBlur={handleMaxPriceBlur}
                  onKeyDown={handleMaxPriceKeyDown}
                  className="w-24 text-center"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onMouseDown={() =>
                    handleMouseDown(incrementMaxPrice)
                  }
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={() =>
                    handleMouseDown(incrementMaxPrice)
                  }
                  onTouchEnd={handleMouseUp}
                  disabled={priceRange[1] >= maxPrice}
                  className="absolute right-0 top-0 h-9 w-5 z-10 hover:bg-[#2E5D3C]/15 dark:hover:bg-[#7FC06E]/20 active:bg-[#2E5D3C]/25 dark:active:bg-[#7FC06E]/30 p-0 rounded-r-md rounded-l-none transition-colors"
                >
                  <Plus className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>
          </div>
          <div className="pt-2 pb-3 px-1">
            <Slider
              min={0}
              max={maxPrice}
              step={1000}
              value={priceRange}
              onValueChange={handlePriceRangeChange}
            />
          </div>
        </div>
      </div>

      {/* Special filters */}
      <div>
        <h4 className="mb-3">Filtros Especiales</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new-only"
              checked={showNewOnly}
              onCheckedChange={(checked) =>
                setShowNewOnly(checked as boolean)
              }
            />
            <Label
              htmlFor="new-only"
              className="cursor-pointer"
            >
              Solo productos nuevos
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sale-only"
              checked={showSaleOnly}
              onCheckedChange={(checked) =>
                setShowSaleOnly(checked as boolean)
              }
            />
            <Label
              htmlFor="sale-only"
              className="cursor-pointer"
            >
              Solo productos en oferta
            </Label>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={clearFilters}
      >
        Limpiar Filtros
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">
          {searchQuery
            ? `Resultados para "${searchQuery}"`
            : "Catálogo de Productos"}
        </h1>
        <p className="text-muted-foreground">
          {filteredProducts.length} productos encontrados
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-card/50 backdrop-blur-lg border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="w-5 h-5" />
              <h3>Filtros</h3>
            </div>
            <FilterContent />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            {/* Mobile Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <div className="flex items-center gap-2 flex-1 lg:flex-initial justify-end">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Ordenar:
              </span>
              <Select
                value={sortBy}
                onValueChange={(value) =>
                  setSortBy(value as SortOption)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">
                    Destacados
                  </SelectItem>
                  <SelectItem value="newest">
                    Más nuevos
                  </SelectItem>
                  <SelectItem value="popular">
                    Más populares
                  </SelectItem>
                  <SelectItem value="price-asc">
                    Precio: Menor a Mayor
                  </SelectItem>
                  <SelectItem value="price-desc">
                    Precio: Mayor a Menor
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">
                No se encontraron productos
              </p>
              <Button onClick={clearFilters}>
                Limpiar Filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() =>
                    onNavigate("product", product.id)
                  }
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}