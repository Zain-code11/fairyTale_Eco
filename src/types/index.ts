export type ProductCategory =
  | 'All'
  | 'Chunri'
  | 'Dupattas'
  | 'Suits'
  | 'Unstitched'
  | 'Ready to Wear'
  | 'New Arrivals';

export interface Product {
  id: string;
  name: string;
  category: Exclude<ProductCategory, 'All'>;
  price: number;
  description: string;
  image: string;
  images?: string[];
  colors: string[];
  sizes: string[];
  available: boolean;
  featured: boolean;
  newArrival: boolean;
  fabric?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryInfo {
  id: Exclude<ProductCategory, 'All'>;
  name: string;
  description: string;
  image: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}
