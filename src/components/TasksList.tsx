import {
  Users,
  Pickaxe,
  Share2,
  Twitter,
  Send,
  Download,
  Newspaper,
  Coins,
  Hash,
  Zap,
  Brain,
  DollarSign,
  Star
} from 'lucide-react';
import { Task } from '../lib/supabase';

interface TasksListProps {
  tasks: Task[];
}

const iconMap: { [key: string]: any } = {
  users: Users,
  pickaxe: Pickaxe,
  'share-2': Share2,
  twitter: Twitter,
  send: Send,
  download: Download,
  newspaper: Newspaper,
  coins: Coins,
  hash: Hash,
  zap: Zap,
  brain: Brain,
  'dollar-sign': DollarSign,
  star: Star,
};

export default function TasksList({ tasks }: TasksListProps) {
  const handleTaskClick = (task: Task) => {
    if (task.action_url && task.action_url !== '#') {
      window.open(task.action_url, '_blank');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="font-bold text-lg mb-1">Daily tasks</h2>
      <p className="text-sm text-gray-500 mb-4">
        Complete all tasks to get more $TOM
      </p>
      <div className="space-y-2">
        {tasks.map((task) => {
          const IconComponent = iconMap[task.icon] || Star;
          return (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                <IconComponent size={20} className="text-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{task.name}</h3>
                <p className="text-xs text-green-600">
                  +{task.reward.toLocaleString()} KRAKO
                </p>
              </div>
              <button
                onClick={() => handleTaskClick(task)}
                className="px-6 py-2 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                GO
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
