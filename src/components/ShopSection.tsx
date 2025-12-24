import { ShopItem } from '../lib/supabase';

interface ShopSectionProps {
  items: ShopItem[];
}

export default function ShopSection({ items }: ShopSectionProps) {
  const handlePurchase = (item: ShopItem) => {
    console.log('Purchasing:', item.name);
  };

  return (
    <div className="mb-8">
      <h2 className="font-bold text-lg mb-1">Shop</h2>
      <p className="text-sm text-gray-500 mb-4">
        Limited availability — get yours before they vanish!
      </p>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors relative overflow-hidden"
          >
            {item.discount_percent > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{item.discount_percent}%
              </div>
            )}
            <img
              src="/IMG-20250913-WA0005.jpg"
              alt="Krako"
              className="w-16 h-16 mx-auto mb-3 rounded-full object-cover shadow-lg"
            />
            <p className="text-center font-semibold text-sm mb-1">
              {item.krako_amount.toLocaleString()} TOM
            </p>
            <button
              onClick={() => handlePurchase(item)}
              className="w-full mt-2 py-2 px-4 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors"
            >
              {item.price_ton} TON
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
