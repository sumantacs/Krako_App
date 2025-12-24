import { MessageSquare, Users, Trophy, Zap, Gift, ExternalLink, ArrowRight } from 'lucide-react';

export default function DiscordPage() {
  const handleJoinDiscord = () => {
    window.open('https://discord.gg/XBaeW3rj', '_blank');
  };

  const features = [
    {
      icon: Users,
      title: 'Connect with Miners',
      description: 'Join thousands of active KRAKO miners worldwide',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Trophy,
      title: 'Exclusive Contests',
      description: 'Participate in community events and win rewards',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Latest Updates',
      description: 'Get real-time news and announcements first',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Gift,
      title: 'Special Perks',
      description: 'Access exclusive giveaways and airdrops',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="pb-20 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="max-w-md mx-auto">
        <header className="p-4 border-b bg-white">
          <h1 className="font-bold text-xl">Discord Community</h1>
        </header>

        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20 blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl border-2 border-white/30">
                  <MessageSquare size={48} className="text-white" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-center mb-3">
                Join Our Discord
              </h2>
              <p className="text-white/90 text-center text-lg mb-6 leading-relaxed">
                Connect with the KRAKO community and stay ahead of the game
              </p>

              <button
                onClick={handleJoinDiscord}
                className="w-full bg-white text-indigo-600 font-bold py-4 px-6 rounded-2xl hover:bg-gray-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl flex items-center justify-center gap-3 text-lg"
              >
                <MessageSquare size={24} />
                <span>Join Discord Server</span>
                <ExternalLink size={20} />
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4 text-gray-900">Why Join Discord?</h3>
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon size={28} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-cyan-700 font-semibold">Active Community</p>
                <p className="text-2xl font-bold text-cyan-900">10,000+ Members</p>
              </div>
            </div>
            <p className="text-sm text-cyan-800 leading-relaxed">
              Be part of the fastest-growing crypto mining community. Get support, share strategies, and grow together.
            </p>
          </div>

          <button
            onClick={handleJoinDiscord}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-5 px-6 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl flex items-center justify-center gap-3 text-lg"
          >
            <span>Join the Community Now</span>
            <ArrowRight size={24} />
          </button>

          <div className="text-center text-gray-500 text-sm">
            <p>Click the button above to join our Discord server</p>
            <p className="mt-1">discord.gg/XBaeW3rj</p>
          </div>
        </div>
      </div>
    </div>
  );
}
