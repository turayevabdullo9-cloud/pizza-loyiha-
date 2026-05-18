import { create } from 'zustand';
import { api } from '../api/api';

interface Product {
  id: string;
  imageUrl: string;
  title: string;
  types: number[];
  sizes: number[];
  price: number;
  category: number;
  rating: number;
}

interface ProductState {
  items: Product[];
  isLoading: boolean;
  fetchProducts: (categoryId?: number) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  items: [],
  isLoading: false,
  fetchProducts: async (categoryId) => {
    set({ isLoading: true });
    try {
      const url = (categoryId !== undefined && categoryId !== 0) 
        ? `/products?category=${categoryId}` 
        : '/products';
      
      const { data } = await api.get(url);
      
      set({ items: data.result || [], isLoading: false });
      
      console.log('Запрос выполнен по адресу:', url); // Для отладки
    } catch (error) {
      console.error('Ошибка при загрузке продуктов:', error);
      set({ items: [], isLoading: false });
    }
  },
  addProduct: (product) => {
    set((state) => ({
      items: [...state.items, { ...product, id: String(Date.now()) }],
    }));
  },
  updateProduct: (product) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === product.id ? { ...item, ...product } : item
      ),
    }));
  },
  removeProduct: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
}));