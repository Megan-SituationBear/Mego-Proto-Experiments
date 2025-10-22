import { useState, useMemo } from 'react';
import { Search, Star, Clock, Folder, FileText, Sparkles } from 'lucide-react';
import { TopNav } from '../components/ui';
import { type CategoryColor } from '../utils/templateCategories';

interface WorkItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  categoryColor?: CategoryColor;
  type: 'project' | 'artifact' | 'template';
  lastAccessed?: Date;
  startedAt?: Date;
  createdAt?: Date;
  isFavorited?: boolean;
  isWorkingOn?: boolean;
  favorites?: number;
  views?: number;
}

interface MyWorkPageProps {
  recentItems?: WorkItem[];
  favoritedTemplates?: WorkItem[];
  activeProjects?: WorkItem[];
  onBack: () => void;
  onViewItem: (item: WorkItem) => void;
  onToggleFavorite?: (item: WorkItem, isFavorited: boolean) => void;
}

const MyWorkPage: React.FC<MyWorkPageProps> = ({
  recentItems = [],
  favoritedTemplates = [],
  activeProjects = [],
  onBack,
  onViewItem,
  onToggleFavorite,
}) => {
  const [sortBy, setSortBy] = useState<'recent' | 'favorites'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'project' | 'artifact' | 'template'>('all');

  // Combine all work items
  const allWorkItems = useMemo(() => {
    const combined = [
      ...activeProjects.map(p => ({ ...p, type: 'project' as const })),
      ...recentItems,
      ...favoritedTemplates.map(t => ({ ...t, isFavorited: true })),
    ];
    
    // Deduplicate by id
    const uniqueMap = new Map<string, WorkItem>();
    combined.forEach(item => {
      const existing = uniqueMap.get(item.id);
      if (!existing || (item.isFavorited && !existing.isFavorited)) {
        uniqueMap.set(item.id, item);
      }
    });
    
    return Array.from(uniqueMap.values());
  }, [activeProjects, recentItems, favoritedTemplates]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let items = [...allWorkItems];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      items = items.filter(item => item.type === filterType);
    }

    // Apply sorting
    if (sortBy === 'recent') {
      items.sort((a, b) => {
        const aDate = a.lastAccessed || a.startedAt || a.createdAt || new Date(0);
        const bDate = b.lastAccessed || b.startedAt || b.createdAt || new Date(0);
        return bDate.getTime() - aDate.getTime();
      });
    } else if (sortBy === 'favorites') {
      items.sort((a, b) => {
        // Favorited items first
        if (a.isFavorited && !b.isFavorited) return -1;
        if (!a.isFavorited && b.isFavorited) return 1;
        
        // Then by recent
        const aDate = a.lastAccessed || a.startedAt || a.createdAt || new Date(0);
        const bDate = b.lastAccessed || b.startedAt || b.createdAt || new Date(0);
        return bDate.getTime() - aDate.getTime();
      });
    }

    return items;
  }, [allWorkItems, searchQuery, filterType, sortBy]);

  const getCategoryColor = (color?: CategoryColor) => {
    const colors = {
      green: 'bg-green-100 text-green-700',
      blue: 'bg-blue-100 text-blue-700',
      purple: 'bg-purple-100 text-purple-700',
      amber: 'bg-amber-100 text-amber-700',
      slate: 'bg-slate-100 text-slate-700',
      orange: 'bg-orange-100 text-orange-700',
    };
    return colors[color || 'slate'];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Folder className="w-5 h-5" />;
      case 'artifact':
        return <FileText className="w-5 h-5" />;
      case 'template':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Folder className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 7) {
      return new Date(date).toLocaleDateString();
    } else if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <TopNav
        title="My Work"
        onBack={onBack}
        showBackButton={true}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search your work..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Sort Toggle */}
              <div className="inline-flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setSortBy('recent')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    sortBy === 'recent'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Recent
                </button>
                <button
                  onClick={() => setSortBy('favorites')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    sortBy === 'favorites'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  Favorites
                </button>
              </div>

              {/* Type Filter */}
              <div className="inline-flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    filterType === 'all'
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('project')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    filterType === 'project'
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setFilterType('artifact')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    filterType === 'artifact'
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Artifacts
                </button>
                <button
                  onClick={() => setFilterType('template')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    filterType === 'template'
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Templates
                </button>
              </div>

              {/* Results Count */}
              <div className="ml-auto text-sm text-slate-600">
                {filteredAndSortedItems.length} {filteredAndSortedItems.length === 1 ? 'item' : 'items'}
              </div>
            </div>
          </div>
        </div>

        {/* Work Items List */}
        {filteredAndSortedItems.length > 0 ? (
          <div className="space-y-3">
            {filteredAndSortedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => onViewItem(item)}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      {getTypeIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {item.title}
                            </h3>
                            {item.isWorkingOn && (
                              <span className="flex-shrink-0 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                Working on
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite?.(item, !item.isFavorited);
                          }}
                          className="flex-shrink-0 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              item.isFavorited
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-400'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        {/* Type Badge */}
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-medium">
                          {getTypeLabel(item.type)}
                        </span>

                        {/* Category Badge */}
                        {item.category && (
                          <span className={`text-xs px-2 py-1 rounded font-semibold ${getCategoryColor(item.categoryColor)}`}>
                            {item.category}
                          </span>
                        )}

                        {/* Last Accessed */}
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.lastAccessed || item.startedAt || item.createdAt)}
                        </span>

                        {/* Stats */}
                        {item.favorites !== undefined && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Star className="w-3 h-3" />
                            {item.favorites}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Folder className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No items found</h3>
            <p className="text-slate-600">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Start working on projects and templates to see them here"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyWorkPage;
