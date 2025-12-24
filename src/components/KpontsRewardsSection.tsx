import { Brain, Star, DollarSign, Zap, Trophy, Lock, Check } from 'lucide-react';
import { RewardUtility } from '../lib/supabase';

interface KpontsRewardsSectionProps {
  items: RewardUtility[];
  userKponts: number;
}

const iconMap: { [key: string]: any } = {
  brain: Brain,
  star: Star,
  'dollar-sign': DollarSign,
  zap: Zap,
  trophy: Trophy,
};

export default function KpontsRewardsSection({ items, userKponts }: KpontsRewardsSectionProps) {
  const handleRedeem = (item: RewardUtility) => {
    if (!item.is_available || item.is_coming_soon) {
      return;
    }
    console.log('Redeeming:', item.name);
  };

  const canAfford = (kpontsRequired: number) => {
    return userKponts >= kpontsRequired;
  };

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="font-bold text-lg mb-1">Future Utility of KPONTS</h2>
        <p className="text-sm text-gray-500">
          Redeem your KPONTS for exclusive classes, merch, and services
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const IconComponent = iconMap[item.icon] || Star;
          const affordable = canAfford(item.kponts_required);
          const isLocked = !item.is_available || item.is_coming_soon;

          return (
            <div
              key={item.id}
              className={`bg-white border-2 rounded-xl p-4 transition-all ${
                isLocked
                  ? 'border-gray-200 opacity-75'
                  : affordable
                  ? 'border-gray-300 hover:border-gray-900 hover:shadow-md'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isLocked
                      ? 'bg-gray-100'
                      : item.category === 'class'
                      ? 'bg-gradient-to-br from-blue-100 to-cyan-100'
                      : item.category === 'merch'
                      ? 'bg-gradient-to-br from-amber-100 to-orange-100'
                      : 'bg-gradient-to-br from-green-100 to-emerald-100'
                  }`}
                >
                  <IconComponent
                    size={24}
                    className={
                      isLocked
                        ? 'text-gray-400'
                        : item.category === 'class'
                        ? 'text-blue-600'
                        : item.category === 'merch'
                        ? 'text-amber-600'
                        : 'text-green-600'
                    }
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-sm leading-tight">{item.name}</h3>
                    {isLocked && (
                      <Lock size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                  </div>

                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        {item.kponts_required.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">KPONTS</span>
                    </div>

                    {isLocked ? (
                      <span className="px-4 py-2 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">
                        Coming Soon
                      </span>
                    ) : affordable ? (
                      <button
                        onClick={() => handleRedeem(item)}
                        className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-full hover:bg-gray-800 transition-colors flex items-center gap-1"
                      >
                        <Check size={14} />
                        Redeem
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-gray-100 text-gray-400 text-xs font-semibold rounded-full flex items-center gap-1">
                        <Lock size={12} />
                        Locked
                      </span>
                    )}
                  </div>

                  {!affordable && !isLocked && (
                    <div className="mt-2 text-xs text-red-500">
                      Need {(item.kponts_required - userKponts).toFixed(2)} more KPONTS
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
        <p className="text-xs text-gray-700 text-center">
          <span className="font-semibold">Your KPONTS Balance:</span>{' '}
          {userKponts % 1 === 0 ? Math.floor(userKponts) : userKponts.toFixed(2)} KPONTS
        </p>
      </div>
    </div>
  );
}
