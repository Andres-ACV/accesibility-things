export interface OrderItem {
  id?: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  product?: Product;
}

export interface Order {
  id?: number;
  user_id: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: string;
  shipping_address: string;
  items: OrderItem[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateOrderRequest {
  user_id: number;
  status: 'pending';
  total_amount: string;
  shipping_address: string;
  items: {
    product_id: number;
    quantity: number;
    unit_price: string;
  }[];
} 