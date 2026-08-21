export type ProductCategory = 
  | 'indoor' 
  | 'parafernalia' 
  | 'fertilizantes' 
  | 'macetas' 
  | 'indumentaria';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  description: string;
  specifications?: Record<string, string>;
  images: string[];
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  rating?: number;
  reviews?: Review[];
  // Para indumentaria
  sizes?: string[];
  colors?: string[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
  };
  savedPaymentMethod?: {
    type: 'credit' | 'debit';
    lastFour: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: string;
  createdAt: string;
}
