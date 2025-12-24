import { useState } from 'react';
import { Users, Share2, Gift, Trophy, Award, Star, Crown, Coins, Sparkles, CheckCircle2, Clock, MessageCircle, Send, X as XIcon, Copy, Check } from 'lucide-react';

export default function FriendsPage() {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralCode = 'KRAKO2024XYZ';
  const friends = [
    { username: 'CryptoMiner42', invited: '2 days ago', earned: 1000, status: 'active' as const },
    { username: 'TokenHunter', invited: '5 days ago', earned: 1000, status: 'active' as const },
    { username: 'MiningPro', invited: '1 week ago', earned: 1000, status: 'pending' as const },
  ];

  const milestones = [
    { count: 5, label: 'Bronze Recruiter', icon: Award, reward: '5,000 KRAKO', color: 'from-amber-600 to-amber-700' },
    { count: 10, label: 'Silver Recruiter', icon: Star, reward: '15,000 KRAKO', color: 'from-gray-400 to-gray-500' },
    { count: 25, label: 'Gold Recruiter', icon: Crown, reward: '50,000 KRAKO', color: 'from-yellow-400 to-yellow-500' },
  ];

  const currentInvites = friends.length;

  const getNextMilestone = () => {
    return milestones.find(m => m.count > currentInvites) || milestones[milestones.length - 1];
  };

  const nextMilestone = getNextMilestone();
  const progress = (currentInvites / nextMilestone.count) * 100;

  const handleInvite = () => {
    setShowInviteModal(true);
  };

  const copyReferralCode = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const shareText = `Join me on Krako Mining App and earn 5 Krako Points! Use my code: ${referralCode}\n\nhttps://krako.app`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    setShowShareMenu(false);
    setShowInviteModal(false);
  };

  const shareOnTelegram = () => {
    const shareText = `Join me on Krako Mining App and earn 5 Krako Points! Use my code: ${referralCode}`;
    const telegramUrl = `https://t.me/share/url?url=https://krako.app&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, '_blank');
    setShowShareMenu(false);
    setShowInviteModal(false);
  };

  const shareOnX = () => {
    const shareText = `Join me on Krako Mining App and earn 5 Krako Points! Use code: ${referralCode}\n\nhttps://krako.app`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(xUrl, '_blank');
    setShowShareMenu(false);
    setShowInviteModal(false);
  };

  return (
    <div className="pb-20 bg-white min-h-screen">
      <div className="max-w-md mx-auto">
        <header className="p-4 border-b">
          <h1 className="font-bold text-xl">Friends</h1>
        </header>

        <div className="p-6">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy size={24} className="text-yellow-300" />
                    <h2 className="text-2xl font-bold">{friends.length}</h2>
                  </div>
                  <p className="text-cyan-100">Total Friends</p>
                </div>
                <img
                  src="/IMG-20250913-WA0005.jpg"
                  alt="Krako"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                />
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/20">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Coins size={28} className="text-yellow-300 animate-pulse" />
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white drop-shadow-lg">
                      {(friends.length * 1000).toLocaleString()}
                    </div>
                    <div className="text-sm text-cyan-100 font-medium">KRAKO Earned</div>
                  </div>
                  <Sparkles size={28} className="text-yellow-300 animate-pulse" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm rounded-lg p-3 border border-yellow-300/30 mb-4">
                <div className="flex items-center justify-center gap-2">
                  <Gift size={18} className="text-yellow-300" />
                  <p className="text-sm font-semibold">
                    Next Reward: <span className="text-yellow-300">5 Krako Points</span> for next friend
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cyan-100">Progress to next milestone</span>
                  <span className="font-semibold">{currentInvites}/{nextMilestone.count}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-300 to-yellow-400 h-full rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-cyan-100 text-center">
                  {nextMilestone.count - currentInvites} more invites to unlock {nextMilestone.label}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Award size={20} className="text-cyan-600" />
              Milestone Badges
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {milestones.map((milestone) => {
                const isUnlocked = currentInvites >= milestone.count;
                const MilestoneIcon = milestone.icon;

                return (
                  <div
                    key={milestone.count}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      isUnlocked
                        ? 'border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-md'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${milestone.color} flex items-center justify-center mx-auto mb-2 shadow-lg ${
                      !isUnlocked && 'opacity-30 grayscale'
                    }`}>
                      <MilestoneIcon size={24} className="text-white" />
                    </div>
                    <p className={`text-xs font-semibold text-center mb-1 ${
                      isUnlocked ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {milestone.count} Friends
                    </p>
                    <p className={`text-xs text-center ${
                      isUnlocked ? 'text-cyan-600 font-medium' : 'text-gray-400'
                    }`}>
                      {milestone.reward}
                    </p>
                    {isUnlocked && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <Trophy size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleInvite}
            className="w-full mb-6 py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
          >
            <Share2 size={20} />
            Invite Friends
          </button>

          <div>
            <h3 className="font-bold text-lg mb-4">Your Invited Friends</h3>
            {friends.length > 0 ? (
              <div className="space-y-3">
                {friends.map((friend, index) => {
                  const isActive = friend.status === 'active';
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl hover:shadow-md transition-all hover:border-cyan-300"
                    >
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-white">
                          {friend.username.charAt(0)}
                        </div>
                        {isActive && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-white">
                            <CheckCircle2 size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{friend.username}</h4>
                        <p className="text-xs text-gray-500 mb-1">{friend.invited}</p>
                        <div className="flex items-center gap-1">
                          {isActive ? (
                            <>
                              <CheckCircle2 size={12} className="text-green-600" />
                              <span className="text-xs font-medium text-green-600">Active</span>
                            </>
                          ) : (
                            <>
                              <Clock size={12} className="text-amber-600" />
                              <span className="text-xs font-medium text-amber-600">Pending</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-full shadow-md">
                          <div className="flex items-center gap-1">
                            <Coins size={14} className="flex-shrink-0" />
                            <span className="text-sm font-bold whitespace-nowrap">+{friend.earned.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No friends invited yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Start inviting to earn rewards!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowInviteModal(false)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Invite Friends</h2>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <XIcon size={18} />
                </button>
              </div>

              <p className="text-cyan-50 text-sm leading-relaxed">
                Share your referral code and earn <span className="font-bold text-yellow-300">5 Krako Points</span> for every friend who joins!
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Your Referral Code
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-4 font-mono text-lg font-bold text-gray-900 tracking-wider">
                    {referralCode}
                  </div>
                  <button
                    onClick={copyReferralCode}
                    className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                  Share via
                </label>
                <div className="space-y-3">
                  <button
                    onClick={shareOnWhatsApp}
                    className="w-full flex items-center gap-4 bg-[#25D366] text-white p-4 rounded-2xl font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <MessageCircle size={22} />
                    </div>
                    <span className="text-lg">WhatsApp</span>
                  </button>

                  <button
                    onClick={shareOnTelegram}
                    className="w-full flex items-center gap-4 bg-[#0088cc] text-white p-4 rounded-2xl font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Send size={22} />
                    </div>
                    <span className="text-lg">Telegram</span>
                  </button>

                  <button
                    onClick={shareOnX}
                    className="w-full flex items-center gap-4 bg-black text-white p-4 rounded-2xl font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <XIcon size={22} />
                    </div>
                    <span className="text-lg">X (Twitter)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showShareMenu && (
        <div
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setShowShareMenu(false)}
        />
      )}

      <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
        {showShareMenu && (
          <div className="flex flex-col gap-2 animate-in slide-in-from-bottom duration-200">
            <button
              onClick={shareOnWhatsApp}
              className="flex items-center gap-3 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-xl hover:scale-105 transition-transform"
            >
              <MessageCircle size={20} />
              <span className="font-semibold pr-2">WhatsApp</span>
            </button>

            <button
              onClick={shareOnTelegram}
              className="flex items-center gap-3 bg-[#0088cc] text-white px-4 py-3 rounded-full shadow-xl hover:scale-105 transition-transform"
            >
              <Send size={20} />
              <span className="font-semibold pr-2">Telegram</span>
            </button>

            <button
              onClick={shareOnX}
              className="flex items-center gap-3 bg-black text-white px-4 py-3 rounded-full shadow-xl hover:scale-105 transition-transform"
            >
              <XIcon size={20} />
              <span className="font-semibold pr-2">X (Twitter)</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className={`w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center ${
            showShareMenu ? 'rotate-45' : ''
          }`}
        >
          <Share2 size={24} />
        </button>
      </div>
    </div>
  );
}
