'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useCategoryStore } from '../store/useCategoryStore';
import { useProductStore } from '../store/useProductStore';
import { useOrderStore } from '../store/useOrderStore';

const ADMIN_CODE = 'admin';

const emptyProductForm = {
  id: '',
  title: '',
  imageUrl: '',
  price: '0',
  sizes: '26,30',
  types: '0',
  category: '0',
  rating: '4.5',
};

const AdminPage = () => {
  const [code, setCode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [section, setSection] = useState<'products' | 'categories' | 'orders'>('products');
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  const products = useProductStore((state) => state.items);
  const categories = useCategoryStore((state) => state.categories);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const removeProduct = useProductStore((state) => state.removeProduct);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  
  const orders = useOrderStore((state) => state.orders);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const removeOrder = useOrderStore((state) => state.removeOrder);

  const numericCategories = categories.filter(
    (category): category is { id: number; name: string } => typeof category.id === 'number'
  );

  useEffect(() => {
    if (!isAdmin) return;
    fetchCategories();
    fetchProducts();
  }, [isAdmin, fetchCategories, fetchProducts]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (code.trim().toLowerCase() === ADMIN_CODE) {
      setIsAdmin(true);
      setError('');
      return;
    }

    setError('Неверный код доступа. Попробуйте ещё раз.');
  };

  const handleProductChange = (field: keyof typeof emptyProductForm, value: string) => {
    setProductForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetProductForm = () => {
    setEditProductId(null);
    setProductForm(emptyProductForm);
  };

  const saveProduct = () => {
    const sizes = productForm.sizes
      .split(',')
      .map((value) => parseInt(value.trim(), 10))
      .filter((value) => !Number.isNaN(value));

    const types = productForm.types
      .split(',')
      .map((value) => parseInt(value.trim(), 10))
      .filter((value) => !Number.isNaN(value) && (value === 0 || value === 1));

    const product = {
      id: editProductId || String(Date.now()),
      title: productForm.title.trim() || 'Новая пицца',
      imageUrl:
        productForm.imageUrl.trim() ||
        'https://cdn-icons-png.flaticon.com/512/3595/3595455.png',
      price: Number(productForm.price) || 0,
      sizes: sizes.length ? sizes : [26, 30],
      types: types.length ? types : [0],
      category: Number(productForm.category) || 0,
      rating: Number(productForm.rating) || 0,
    };

    if (editProductId) {
      updateProduct(product);
    } else {
      addProduct(product);
    }

    resetProductForm();
  };

  const editProduct = (product: { id: string; title: string; imageUrl: string; price: number; sizes: number[]; types: number[]; category: number; rating: number }) => {
    setEditProductId(product.id);
    setProductForm({
      id: product.id,
      title: product.title,
      imageUrl: product.imageUrl,
      price: String(product.price),
      sizes: product.sizes.join(','),
      types: product.types.join(','),
      category: String(product.category),
      rating: String(product.rating),
    });
    setSection('products');
  };

  const statusLabels: Record<string, string> = {
    'new': '🆕 Новый',
    'preparing': '👨‍🍳 Готовится',
    'ready': '✅ Готов',
    'completed': '📦 Завершён',
    'cancelled': '❌ Отменён',
  };

  const statusColors: Record<string, string> = {
    'new': 'bg-blue-100 text-blue-800',
    'preparing': 'bg-yellow-100 text-yellow-800',
    'ready': 'bg-green-100 text-green-800',
    'completed': 'bg-gray-100 text-gray-800',
    'cancelled': 'bg-red-100 text-red-800',
  };


  

  return (
    <div className="container py-8">
      <div className="mb-6 flex max-w-300 mx-auto flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Админ панель</h1>
        </div>
        <Link href="/" className="text-sm font-semibold text-amber-700">
          Вернуться на главную
        </Link>
      </div>

      {!isAdmin ? (
        <div className="mx-auto w-100 rounded-2xl shadow-xl mt-50 bg-white p-8 ">
          <h2 className="text-2xl font-bold mb-4">Вход для администратора</h2>
          <p className="text-sm text-gray-500 mb-6">Введите код администратора, чтобы получить доступ к управлению. Логин и регистрация не нужны.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Введите админ код"
              className="rounded-xl border border-gray-200 bg-[#f7f7f7] px-4 py-3 text-sm outline-none transition "
            />
            <button type="submit" className="rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-500">
              Войти как админ
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </form>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-2xl bg-gray-200 ml-12 p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Управление</h2>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setSection('products')}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  section === 'products' ? 'bg-blue-500 text-white' : 'bg-[#f3f3f3] text-[#282828] hover:bg-[#eaeaea]'
                }`}
              >
                Продукты
              </button>
              <button
                type="button"
                onClick={() => setSection('orders')}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  section === 'orders' ? 'bg-blue-500 text-white' : 'bg-[#f3f3f3] text-[#282828] hover:bg-[#eaeaea]'
                }`}
              >
                Заказы
              </button>
              <button
                type="button"
                onClick={() => setSection('categories')}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  section === 'categories' ? 'bg-blue-500 text-white' : 'bg-[#f3f3f3] text-[#282828] hover:bg-[#eaeaea]'
                }`}
              >
                Категории
              </button>
            </div>
          </aside>

          <section className="space-y-6">
            {section === 'products' ? (
              <>
                <div className="rounded-4xl bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold mb-4">Управление продуктами</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold">Название</label>
                      <input
                        value={productForm.title}
                        onChange={(e) => handleProductChange('title', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-[#f7f7f7] px-4 py-3 text-sm outline-none transition "
                      />
                      <label className="block text-sm font-semibold">Картинка URL</label>
                      <input
                        value={productForm.imageUrl}
                        onChange={(e) => handleProductChange('imageUrl', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-[#f7f7f7] px-4 py-3 text-sm outline-none transition "
                      />
                      <label className="block text-sm font-semibold">Цена</label>
                      <input
                        value={productForm.price}
                        onChange={(e) => handleProductChange('price', e.target.value)}
                        type="number"
                        step="1"
                        min="0"
                        className="w-full rounded-xl border border-gray-200 bg-[#f7f7f7] px-4 py-3 text-sm outline-none transition "
                      />
                      <label className="block text-sm font-semibold">Размеры (через запятую)</label>
                      <input
                        value={productForm.sizes}
                        onChange={(e) => handleProductChange('sizes', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-[#f7f7f7] px-4 py-3 text-sm outline-none transition "
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold">Типы (0 или 1)</label>
                      <input
                        value={productForm.types}
                        onChange={(e) => handleProductChange('types', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-[#f7f7f7] px-4 py-3 text-sm outline-none transition  "
                      />
                      <label className="block text-sm font-semibold">Категория ID</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => handleProductChange('category', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-[#f7f7f7] px-4 py-3 text-sm outline-none transition  "
                      >
                        <option value="0">0 — Без категории</option>
                        {numericCategories.map((category) => (
                          <option key={category.id} value={String(category.id)}>
                            {category.id} — {category.name}
                          </option>
                        ))}
                      </select>
                      <label className="block text-sm font-semibold">Рейтинг</label>
                      <input
                        value={productForm.rating}
                        onChange={(e) => handleProductChange('rating', e.target.value)}
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="w-full rounded-xl border border-gray-200 bg-[#f7f7f7] px-4 py-3 text-sm outline-none transitio "
                      />
                      <button
                        type="button"
                        onClick={saveProduct}
                        className="w-full rounded-3xl bg-gray-500 py-3 text-sm font-bold text-white transition hover:bg-gray-400"
                      >
                        {editProductId ? 'Сохранить изменения' : 'Добавить продукт'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-4xl bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold mb-4">Список продуктов</h2>
                  <div className="space-y-4">
                    {products.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
                        Товары ещё не загружены.
                      </div>
                    ) : (
                      products.map((product) => (
                        <div key={product.id} className="rounded-3xl border border-gray-200 p-4 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-bold">{product.title}</h3>
                            <p className="text-sm text-gray-500">Цена: {product.price} ₽</p>
                            <p className="text-sm text-gray-500">Размеры: {product.sizes.join(', ')}</p>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
                            <button
                              type="button"
                              onClick={() => editProduct(product)}
                              className="rounded-3xl bg-[#f3f3f3] px-4 py-2 text-xs font-semibold text-[#282828] hover:bg-[#eaeaea]"
                            >
                              Редактировать
                            </button>
                            <button
                              type="button"
                              onClick={() => removeProduct(product.id)}
                              className="rounded-3xl bg-[#ffe8e6] px-4 py-2 text-xs font-semibold text-[#d33f2f] hover:bg-[#ffdad6]"
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : section === 'orders' ? (
              <>
                <div className="rounded-4xl bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold mb-4">Заказы</h2>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
                        Заказов пока нет.
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="rounded-3xl border border-gray-200 p-4 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div>
                              <h3 className="font-bold text-lg">Заказ #{order.id}</h3>
                              <p className="text-sm text-gray-500">Дата: {order.createdAt}</p>
                              <p className="text-sm text-gray-500">Клиент: {order.customerName || 'Не указано'}</p>
                              <p className="text-sm text-gray-500">Телефон: {order.customerPhone || 'Не указано'}</p>
                            </div>
                            <span className={`inline-block rounded-full px-4 py-2 text-xs font-semibold ${statusColors[order.status]}`}>
                              {statusLabels[order.status]}
                            </span>
                          </div>
                          
                          <div className="border-t pt-3">
                            <h4 className="text-sm font-semibold mb-2">Товары:</h4>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm bg-[#f7f7f7] p-3 rounded-xl">
                                  <div>
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="text-gray-600">{item.type}, {item.size} см × {item.quantity} шт</p>
                                  </div>
                                  <p className="font-bold text-right">{item.price * item.quantity} ₽</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t pt-3 flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-500">Сумма</p>
                              <p className="text-xl font-bold">{order.totalPrice} ₽</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {order.status !== 'completed' && order.status !== 'cancelled' && (
                                <>
                                  {order.status === 'new' && (
                                    <button
                                      type="button"
                                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                                      className="rounded-3xl bg-yellow-100 px-3 py-2 text-xs font-semibold text-yellow-800 hover:bg-yellow-200"
                                    >
                                      Готовится
                                    </button>
                                  )}
                                  {(order.status === 'new' || order.status === 'preparing') && (
                                    <button
                                      type="button"
                                      onClick={() => updateOrderStatus(order.id, 'ready')}
                                      className="rounded-3xl bg-green-100 px-3 py-2 text-xs font-semibold text-green-800 hover:bg-green-200"
                                    >
                                      Готов
                                    </button>
                                  )}
                                  {order.status === 'ready' && (
                                    <button
                                      type="button"
                                      onClick={() => updateOrderStatus(order.id, 'completed')}
                                      className="rounded-3xl bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-200"
                                    >
                                      Завершить
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                    className="rounded-3xl bg-red-100 px-3 py-2 text-xs font-semibold text-red-800 hover:bg-red-200"
                                  >
                                    Отменить
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => removeOrder(order.id)}
                                className="rounded-3xl bg-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-300"
                              >
                                Удалить
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-4xl bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold mb-4">Список категорий</h2>
                  <div className="space-y-3">
                    {numericCategories.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
                        Категории ещё не загружены.
                      </div>
                    ) : (
                      numericCategories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between gap-3 rounded-3xl border border-gray-200 p-4">
                          <span className="font-semibold">{category.id} — {category.name}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
