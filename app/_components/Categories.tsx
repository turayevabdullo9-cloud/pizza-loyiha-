"use client";

import { useEffect } from "react";
import CategoryCard from "./CategoryCard";
import { useProductStore } from "../store/useProductStore";

interface CategoriesProps {
    items?: { id: string | number; name: string }[];
    value?: number;
    onChange?: (id?: number) => void;
}

const Categories = ({ items, value, onChange }: CategoriesProps) => {
    const fetchProducts = useProductStore((state) => state.fetchProducts);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleCategoryChange = (id?: number) => {
        fetchProducts(id);
        onChange?.(id);
    };

    return (
        <div className="w-100 ml-38">
            <CategoryCard 
                items={items} 
                activeId={value} 
                onSelectCategory={handleCategoryChange} 
            />
        </div>
    )
}

export default Categories;