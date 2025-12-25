import { useState, useEffect, useRef } from 'react';
import { Share2, Zap, ExternalLink, Trophy } from 'lucide-react';
import TasksList from './TasksList';
import ShopSection from './ShopSection';
import KpontsRewardsSection from './KpontsRewardsSection';
import { supabase, Task, ShopItem, RewardUtility, getOrCreateProfile, handleDailyClaim } from '../lib/supabase';

const DEMO_USER_ID = 'demo-user-123';

export default function HomePage() {
  const userId = DEMO_USER_ID;
  const [krakoBalance, setKrakoBalance] = useState(0);
  const [hashrate] = useState(3);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [rewardUtilities, setRewardUtilities] = useState<RewardUtility[]>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [claimMessage, setClaimMessage] = useState('');
  const [remainingClaims, setRemainingClaims] = useState(20);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    loadProfile();
    loadTasks();
    loadShopItems();
    loadRewardUtilities();
  }, []);

  useEffect(() => {

    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    const endDate = new Date('2025-12-24T23:59:59').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = endDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadProfile = async () => {
    const profile = await getOrCreateProfile(userId);
    if (profile) {
      setKrakoBalance(Number(profile.krako_balance));

      const today = new Date().toISOString().split('T')[0];
      const lastClaimDate = profile.last_claim_date?.split('T')[0];
      const dailyClaimsCount = lastClaimDate === today ? (profile.daily_claims_count || 0) : 0;
      setRemainingClaims(20 - dailyClaimsCount);
    }
  };

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setTasks(data);
    }
  };

  const loadShopItems = async () => {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .eq('is_available', true)
      .order('price_ton', { ascending: true });

    if (!error && data) {
      setShopItems(data);
    }
  };

  const loadRewardUtilities = async () => {
    const { data, error } = await supabase
      .from('rewards_utilities')
      .select('*')
      .order('kponts_required', { ascending: true });

    if (!error && data) {
      setRewardUtilities(data);
    }
  };

  const playCelebrationSound = () => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    const playNote = (frequency: number, startTime: number, duration: number) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startTime);

      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    playNote(523.25, now, 0.15);
    playNote(659.25, now + 0.1, 0.15);
    playNote(783.99, now + 0.2, 0.15);
    playNote(1046.50, now + 0.3, 0.3);
  };

  const handleClaim = async () => {
    const result = await handleDailyClaim(userId);

    if (result.success && result.amount !== undefined) {
      setKrakoBalance(prev => prev + result.amount);
      setRemainingClaims(result.remainingClaims || 0);

      const claimsLeft = result.remainingClaims || 0;
      const totalEarned = ((20 - claimsLeft) * 0.05).toFixed(2);
      if (claimsLeft > 0) {
        setClaimMessage(`+${result.amount.toFixed(2)} KPOINTS! Progress: ${totalEarned}/1.00 (${claimsLeft} claims left)`);
      } else {
        setClaimMessage(`+${result.amount.toFixed(2)} KPOINTS! Daily limit of 1.00 KRAKO reached!`);
      }

      playCelebrationSound();
      setTimeout(() => setClaimMessage(''), 3000);
    } else if (result.error) {
      setClaimMessage(result.error);
      setTimeout(() => setClaimMessage(''), 3000);
    }
  };

  const handleBooster = () => {
    console.log('Booster activated');
  };

  const handleShare = (platform: string) => {
    const shareText = `Join me on Krako Mining App and earn 5 Krako Points!`;
    const urls: { [key: string]: string } = {
      telegram: `https://t.me/share/url?url=https://krako.app&text=${encodeURIComponent(shareText)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' https://krako.app')}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=https://krako.app`,
      instagram: 'https://instagram.com',
    };
    window.open(urls[platform], '_blank');
  };

  return (
    <div className="pb-20 bg-white min-h-screen">
      <div className="max-w-md mx-auto">
        <header className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <img
                src="/IMG-20250913-WA0005.jpg"
                alt="Krako Logo"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-bold text-xl">Krako Mining App</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 ml-[52px]">
            <Zap size={14} className="text-yellow-500 fill-yellow-500" />
            <span>You're mining at {hashrate} GH/s — keep boosting!</span>
          </div>
        </header>

        <div className="p-6">
          <div
            onClick={handleClaim}
            className="flex justify-center items-center cursor-pointer mb-2"
          >
            <img
              src="/img-20251204-wa0043 copy copy.jpg"
              alt="Krako Octopus"
              className="w-64 h-64 object-contain hover:scale-105 transition-transform duration-200"
            />
          </div>

          <div className="text-center mt-0 mb-8">
            <h1 className="text-5xl font-bold text-black">
              {krakoBalance % 1 === 0 ? Math.floor(krakoBalance) : krakoBalance.toFixed(2)}
            </h1>
            <p className="text-xl font-bold text-gray-600 mt-1">KPOINTS</p>
            {krakoBalance === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Tap the octopus to start earning! Each claim = 0.05 KPOINTS
              </p>
            )}
          </div>

          <div className="mb-8">
            {claimMessage && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center text-sm font-medium text-blue-700">
                {claimMessage}
              </div>
            )}
            <div className="mb-2 text-center text-sm text-gray-600">
              {remainingClaims > 0 ? (
                <span>Daily Progress: <span className="font-bold text-orange-600">{((20 - remainingClaims) * 0.05).toFixed(2)}/1.00 KRAKO</span> ({remainingClaims} claims left)</span>
              ) : (
                <span className="font-bold text-red-600">Daily limit reached - Come back tomorrow!</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleClaim}
                disabled={remainingClaims === 0}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Claim
              </button>
              <button
                onClick={handleBooster}
                className="flex-1 py-3 px-6 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                Booster
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 mb-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-4 right-4 text-6xl opacity-20">🧢</div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-md">
                🧢
              </div>
              <div>
                <h2 className="font-bold text-xl text-amber-900">Win a Krako Cap!</h2>
                <p className="text-xs text-amber-700 font-medium">Limited Edition</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 mb-4 shadow-md">
              <p className="text-white text-xs font-semibold mb-2 text-center">CONTEST ENDS IN</p>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <div className="text-2xl font-bold text-white text-center">{timeLeft.days}</div>
                  <div className="text-xs text-white/90 text-center">Days</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <div className="text-2xl font-bold text-white text-center">{timeLeft.hours}</div>
                  <div className="text-xs text-white/90 text-center">Hours</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <div className="text-2xl font-bold text-white text-center">{timeLeft.minutes}</div>
                  <div className="text-xs text-white/90 text-center">Min</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <div className="text-2xl font-bold text-white text-center">{timeLeft.seconds}</div>
                  <div className="text-xs text-white/90 text-center">Sec</div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 rounded-xl p-4 mb-4">
              <p className="font-semibold text-amber-900 text-center text-sm mb-2">
                Follow + Repost + Tag 2 friends
              </p>
              <p className="text-xs text-gray-600 text-center">
                Win a limited-edition cap, digital collectible & early access perks
              </p>
            </div>

            <button
              onClick={() => window.open('https://x.com/Krako_cloud?t=ZXd2m-NQf8ph-IpyGHLF1A&s=09', '_blank')}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg text-lg"
            >
              Enter Contest Now
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 mb-8 shadow-lg relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={24} className="text-yellow-300" />
                <h2 className="font-bold text-xl text-white">Boost your hashrate instantly</h2>
              </div>
              <p className="text-white/90 font-semibold text-lg mb-1">
                Invite friends!
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mb-4 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium">Each friend:</span>
                  <span className="text-yellow-300 font-bold text-lg">5 Krako Points</span>
                </div>
              </div>
              <div className="bg-yellow-400/20 backdrop-blur-sm border border-yellow-300/30 rounded-lg p-2 mb-4">
                <p className="text-yellow-100 text-xs font-semibold text-center">
                  Top referrers get bonus rewards
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-center relative">
              <button
                onClick={() => handleShare('telegram')}
                className="w-12 h-12 rounded-full bg-[#0088cc] text-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={() => handleShare('instagram')}
                className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <TasksList tasks={tasks} />

          <ShopSection items={shopItems} />

          <KpontsRewardsSection items={rewardUtilities} userKponts={krakoBalance} />
        </div>
      </div>
    </div>
  );
}
