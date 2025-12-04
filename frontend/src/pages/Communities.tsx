import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, Search, Plus, BookOpen } from 'lucide-react';

interface Community {
  id: number;
  name: string;
  subject: string;
  description: string;
  members_count: number;
  icon: string;
  joined: boolean;
}

export default function Communities() {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const levels = ['All', 'Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Form 6', 'University'];

  useEffect(() => {
    fetchCommunities();
  }, [filter]);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/communities', {
        headers: { Authorization: `Bearer ${token}` },
        params: { level: filter !== 'all' ? filter : undefined },
      });
      setCommunities(response.data?.communities || []);
    } catch (err) {
      console.error('Failed to fetch communities:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleJoin = async (communityId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://127.0.0.1:8000/communities/${communityId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCommunities((prev) =>
        prev.map((c) =>
          c.id === communityId
            ? { ...c, joined: !c.joined, members_count: c.joined ? c.members_count - 1 : c.members_count + 1 }
            : c
        )
      );
    } catch (err) {
      console.error('Failed to join community:', err);
    }
  };

  const filteredCommunities = communities.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-mentii-gray z-20 shadow-sm">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-bold text-mentii-blue mb-4">Communities</h1>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Level Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                  filter === level
                    ? 'bg-mentii-mint text-mentii-blue'
                    : 'bg-mentii-gray text-gray-700 hover:bg-gray-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="max-w-2xl mx-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mentii-mint"></div>
          </div>
        ) : filteredCommunities.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-mentii-gray mb-4" />
            <h3 className="text-xl font-bold text-mentii-blue mb-2">No communities found</h3>
            <p className="text-gray-600">Try searching for a different subject or level</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCommunities.map((community) => (
              <div
                key={community.id}
                className="card p-6 hover:shadow-mentii-md cursor-pointer transition"
                onClick={() => navigate(`/communities/${community.id}`)}
              >
                {/* Community Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-mentii-blue to-mentii-purple rounded-2xl flex items-center justify-center">
                      <BookOpen size={32} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-mentii-blue">{community.name}</h2>
                      <p className="text-sm text-mentii-mint font-semibold">{community.subject}</p>
                    </div>
                  </div>
                  <span className="badge">{community.members_count} members</span>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{community.description}</p>

                {/* Join Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleJoin(community.id);
                  }}
                  className={`w-full py-2 rounded-full font-semibold transition ${
                    community.joined
                      ? 'bg-mentii-gray text-mentii-blue hover:bg-gray-300'
                      : 'bg-mentii-mint text-mentii-blue hover:shadow-md'
                  }`}
                >
                  {community.joined ? 'Joined' : 'Join Community'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}