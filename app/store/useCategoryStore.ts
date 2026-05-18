import { create } from 'zustand';
import { api } from '../api/api'; 

interface Category {
  id: string | number;
  name: string;
}

interface CategoryState {
  categories: Category[];
  activeId: number;
  isLoading: boolean;
  error: string | null;
  
  
  setActiveId: (id: number) => void;
  fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  activeId: 0, 
  isLoading: false,
  error: null,

  setActiveId: (id: number) => set({ activeId: id }),

fetchCategories: async () => {
  set({ isLoading: true, error: null });
  try {
    const { data } = await api.get('/categories');
    
    const finalData = data.result || [];
    
    const categoriesWithAll = [{ id: 'all', name: 'Все' }, ...finalData];

    set({ categories: categoriesWithAll, isLoading: false });
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
    set({ isLoading: false, error: 'Ошибка сети', categories: [] });
  }
},
  // Category CRUD disabled — categories are read-only and fetched from API
}));