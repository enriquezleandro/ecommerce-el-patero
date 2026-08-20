import { Product, CartItem } from './types';

const API_URL = import.meta.env.VITE_API_URL as string;

interface CreatePreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point: string;
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
