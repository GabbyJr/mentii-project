import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, BookOpen, MessageSquare, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/feed', icon: Home, label: 'Home' },
    { path: '/communities', icon: Users, label: 'Communities' },
    { path: '/resources', icon: BookOpen, label: 'Resources' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-mentii-gray shadow-lg">
      <div className="max-w-2xl mx-auto flex justify-around items-center">
        {navItems.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition ${
              location.pathname === path
                ? 'text-mentii-mint'
                : 'text-gray-600 hover:text-mentii-blue'
            }`}
          >
            <Icon
              size={24}
              fill={location.pathname === path ? 'currentColor' : 'none'}
            />
            <span className="text-xs font-semibold">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}