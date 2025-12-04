import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Download, Eye, Filter, FileText, Image as ImageIcon } from 'lucide-react';

interface Resource {
  id: number;
  title: string;
  type: 'pdf' | 'image' | 'notes';
  subject: string;
  level: string;
  uploaded_by: string;
  downloads: number;
  thumbnail: string;
  file_url: string;
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [loading, setLoading] = useState(true);

  const subjects = ['All', 'Math', 'Physics', 'Chemistry', 'Biology', 'English'];
  const types = ['All', 'PDF', 'Notes', 'Images'];

  useEffect(() => {
    fetchResources();
  }, [filterType, filterSubject]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/resources', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          type: filterType !== 'all' ? filterType : undefined,
          subject: filterSubject !== 'all' ? filterSubject : undefined,
        },
      });
      setResources(response.data?.resources || []);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText size={32} className="text-red-500" />;
      case 'image':
        return <ImageIcon size={32} className="text-blue-500" />;
      default:
        return <FileText size={32} className="text-mentii-mint" />;
    }
  };

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-mentii-gray z-20 shadow-sm">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-bold text-mentii-blue mb-4">Resource Library</h1>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field text-sm"
            >
              {types.map((t) => (
                <option key={t} value={t.toLowerCase()}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="input-field text-sm"
            >
              {subjects.map((s) => (
                <option key={s} value={s.toLowerCase()}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="max-w-2xl mx-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mentii-mint"></div>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-mentii-gray mb-4" />
            <h3 className="text-xl font-bold text-mentii-blue mb-2">No resources found</h3>
            <p className="text-gray-600">Try searching with different filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="card overflow-hidden hover:shadow-mentii-md transition">
                {/* Thumbnail */}
                <div className="h-48 bg-mentii-gray flex items-center justify-center">
                  {resource.thumbnail ? (
                    <img
                      src={resource.thumbnail}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getResourceIcon(resource.type)
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-mentii-blue text-sm line-clamp-2">{resource.title}</h3>
                    <span className="badge text-xs">{resource.type.toUpperCase()}</span>
                  </div>

                  <div className="mb-3 space-y-1">
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Subject:</span> {resource.subject}
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Level:</span> {resource.level}
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">By:</span> {resource.uploaded_by}
                    </p>
                  </div>

                  {/* Downloads */}
                  <div className="mb-4 flex items-center gap-1 text-xs text-gray-600">
                    <Download size={14} />
                    {resource.downloads} downloads
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-mentii-gray text-mentii-blue font-semibold py-2 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2">
                      <Eye size={16} /> View
                    </button>
                    <button className="flex-1 bg-mentii-mint text-mentii-blue font-semibold py-2 rounded-lg hover:shadow-md transition flex items-center justify-center gap-2">
                      <Download size={16} /> Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}