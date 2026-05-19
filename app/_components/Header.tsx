'use client';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { RiUserAddLine } from 'react-icons/ri';
import { useCartStore } from '../store/useCartStore';

const Header = () => {
    const totalCount = useCartStore((state) => state.totalCount);
    const totalPrice = useCartStore((state) => state.totalPrice);

    return (
        <header className="flex items-center justify-between px-6 py-4 shadow-sm mb-3 max-w-300 mx-auto bg-white border-b border-gray-200 ">
            <div className=" flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
                <Image
                    src="https://cdn-icons-png.flaticon.com/512/3595/3595455.png"
                    alt="React Pizza Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                />
                <div className="flex flex-col">
                    <h1 className="text-xl font-black uppercase tracking-tight leading-tight text-[#181818]">
                        Next Pizza
                    </h1>
                    <p className="text-gray-400 text-xs leading-tight">
                        very delicious pizza in the city
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Link href="/admin" className="bg-amber-600 text-white text-sm font-bold py-2 px-5 rounded-full transition-all active:scale-95 inline-flex items-center gap-2">
                     <RiUserAddLine size={18} />
                     <span>Admin</span>
                </Link>

                <Link href="/cart" className="bg-[#fe5f1e] cursor-pointer hover:bg-[#e24e13] text-white text-sm font-bold py-2 px-5 rounded-full flex items-center gap-3 transition-all active:scale-95 shadow-sm">
                    <span>{totalPrice} ₽</span>
                    <span className="w-px h-4 bg-white/40" />
                    <div className="flex items-center gap-1.5">
                        <HiOutlineShoppingCart size={18} />
                        <span>{totalCount}</span>
                    </div>
                </Link>
            </div>
        </header>
    );
};

export default Header;