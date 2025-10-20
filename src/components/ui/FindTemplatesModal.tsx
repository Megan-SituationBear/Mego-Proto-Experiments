import { useState } from 'react';

interface FindTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: any) => void;
}

const FindTemplatesModal: React.FC<FindTemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', name: 'All Templates', count: 47 },
    { id: 'strategists', name: 'Strategists', count: 12, color: 'purple' },
    { id: 'customer-satisfaction', name: 'Customer Satisfaction', count: 8, color: 'blue' },
    { id: 'developers', name: 'Developers & Launchers', count: 15, color: 'green' },
    { id: 'planners', name: 'Effective Planners', count: 12, color: 'amber' },
  ];

  const allTemplates = [
    {
      category: "Strategists",
      categoryColor: "purple" as const,
      savedHours: 35,
      title: "Strategy Title Here About Using Real Data",
      description: "Working On: Saved Est | Hrs | By Analyzing | What | To Avoid | Risk | By | Using Integrations | To Save | # Hours |",
      favorites: 1234,
      views: 154
    },
    {
      category: "Customer Satisfaction Heroes",
      categoryColor: "blue" as const,
      savedHours: 42,
      title: "Optimize User Experience with Customer Feedback",
      description: "Working on: Saved est 42hrs by analyzing customer data to avoid satisfaction issues",
      favorites: 987,
      views: 203
    },
    {
      category: "Developers & Launchers",
      categoryColor: "green" as const,
      savedHours: 51,
      title: "Build and Launch Features Faster with Automation",
      description: "Working on: Saved est 51hrs by analyzing code patterns to avoid launch delays",
      favorites: 1456,
      views: 298
    },
    {
      category: "Effective Planners",
      categoryColor: "amber" as const,
      savedHours: 19,
      title: "Plan Projects with Precision Using Predictive Analytics",
      description: "Working on: Saved est 19hrs by analyzing project data to avoid timeline issues",
      favorites: 623,
      views: 142
    },
    {
      category: "Strategists",
      categoryColor: "purple" as const,
      savedHours: 28,
      title: "Risk Assessment and Mitigation Strategy",
      description: "Identify and mitigate potential risks before they impact your project",
      favorites: 891,
      views: 176
    },
    {
      category: "Developers & Launchers",
      categoryColor: "green" as const,
      savedHours: 45,
      title: "CI/CD Pipeline Optimization",
      description: "Streamline your deployment pipeline for faster releases",
      favorites: 1234,
      views: 267
    },
  ];

  const categoryColors = {
    purple: 'bg-purple-100 text-purple-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    amber: 'bg-amber-100 text-amber-800',
  };

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           template.category.toLowerCase().includes(selectedCategory.replace('-', ' '));
    return matchesSearch && matchesCategory;
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: 'rgba(3, 20, 45, 0.85)' }}
      onClick={handleBackdropClick}
    >
      <div 
        className="w-full max-w-6xl h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Find Templates</h2>
            <p className="text-sm text-gray-600">Discover time-saving templates for your projects</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <svg 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Categories */}
          <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Categories</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {category.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content - Templates Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            {filteredTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No templates found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectTemplate(template)}
                    className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all text-left group"
                  >
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryColors[template.categoryColor]}`}>
                        {template.category}
                      </span>
                    </div>

                    {/* Template Title */}
                    <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {template.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {template.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                          </svg>
                          {template.favorites.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                          {template.views}
                        </span>
                      </div>
                      <span className="font-semibold text-blue-600">
                        {template.savedHours}h saved
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTemplatesModal;
