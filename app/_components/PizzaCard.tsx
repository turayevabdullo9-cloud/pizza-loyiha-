"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useCartStore } from "../store/useCartStore";

interface PizzaProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  sizes: string;
  types: number[];
}

const typeNames = ["тонкое", "традиционное"];
export const PizzaCard: React.FC<PizzaProps> = ({
  id,
  title,
  price,
  imageUrl,
  sizes,
  types,
}) => {
  const [activeType, setActiveType] = useState(types[0]);
  const [activeSize, setActiveSize] = useState(0);
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);

  const selectedType = typeNames[activeType] || typeNames[0];
  const selectedSize = sizes?.[activeSize] || sizes[0];

  

  const cartCount = cartItems
    .filter(
      (item) =>
        item.id === id &&
        item.size === selectedSize &&
        item.type === selectedType
    )
    .reduce((sum, item) => sum + item.quantity, 0);

   

  const handleAddToCart = () => {
    addToCart({
      id,
      title,
      price,
      imageUrl,
      size: selectedSize,
      type: selectedType,
    });
  };

  return (
    <div className="w-75 rounded-4xl  p-5 text-center shadow-sm transition-all hover:-translate-y-1 group">
      <Image
        src={imageUrl}
        alt={title}
        width={260}
        height={260}
        className="mx-auto transition-transform duration-300 group-hover:scale-105"
      />

      <h4 className="text-xl font-extrabold mt-4 mb-5">{title}</h4>

      <div className="rounded-[30px] bg-[#f3f3f3] p-3">
        <ul className="flex gap-2 mb-3">
          {typeNames.map((name, i) => (
            <li
              key={name}
              onClick={() => types.includes(i) && setActiveType(i)}
              className={`flex-1 rounded-[20px] px-3 py-2 text-sm font-bold transition-all ${
                activeType === i
                  ? "bg-white shadow-sm text-[#282828]"
                  : types.includes(i)
                  ? "text-[#595959] hover:text-[#282828] cursor-pointer"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              {name}
            </li>
          ))}
        </ul>

        <ul className="flex gap-2">
          {JSON.parse(sizes).map((size, i) => (
            <li
              key={size}
              onClick={() => setActiveSize(i)}
              className={`flex-1 rounded-[20px] px-3 py-2 text-sm font-bold transition-all ${
                activeSize === i
                  ? "bg-white shadow-sm text-[#282828]"
                  : "text-[#595959] hover:text-[#282828] cursor-pointer"
              }`}
            >
              {size} см.
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="text-left">
          <div className="text-xs text-gray-500">Цена</div>
          <div className="text-2xl font-bold">{price} ₽</div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="inline-flex items-center gap-2 rounded-3xl bg-[#fe5f1e] px-4 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#fe5f1e] border hover:border-[#fe5f1e] active:scale-95"
        >
          <span className="text-xl">+</span>
          Добавить
          {cartCount > 0 && (
            <span className="rounded-full bg-white px-2 py-1 text-xs text-[#282828]">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
