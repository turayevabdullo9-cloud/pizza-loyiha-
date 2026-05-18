import { create } from 'zustand';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  size: number;
  type: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string, size: number, type: string) => void;
  clearCart: () => void;
}

const calculateTotals = (items: CartItem[]) => ({
  items,
  totalCount: items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
});

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalCount: 0,
  totalPrice: 0,
  addToCart: (newItem) => {
    set((state) => {
      const existing = state.items.find(
        (item) => item.id === newItem.id && item.size === newItem.size && item.type === newItem.type
      );

      let items: CartItem[];

      if (existing) {
        items = state.items.map((item) =>
          item.id === newItem.id && item.size === newItem.size && item.type === newItem.type
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        items = [...state.items, { ...newItem, quantity: 1 }];
      }

      return calculateTotals(items);
    });
  },
  removeFromCart: (id, size, type) => {
    set((state) => {
      const items = state.items
        .map((item) =>
          item.id === id && item.size === size && item.type === type
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);

      return calculateTotals(items);
    });
  },
  clearCart: () => ({ items: [], totalCount: 0, totalPrice: 0 }),
}));
