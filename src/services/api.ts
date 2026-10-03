import { Product, ProductCategory } from '../types';

export interface AdminStats {
  total: number;
  available: number;
  outOfStock: number;
  featured: number;
  newArrivals: number;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    name: string;
    role: string;
    business: string;
  };
  error?: string;
}

const API_BASE = '/api';

export async function fetchProductsApi(params?: {
  category?: ProductCategory;
  search?: string;
  available?: boolean;
  sort?: string;
}): Promise<Product[]> {
  try {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') {
      query.set('category', params.category);
    }
    if (params?.search) {
      query.set('search', params.search);
    }
    if (params?.available !== undefined) {
      query.set('available', String(params.available));
    }
    if (params?.sort) {
      query.set('sort', params.sort);
    }

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('API error, falling back:', err);
    throw err;
  }
}

export async function fetchProductByIdApi(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) {
    throw new Error('Product not found');
  }
  return await res.json();
}

export async function adminLoginApi(credentials: { username?: string; password: string } | string): Promise<LoginResponse> {
  const payload = typeof credentials === 'string'
    ? { username: 'yasirfarooq', password: credentials }
    : { username: credentials.username || 'yasirfarooq', password: credentials.password };

  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function createProductApi(
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  token: string
): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create product' }));
    throw new Error(err.error || 'Failed to create product');
  }
  return await res.json();
}

export async function updateProductApi(
  id: string,
  updates: Partial<Product>,
  token: string
): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update product' }));
    throw new Error(err.error || 'Failed to update product');
  }
  return await res.json();
}

export async function deleteProductApi(id: string, token: string): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete product');
  }
  return await res.json();
}

export async function deleteAllProductsApi(token: string): Promise<{ success: boolean; count: number }> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete all products');
  }
  return await res.json();
}

export async function uploadImageApi(
  imageDataUrl: string,
  filename: string,
  token: string
): Promise<string> {
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ image: imageDataUrl, filename }),
  });

  if (!res.ok) {
    throw new Error('Image upload failed');
  }
  const data = await res.json();
  return data.url;
}

export async function uploadBulkApi(
  items: Array<{
    filename: string;
    image: string;
    name?: string;
    category?: string;
    price?: number;
    description?: string;
    fabric?: string;
    colors?: string[];
    sizes?: string[];
  }>,
  token: string
): Promise<{ success: boolean; count: number; products: Product[] }> {
  const res = await fetch(`${API_BASE}/upload-bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items }),
  });

  if (!res.ok) {
    throw new Error('Bulk upload failed');
  }
  return await res.json();
}

export async function fetchStatsApi(): Promise<AdminStats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) {
    throw new Error('Failed to fetch stats');
  }
  return await res.json();
}
