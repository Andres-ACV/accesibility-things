export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category_id: number;
  seller_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  images?: ProductImage[];
  colors?: ProductColor[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

export interface ProductColor {
  id: number;
  product_id: number;
  color_id: number;
  color?: Color;
}

export interface Color {
  id: number;
  name: string;
  hex_code: string;
  description: string;
}

export interface ProductSearchParams {
  skip?: number;
  limit?: number;
  category_id?: number;
  q?: string;
} 