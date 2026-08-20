import { Product, CartItem, User, Order, Review } from './types';

const API_URL = import.meta.env.VITE_API_URL as string;

interface CreatePreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

// Adjunta el JWT guardado por AuthContext, si hay uno, para las rutas
// protegidas (/api/auth/me, /api/orders, reviews). Las rutas públicas
// (productos, login, register) simplemente ignoran este header.
function authHeaders(token?: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseOrThrow<T>(res: Response, fallbackMessage: string): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || fallbackMessage);
  }
  return res.json();
}

export async function getProducts(filters?: { category?: string; q?: string }): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.q) params.set('q', filters.q);
  const query = params.toString();

  const res = await fetch(`${API_URL}/api/products${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error(`Error ${res.status} al obtener productos`);
  return res.json();
}

export async function getProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_URL}/api/products/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status} al obtener el producto`);
  return res.json();
}

export async function register(email: string, password: string, name: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  return parseOrThrow(res, 'No pudimos crear la cuenta');
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return parseOrThrow(res, 'Email o contraseña incorrectos');
}

export async function getMe(token: string): Promise<User> {
  const res = await fetch(`${API_URL}/api/auth/me`, { headers: authHeaders(token) });
  return parseOrThrow(res, 'No pudimos cargar tu perfil');
}

export async function updateProfile(token: string, data: Partial<User>): Promise<User> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  return parseOrThrow(res, 'No pudimos actualizar tu perfil');
}

export async function getOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${API_URL}/api/orders`, { headers: authHeaders(token) });
  return parseOrThrow(res, 'No pudimos cargar tus pedidos');
}

export async function createOrder(
  token: string,
  order: { items: CartItem[]; total: number; shippingAddress: NonNullable<User['address']>; paymentMethod: string }
): Promise<Order> {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(order),
  });
  return parseOrThrow(res, 'No pudimos registrar el pedido');
}

export async function createReview(
  token: string,
  productId: string,
  review: { rating: number; comment: string }
): Promise<Review> {
  const res = await fetch(`${API_URL}/api/products/${productId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(review),
  });
  return parseOrThrow(res, 'No pudimos publicar tu reseña');
}

export async function createPreference(items: CartItem[], shippingCost = 0): Promise<CreatePreferenceResponse> {
  const body = {
    items: items.map((item) => ({
      id: item.product.id,
      title: [item.product.name, item.selectedSize, item.selectedColor].filter(Boolean).join(' - '),
      quantity: item.quantity,
      unit_price: item.product.price,
    })),
    shippingCost,
  };

  const res = await fetch(`${API_URL}/create-preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Error ${res.status} al crear la preferencia de pago`);
  return res.json();
}
