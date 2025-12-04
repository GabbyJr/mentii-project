import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Edit, Users, BookOpen, Award, Settings } from 'lucide-react';

interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  avatar: string;
  bio: string;
  user_type: string;
  level: string;
  subjects: string[];
  followers_count: number;
  following_count: number;
  posts_count: number;
  badges: string[];
  streak: number;
}

interface ProfileProps {
  user: UserProfile | null;
}

export default function Profile({ user }: ProfileProps) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(user);
  const [loading, setLoading] = useState(!user);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mentii-mint"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-mentii-blue font-bold">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-mentii-gray">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-mentii-gray z-10 p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-mentii-blue">Profile</h1>
        <button className="p-2 hover:bg-mentii-gray rounded-full transition">
          <Settings size={24} className="text-mentii-mint" />
        </button>
      </div>

      {/* Profile Banner */}
      <div className="bg-gradient-to-r from-mentii-blue to-mentii-purple h-32"></div>

      {/* Profile Card */}
      <div className="max-w-2xl mx-auto px-4 -mt-16 relative z-10 mb-6">
        <div className="card p-6">
          {/* Profile Picture & Info */}
          <div className="flex items-start gap-4 mb-6">
            <img
              src={profile.avatar || 'https://via.placeholder.com/100'}
              alt={profile.full_name}
              className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-lg"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-mentii-blue">{profile.full_name}</h2>
              <p className="text-sm text-mentii-mint font-semibold">{profile.user_type}</p>
              <p className="text-sm text-gray-600 mt-1">{profile.bio || 'No bio yet'}</p>
            </div>
            <button className="btn-mint p-2 rounded-full">
              <Edit size={20} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6 pb-6 separator">
            <div className="text-center">
              <p className="text-2xl font-bold text-mentii-blue">{profile.posts_count}</p>
              <p className="text-xs text-gray-600">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-mentii-blue">{profile.followers_count}</p>
              <p className="text-xs text-gray-600">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-mentii-blue">{profile.following_count}</p>
              <p className="text-xs text-gray-600">Following</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-mentii-blue">{profile.streak}</p>
              <p className="text-xs text-gray-600">Streak 🔥</p>
            </div>
          </div>

          {/* Subject Badges */}
          {profile.subjects.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-mentii-blue mb-2">Subjects</p>
              <div className="flex flex-wrap gap-2">
                {profile.subjects.map((subject) => (
                  <span key={subject} className="badge">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Level */}
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Level:</span> {profile.level}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        <div className="flex gap-4 border-b border-mentii-gray">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'badges', label: 'Badges', icon: Award },
            { id: 'followers', label: 'Followers', icon: Users },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 py-3 px-4 font-semibold transition border-b-2 ${
                activeTab === id
                  ? 'border-mentii-mint text-mentii-mint'
                  : 'border-transparent text-gray-600 hover:text-mentii-blue'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-mentii-blue flex items-center gap-2">
              <BookOpen size={20} /> About
            </h3>
            <div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {profile.bio || 'This user hasn\'t added a bio yet'}
              </p>
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div>
            {profile.badges.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {profile.badges.map((badge) => (
                  <div key={badge} className="card p-6 text-center">
                    <Award size={32} className="mx-auto text-mentii-mint mb-2" />
                    <p className="font-semibold text-mentii-blue text-sm">{badge}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-6 text-center">
                <p className="text-gray-600">No badges earned yet</p>
              </div>
            )}
          </div>
        )}

        {/* Followers Tab */}
        {activeTab === 'followers' && (
          <div className="card p-6 text-center">
            <Users size={32} className="mx-auto text-mentii-mint mb-2" />
            <p className="text-mentii-blue font-bold">{profile.followers_count} Followers</p>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white font-bold py-3 rounded-full hover:bg-red-600 transition flex items-center justify-center gap-2"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
}