import { create } from 'zustand';
import { CartItem } from './useCartStore';

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  totalCount: number;
  createdAt: string;
  customerName?: string;
  customerPhone?: string;
  status: 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled';
}

interface OrderState {
  orders: Order[];
  addOrder: (items: CartItem[], totalPrice: number, totalCount: number, customerName?: string, customerPhone?: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  removeOrder: (orderId: string) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  addOrder: (items, totalPrice, totalCount, customerName, customerPhone) => {
    set((state) => ({
      orders: [
        {
          id: String(Date.now()),
          items,
          totalPrice,
          totalCount,
          createdAt: new Date().toLocaleString('ru-RU'),
          customerName,
          customerPhone,
          status: 'new',
        },
        ...state.orders,
      ],
    }));
  },
  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    }));
  },
  removeOrder: (orderId) => {
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== orderId),
    }));
  },
}));
