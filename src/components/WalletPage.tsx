import { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, History, TrendingUp } from 'lucide-react';
import { getOrCreateProfile, supabase, Transaction } from '../lib/supabase';

const DEMO_USER_ID = 'demo-user-123';

export default function WalletPage() {
  const userId = DEMO_USER_ID;
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const tonBalance = 0.5;

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    const profile = await getOrCreateProfile(userId);
    if (profile) {
      setBalance(Number(profile.krako_balance));
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setTransactions(data);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="pb-20 bg-white min-h-screen">
      <div className="max-w-md mx-auto">
        <header className="p-4 border-b">
          <h1 className="font-bold text-xl">Wallet</h1>
        </header>

        <div className="p-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 mb-6 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <img
                src="/IMG-20250913-WA0005.jpg"
                alt="Krako"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-gray-300">Total Balance</span>
            </div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">
                {balance.toFixed(4)} KRAKO
              </h2>
              <p className="text-gray-400 flex items-center gap-2">
                <TrendingUp size={16} className="text-green-400" />
                <span className="text-green-400">+12.5%</span>
                <span>this week</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-3 px-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                <ArrowUpRight size={18} />
                Send
              </button>
              <button className="flex-1 py-3 px-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                <ArrowDownLeft size={18} />
                Receive
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 mb-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">TON Balance</p>
                <p className="text-xl font-bold">{tonBalance} TON</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                T
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <History size={20} />
                Recent Transactions
              </h3>
            </div>
            <div className="space-y-2">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <History size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">No transactions yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Start earning KRAKO points to see your transaction history
                  </p>
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.amount > 0
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {tx.amount > 0 ? (
                        <ArrowDownLeft size={20} />
                      ) : (
                        <ArrowUpRight size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{tx.description}</h4>
                      <p className="text-xs text-gray-500">{formatTimeAgo(tx.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                      </p>
                      <p className="text-xs text-gray-500">KRAKO</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
