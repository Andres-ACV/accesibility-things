import api from './api';
import type { Order, CreateOrderRequest } from '@/types/order';

export class OrderService {
  static async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await api.post<Order>('/orders', orderData);
    return response.data;
  }

  static async getUserOrders(userId: number): Promise<Order[]> {
    const response = await api.get<Order[]>(`/orders/user/${userId}`);
    return response.data;
  }

  static async getOrder(id: number): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  }
}

export default OrderService; 