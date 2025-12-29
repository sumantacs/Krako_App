import { CheckCircle, Twitter, Facebook, Send, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AboutPage() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  const links = [
    {
      icon: Send,
      label: 'Telegram Community',
      url: 'https://t.me/+ISn5ykcIBj0zODE0',
      bgColor: 'from-blue-400 to-blue-500',
      iconColor: 'text-white'
    },
    {
      icon: Twitter,
      label: 'X (Twitter)',
      url: 'https://x.com/Krako_cloud?t=ZXd2m-NQf8ph-IpyGHLF1A&s=09',
      bgColor: 'from-gray-900 to-black',
      iconColor: 'text-white'
    },
    {
      icon: Facebook,
      label: 'Facebook',
      url: 'https://www.facebook.com/share/1HZEWMwcpX/',
      bgColor: 'from-blue-600 to-blue-700',
      iconColor: 'text-white'
    },
  ];

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="pb-20 bg-white min-h-screen">
      <div className="max-w-md mx-auto p-6">
        <h2 className="font-bold text-2xl mb-6">About Us</h2>
        <div className="space-y-2 mb-6">
          {links.map((link, index) => (
            <button
              key={index}
              onClick={() => handleLinkClick(link.url)}
              className="w-full flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${link.bgColor} flex items-center justify-center shadow-md`}>
                <link.icon size={22} className={link.iconColor} />
              </div>
              <span className="flex-1 text-left font-medium text-gray-800">{link.label}</span>
              <CheckCircle size={18} className="text-green-500" />
            </button>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md">
              <LogOut size={22} className="text-white" />
            </div>
            <span className="flex-1 text-left font-semibold text-red-700">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
