import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Image, Send } from 'lucide-react';

export default function CreatePost() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('Math');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subjects = ['Math', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science'];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('content', content);
      formData.append('subject', subject);
      if (image) {
        formData.append('image', image);
      }

      await axios.post('http://127.0.0.1:8000/posts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/feed');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mentii-gray pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-mentii-gray z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/feed')}
            className="p-2 hover:bg-mentii-gray rounded-full transition"
          >
            <ArrowLeft size={24} className="text-mentii-blue" />
          </button>
          <h1 className="text-xl font-bold text-mentii-blue">Create Post</h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Content */}
          <div className="card p-6">
            <label className="block text-mentii-blue font-semibold mb-2">What's on your mind?</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your knowledge, ask a question, or post your notes..."
              className="w-full p-4 bg-mentii-gray rounded-2xl border-2 border-mentii-gray focus:border-mentii-mint focus:outline-none resize-none h-32"
            />
          </div>

          {/* Subject */}
          <div className="card p-6">
            <label className="block text-mentii-blue font-semibold mb-2">Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="input-field">
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div className="card p-6">
            <label className="block text-mentii-blue font-semibold mb-4">Add Image (Optional)</label>
            <div className="border-2 border-dashed border-mentii-mint rounded-2xl p-8 text-center hover:bg-mentii-gray transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer">
                <Image size={32} className="mx-auto mb-2 text-mentii-mint" />
                <p className="font-semibold text-mentii-blue">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-600">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>

            {/* Image Preview */}
            {preview && (
              <div className="mt-4 relative">
                <img src={preview} alt="Preview" className="w-full rounded-2xl max-h-64 object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreview('');
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/feed')}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? 'Posting...' : 'Post'}
              {!loading && <Send size={20} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}