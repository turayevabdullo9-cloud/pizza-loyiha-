'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';

const Cart = () => {
  const { items, totalCount, totalPrice, removeFromCart, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const [showForm, setShowForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const handleOrder = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Пожалуйста, заполните имя и номер телефона');
      return;
    }

    addOrder(items, totalPrice, totalCount, customerName.trim(), customerPhone.trim());
    clearCart();
    setCustomerName('');
    setCustomerPhone('');
    setShowForm(false);
    alert('Заказ успешно отправлен! Спасибо за покупку!');
  };

  return (
    <div className="container py-8">
      <div className="mb-10 max-w-300 mx-auto  flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Корзина</h1>
        </div>
        <Link href="/" className="text-sm font-semibold text-amber-600">
          Вернуться на главную
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[30px]  border border-dashed border-gray-300 p-10 text-center text-gray-500">
          В корзине пока нет пицц.
        </div>
      ) : (
        <div className="grid gap-8 max-w-350 mx-auto lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.type}`}
                className="flex flex-col gap-4 rounded-[30px] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-3xl object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-bold">{item.title}</h2>
                    <p className="text-sm text-gray-500">
                      {item.type}, {item.size} см
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Кол-во: {item.quantity}
                  </span>
                  <span className="text-lg font-bold">
                    {item.price * item.quantity} ₽
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(item.id, item.size, item.type)
                    }
                    className="text-sm font-semibold text-[#fe5f1e] hover:text-[#d24c11]"
                  >
                    Уменьшить
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[30px] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <div className="text-sm text-gray-500">Всего товаров</div>
              <div className="text-3xl font-bold">{totalCount}</div>
            </div>
            <div className="mb-8">
              <div className="text-sm text-gray-500">Сумма заказа</div>
              <div className="text-4xl font-bold">{totalPrice} ₽</div>
            </div>

            {!showForm ? (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="w-full rounded-3xl bg-[#fe5f1e] py-4 text-sm font-bold text-white hover:bg-[#e24e13] transition"
              >
                Заказать
              </button>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Ваше имя
                  </label>
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ваше имя"
                    className="w-full rounded-3xl border border-gray-200 bg-[#f7f7f7] px-4 py-3 text-sm outline-none transition focus:border-[#61dafb] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Номер телефона
                  </label>
                  <input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Номер телефона"
                    type="tel"
                    className="w-full rounded-3xl border border-gray-200 bg-[#f7f7f7] px-4 py-3 text-sm outline-none transition focus:border-[#61dafb] focus:bg-white"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleOrder}
                    className="flex-1 rounded-3xl bg-[#fe5f1e] py-3 text-sm font-bold text-white hover:bg-[#e24e13] transition"
                  >
                    Подтвердить заказ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setCustomerName("");
                      setCustomerPhone("");
                    }}
                    className="flex-1 rounded-3xl bg-gray-200 py-3 text-sm font-bold text-gray-700 hover:bg-gray-300 transition"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;