import { useState, useEffect } from 'react';
import { Shield, Zap, LogOut, Play, Pause } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getOrCreateProfile, Profile } from '../lib/supabase';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isMining, setIsMining] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const profileData = await getOrCreateProfile(user.id);
    if (profileData) {
      setProfile(profileData);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMining = () => {
    setIsMining(!isMining);
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (name.length <= 3) return email;
    return `${name.slice(0, 2)}${'*'.repeat(name.length - 2)}@${domain}`;
  };

  const generateMinerId = (userId: string) => {
    return `KM-${userId.slice(0, 8).toUpperCase()}`;
  };

  if (loading) {
    return (
      <div className="pb-20 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

            <div className="relative z-10">
              <img
                src="/IMG-20250913-WA0005.jpg"
                alt="Krako Logo"
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-white/30 shadow-lg"
              />
              <h1 className="text-2xl font-bold mb-1">Krako Miner</h1>
              <p className="text-white/90 text-sm">
                {user?.email ? maskEmail(user.email) : 'No email'}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Miner ID</span>
                <Shield size={18} className="text-blue-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">
                {user ? generateMinerId(user.id) : 'KM-XXXXXXXX'}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-green-50 rounded-2xl p-4 border border-green-100">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700">Active Miner</span>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">KPONTS Balance</span>
                <Zap size={20} className="text-amber-500 fill-amber-500" />
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-1">
                {profile?.krako_balance !== undefined
                  ? (profile.krako_balance % 1 === 0
                      ? Math.floor(profile.krako_balance)
                      : profile.krako_balance.toFixed(2))
                  : '0'}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Krako Points</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Mining Status</p>
                  <p className="text-lg font-bold text-gray-900">
                    {isMining ? 'Active' : 'Paused'}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isMining ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {isMining ? (
                    <Zap size={24} className="text-green-600 fill-green-600" />
                  ) : (
                    <Pause size={24} className="text-gray-600" />
                  )}
                </div>
              </div>

              {isMining && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Earning in progress</span>
                    <span className="font-semibold">{profile?.hashrate || 3} GH/s</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Miner Tier</p>
                  <p className="text-lg font-bold text-gray-900">Starter Miner</p>
                </div>
                <div className="text-3xl">⭐</div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Higher tiers unlock more utilities (coming soon)
              </p>
            </div>
          </div>

          <div className="p-6 pt-0 space-y-3">
            <button
              onClick={toggleMining}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] ${
                isMining
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
              }`}
            >
              {isMining ? (
                <>
                  <Pause size={22} />
                  <span>Pause Mining</span>
                </>
              ) : (
                <>
                  <Play size={22} />
                  <span>Start Mining</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-1">
            You're early. Keep mining.
          </p>
          <p className="text-xs text-gray-400">
            More features unlocking soon
          </p>
        </div>
      </div>
    </div>
  );
}
