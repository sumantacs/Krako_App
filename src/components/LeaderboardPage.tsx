import { useEffect, useState } from 'react';
import { Trophy, Medal, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface LeaderboardEntry {
  user_id: string;
  username: string;
  krako_balance: number;
  rank: number;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, username, krako_balance')
        .order('krako_balance', { ascending: false })
        .limit(100);

      if (error) throw error;

      const rankedData = data?.map((entry, index) => ({
        ...entry,
        rank: index + 1,
      })) || [];

      setLeaderboard(rankedData);

      if (user) {
        const userEntry = rankedData.find((entry) => entry.user_id === user.id);
        if (userEntry) {
          setUserRank(userEntry);
        } else {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('user_id, username, krako_balance')
            .eq('user_id', user.id)
            .maybeSingle();

          if (!userError && userData) {
            const { count } = await supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true })
              .gt('krako_balance', userData.krako_balance);

            setUserRank({
              ...userData,
              rank: (count || 0) + 1,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-gray-400 font-bold">#{rank}</span>;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-700';
    return 'bg-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center mb-8">
          <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
          <h1 className="text-3xl font-bold">Leaderboard</h1>
        </div>

        {userRank && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                  {getRankIcon(userRank.rank)}
                </div>
                <div>
                  <p className="text-sm text-gray-200">Your Rank</p>
                  <p className="text-2xl font-bold">{userRank.username}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-200">Balance</p>
                <p className="text-2xl font-bold">{userRank.krako_balance.toFixed(2)} KRAKO</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div
                key={entry.user_id}
                className={`p-4 rounded-lg transition-all ${
                  entry.user_id === user?.id
                    ? 'bg-blue-900/50 border-2 border-blue-500 shadow-lg'
                    : 'bg-gray-800/50 hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadgeColor(
                        entry.rank
                      )}`}
                    >
                      {entry.rank <= 3 ? (
                        getRankIcon(entry.rank)
                      ) : (
                        <span className="font-bold text-white">#{entry.rank}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{entry.username}</p>
                      {entry.user_id === user?.id && (
                        <span className="text-xs text-blue-400 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          You
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-yellow-400">
                      {entry.krako_balance.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">KRAKO</p>
                  </div>
                </div>
              </div>
            ))}

            {leaderboard.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No rankings yet. Start mining to be the first!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
