'use client';

import { useProductStore } from '../store/useProductStore';
import { PizzaCard } from './PizzaCard';

const Pizza = () => {
    const { items, isLoading } = useProductStore();

    if (isLoading) return <div className="p-10">Loading ...</div>;

    return (
        <div className="max-w-350 mx-auto grid grid-cols-4 gap-10 p-10">
            {items.map((obj) => (
                <PizzaCard
                    key={obj.id}
                    id={obj.id}
                    title={obj.title}
                    price={obj.price}
                    imageUrl={obj.imageUrl}
                    sizes={obj.sizes}
                    types={obj.types}
                />
            ))}
        </div>
    );
};

export default Pizza;