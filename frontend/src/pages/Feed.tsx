import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, MessageCircle, Bookmark, Share2, Search, Plus } from 'lucide-react';

interface Post {
  id: number;
  author_name: string;
  author_avatar: string;
  subject: string;
  content: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  liked: boolean;
  image_url?: string;
}

export default function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const subjects = ['All', 'Math', 'Physics', 'Chemistry', 'Biology', 'English'];

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/posts', {
        headers: { Authorization: `Bearer ${token}` },
        params: { subject: filter !== 'all' ? filter : undefined },
      });
      setPosts(response.data?.posts || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://127.0.0.1:8000/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, liked: !post.liked, likes_count: post.liked ? post.likes_count - 1 : post.likes_count + 1 }
            : post
        )
      );
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-mentii-gray z-20 shadow-sm">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-mentii-blue">Mentii Feed</h1>
            <button
              onClick={() => navigate('/create-post')}
              className="bg-mentii-mint text-mentii-blue p-2 rounded-full hover:shadow-md transition"
            >
              <Plus size={24} />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search subjects, people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Subject Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setFilter(subject.toLowerCase())}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                  filter === subject.toLowerCase()
                    ? 'bg-mentii-mint text-mentii-blue'
                    : 'bg-mentii-gray text-gray-700 hover:bg-gray-300'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-2xl mx-auto space-y-4 p-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mentii-mint"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold text-mentii-blue mb-2">No posts yet</h3>
            <p className="text-gray-600">Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="card overflow-hidden">
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author_avatar || 'https://via.placeholder.com/40'}
                    alt={post.author_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-mentii-mint"
                  />
                  <div>
                    <h3 className="font-bold text-mentii-blue text-sm">{post.author_name}</h3>
                    <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="badge">{post.subject}</span>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-3">
                <p className="text-gray-700 text-sm leading-relaxed">{post.content}</p>
              </div>

              {/* Post Image */}
              {post.image_url && (
                <div className="bg-mentii-gray h-64 overflow-hidden">
                  <img
                    src={post.image_url}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Post Actions */}
              <div className="separator px-4 py-3 flex justify-around text-gray-600">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 transition text-sm font-semibold ${
                    post.liked ? 'text-red-500' : 'hover:text-mentii-mint'
                  }`}
                >
                  <Heart size={18} fill={post.liked ? 'currentColor' : 'none'} />
                  {post.likes_count}
                </button>
                <button className="flex items-center gap-2 hover:text-mentii-mint transition text-sm font-semibold">
                  <MessageCircle size={18} />
                  {post.comments_count}
                </button>
                <button className="flex items-center gap-2 hover:text-mentii-mint transition text-sm font-semibold">
                  <Bookmark size={18} />
                </button>
                <button className="flex items-center gap-2 hover:text-mentii-mint transition text-sm font-semibold">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}