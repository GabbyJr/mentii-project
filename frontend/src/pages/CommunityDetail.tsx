import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Users, Settings, Heart, MessageCircle, Share2 } from 'lucide-react';

interface Post {
  id: number;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
  likes_count: number;
  liked: boolean;
}

interface Community {
  id: number;
  name: string;
  subject: string;
  description: string;
  members_count: number;
  about: string;
  joined: boolean;
  posts: Post[];
}

export default function CommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchCommunity();
  }, [id]);

  const fetchCommunity = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/communities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommunity(response.data);
    } catch (err) {
      console.error('Failed to fetch community:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;

    try {
      setPosting(true);
      const token = localStorage.getItem('token');
      await axios.post(`http://127.0.0.1:8000/communities/${id}/posts`, {
        content: newPost,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewPost('');
      fetchCommunity();
    } catch (err) {
      console.error('Failed to post:', err);
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mentii-mint"></div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="text-center py-12">
        <p className="text-mentii-blue font-bold">Community not found</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-mentii-gray z-10 p-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/communities')}
          className="p-2 hover:bg-mentii-gray rounded-full transition"
        >
          <ArrowLeft size={24} className="text-mentii-blue" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-mentii-blue">{community.name}</h1>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <Users size={14} /> {community.members_count} members
          </p>
        </div>
      </div>

      {/* Community Info Card */}
      <div className="max-w-2xl mx-auto p-4">
        <div className="card p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-mentii-blue mb-2">{community.name}</h2>
              <span className="badge">{community.subject}</span>
            </div>
            {community.joined && <Settings size={24} className="text-mentii-mint cursor-pointer" />}
          </div>

          <p className="text-gray-700 mb-4">{community.description}</p>
          <p className="text-sm text-gray-600 mb-6">{community.about}</p>

          <div className="flex items-center gap-2 mb-6">
            <Users size={20} className="text-mentii-mint" />
            <span className="font-semibold text-mentii-blue">{community.members_count} members</span>
          </div>

          {!community.joined && (
            <button className="btn-primary w-full">Join Community</button>
          )}
        </div>

        {/* Create Post */}
        {community.joined && (
          <div className="card p-6 mb-6">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share something with this community..."
              className="w-full p-4 bg-mentii-gray rounded-2xl border-2 border-mentii-gray focus:border-mentii-mint focus:outline-none resize-none mb-4"
              rows={3}
            />
            <button
              onClick={handlePostSubmit}
              disabled={posting || !newPost.trim()}
              className="btn-primary w-full disabled:opacity-50"
            >
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        )}

        {/* Community Posts */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-mentii-blue">Recent Discussions</h3>

          {community.posts && community.posts.length > 0 ? (
            community.posts.map((post) => (
              <div key={post.id} className="card p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={post.author_avatar || 'https://via.placeholder.com/40'}
                    alt={post.author_name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-mentii-mint"
                  />
                  <div>
                    <p className="font-bold text-mentii-blue text-sm">{post.author_name}</p>
                    <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-3">{post.content}</p>

                <div className="flex gap-4 text-gray-600 text-sm">
                  <button className="flex items-center gap-1 hover:text-mentii-mint transition">
                    <Heart size={16} /> {post.likes_count}
                  </button>
                  <button className="flex items-center gap-1 hover:text-mentii-mint transition">
                    <MessageCircle size={16} /> Reply
                  </button>
                  <button className="flex items-center gap-1 hover:text-mentii-mint transition">
                    <Share2 size={16} /> Share
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-600">
              <p>No posts yet. Be the first to start a discussion!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}