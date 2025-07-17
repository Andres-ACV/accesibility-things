export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  unit_price: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
} 