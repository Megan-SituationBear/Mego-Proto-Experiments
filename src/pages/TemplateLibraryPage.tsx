import { useState } from 'react';
import { Search } from 'lucide-react';
import { TopNav, TemplateCard } from '../components/ui';
import { TEMPLATE_CATEGORIES } from '../utils/templateCategories';

interface TemplateLibraryPageProps {
  onBack: () => void;
  onSelectTemplate: (template: any) => void;
  initialGoals?: string[];
}

const TemplateLibraryPage: React.FC<TemplateLibraryPageProps> = ({
  onBack,
  onSelectTemplate,
  initialGoals = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'hours' | 'newest'>('popular');
  const [selectedTags, setSelectedTags] = useState<string[]>(initialGoals);

  const categories = [
    { id: 'all', name: 'All Templates', count: 24 },
    { id: 'deployment', name: 'Deployment & CI/CD', count: 6, color: 'blue' },
    { id: 'planning', name: 'Planning & Analytics', count: 5, color: 'purple' },
    { id: 'support', name: 'Support & Quality', count: 4, color: 'green' },
    { id: 'optimization', name: 'Optimization', count: 5, color: 'amber' },
    { id: 'building', name: 'Development', count: 4, color: 'indigo' },
  ];

  const tags = [
    { id: 'plan', label: 'Planning', icon: '📊' },
    { id: 'deploy', label: 'Deployment', icon: '🚀' },
    { id: 'build', label: 'Building', icon: '⚡' },
    { id: 'support', label: 'Support', icon: '🛟' },
    { id: 'optimize', label: 'Optimization', icon: '⚙️' },
  ];

  const allTemplates = [
    // Developers & Launchers
    {
      id: 1,
      category: TEMPLATE_CATEGORIES.DEVELOPERS.name,
      categoryColor: TEMPLATE_CATEGORIES.DEVELOPERS.color,
      savedHours: 45,
      title: "Automated Deployment Validation",
      description: "Automatically validate deployments before they go live. Catches errors early and reduces rollbacks by 80%.",
      remixCount: 1234,
      favoriteCount: 2156,
      tags: ['deploy'],
      dateAdded: '2025-10-15',
    },
    {
      id: 2,
      category: TEMPLATE_CATEGORIES.STRATEGISTS.name,
      categoryColor: TEMPLATE_CATEGORIES.STRATEGISTS.color,
      savedHours: 35,
      title: "Pre-Deployment Health Check",
      description: "Schedule comprehensive org analysis before each deployment to identify potential conflicts and dependencies.",
      remixCount: 987,
      favoriteCount: 1834,
      tags: ['deploy', 'plan'],
      dateAdded: '2025-10-10',
    },
    {
      id: 3,
      category: TEMPLATE_CATEGORIES.DEVELOPERS.name,
      categoryColor: TEMPLATE_CATEGORIES.DEVELOPERS.color,
      savedHours: 52,
      title: "CI/CD Pipeline Optimization",
      description: "Streamline your deployment pipeline with automated testing, validation, and rollback capabilities.",
      remixCount: 2543,
      favoriteCount: 1987,
      tags: ['deploy', 'build'],
      dateAdded: '2025-10-18',
    },
    {
      id: 4,
      category: TEMPLATE_CATEGORIES.ADMINS.name,
      categoryColor: TEMPLATE_CATEGORIES.ADMINS.color,
      savedHours: 28,
      title: "Deployment Window Scheduler",
      description: "Automatically schedule deployments during optimal windows based on historical data and team availability.",
      favorites: 1456,
      views: 2234,
      tags: ['deploy', 'plan'],
      dateAdded: '2025-10-05',
    },
    {
      id: 5,
      category: TEMPLATE_CATEGORIES.DEVELOPERS.name,
      categoryColor: TEMPLATE_CATEGORIES.DEVELOPERS.color,
      savedHours: 38,
      title: "Rollback Strategy Template",
      description: "Pre-configured rollback procedures with automated testing to ensure safe recovery from failed deployments.",
      favorites: 1723,
      views: 2567,
      tags: ['deploy'],
      dateAdded: '2025-10-12',
    },
    {
      id: 6,
      category: TEMPLATE_CATEGORIES.MANAGERS.name,
      categoryColor: TEMPLATE_CATEGORIES.MANAGERS.color,
      savedHours: 41,
      title: "Multi-Org Deployment Coordinator",
      description: "Coordinate deployments across multiple Salesforce orgs with dependency tracking and sequencing.",
      favorites: 1567,
      views: 2123,
      tags: ['deploy', 'optimize'],
      dateAdded: '2025-10-08',
    },
    
    // Planning & Analytics
    {
      id: 7,
      category: "Planning & Analytics",
      categoryColor: "purple" as const,
      savedHours: 42,
      title: "Data-Driven Sprint Planning",
      description: "Use historical velocity and complexity data to create accurate sprint plans and capacity estimates.",
      favorites: 2234,
      views: 3654,
      tags: ['plan'],
      dateAdded: '2025-10-19',
    },
    {
      id: 8,
      category: "Planning & Analytics",
      categoryColor: "purple" as const,
      savedHours: 31,
      title: "Risk Assessment Matrix",
      description: "Identify and mitigate potential risks before they impact your project using predictive analytics.",
      favorites: 1876,
      views: 2987,
      tags: ['plan'],
      dateAdded: '2025-10-14',
    },
    {
      id: 9,
      category: "Planning & Analytics",
      categoryColor: "purple" as const,
      savedHours: 36,
      title: "Technical Debt Analyzer",
      description: "Track and prioritize technical debt with automated code analysis and impact assessment.",
      favorites: 1654,
      views: 2456,
      tags: ['plan', 'optimize'],
      dateAdded: '2025-10-11',
    },
    {
      id: 10,
      category: "Planning & Analytics",
      categoryColor: "purple" as const,
      savedHours: 27,
      title: "Capacity Planning Dashboard",
      description: "Visualize team capacity, project timelines, and resource allocation across all initiatives.",
      favorites: 1432,
      views: 2198,
      tags: ['plan'],
      dateAdded: '2025-10-07',
    },
    {
      id: 11,
      category: "Planning & Analytics",
      categoryColor: "purple" as const,
      savedHours: 33,
      title: "Predictive Timeline Estimation",
      description: "Get accurate project completion estimates based on historical data and current velocity trends.",
      favorites: 1589,
      views: 2334,
      tags: ['plan'],
      dateAdded: '2025-10-16',
    },

    // Support & Quality
    {
      id: 12,
      category: "Support & Quality",
      categoryColor: "green" as const,
      savedHours: 48,
      title: "Proactive Issue Detection",
      description: "Identify and resolve support issues before users report them using AI-powered monitoring.",
      favorites: 2456,
      views: 4123,
      tags: ['support'],
      dateAdded: '2025-10-20',
    },
    {
      id: 13,
      category: "Support & Quality",
      categoryColor: "green" as const,
      savedHours: 39,
      title: "Automated Quality Assurance",
      description: "Run comprehensive QA checks automatically on every change with detailed reporting and alerts.",
      favorites: 2087,
      views: 3456,
      tags: ['support', 'build'],
      dateAdded: '2025-10-13',
    },
    {
      id: 14,
      category: "Support & Quality",
      categoryColor: "green" as const,
      savedHours: 29,
      title: "User Feedback Analyzer",
      description: "Automatically categorize and prioritize user feedback to identify patterns and trends.",
      favorites: 1745,
      views: 2876,
      tags: ['support', 'plan'],
      dateAdded: '2025-10-09',
    },
    {
      id: 15,
      category: "Support & Quality",
      categoryColor: "green" as const,
      savedHours: 44,
      title: "Performance Monitoring Suite",
      description: "Real-time performance monitoring with automated alerts and optimization recommendations.",
      favorites: 1923,
      views: 3234,
      tags: ['support', 'optimize'],
      dateAdded: '2025-10-17',
    },

    // Optimization
    {
      id: 16,
      category: "Optimization",
      categoryColor: "amber" as const,
      savedHours: 55,
      title: "Salesforce Org Optimizer",
      description: "Comprehensive org health check with actionable recommendations to improve performance and maintainability.",
      favorites: 2678,
      views: 4567,
      tags: ['optimize'],
      dateAdded: '2025-10-18',
    },
    {
      id: 17,
      category: "Optimization",
      categoryColor: "amber" as const,
      savedHours: 37,
      title: "API Usage Optimization",
      description: "Identify and optimize API calls to stay within limits and improve application performance.",
      favorites: 1834,
      views: 2987,
      tags: ['optimize', 'build'],
      dateAdded: '2025-10-12',
    },
    {
      id: 18,
      category: "Optimization",
      categoryColor: "amber" as const,
      savedHours: 41,
      title: "Storage Optimization Strategy",
      description: "Analyze and optimize data storage usage to reduce costs and improve query performance.",
      favorites: 1656,
      views: 2654,
      tags: ['optimize'],
      dateAdded: '2025-10-15',
    },
    {
      id: 19,
      category: "Optimization",
      categoryColor: "amber" as const,
      savedHours: 32,
      title: "Code Performance Analyzer",
      description: "Identify performance bottlenecks in Apex code and receive optimization recommendations.",
      favorites: 1765,
      views: 2876,
      tags: ['optimize', 'build'],
      dateAdded: '2025-10-11',
    },
    {
      id: 20,
      category: "Optimization",
      categoryColor: "amber" as const,
      savedHours: 46,
      title: "Workflow Automation Review",
      description: "Audit existing workflows and process builders for optimization opportunities and best practices.",
      favorites: 1889,
      views: 3123,
      tags: ['optimize'],
      dateAdded: '2025-10-14',
    },

    // Development
    {
      id: 21,
      category: "Development",
      categoryColor: "indigo" as const,
      savedHours: 51,
      title: "Rapid Component Builder",
      description: "Build Lightning Web Components 3x faster with AI-assisted code generation and best practices.",
      favorites: 2345,
      views: 3987,
      tags: ['build'],
      dateAdded: '2025-10-19',
    },
    {
      id: 22,
      category: "Development",
      categoryColor: "indigo" as const,
      savedHours: 38,
      title: "Integration Pattern Library",
      description: "Pre-built integration patterns for common external systems with security and error handling.",
      favorites: 1987,
      views: 3234,
      tags: ['build'],
      dateAdded: '2025-10-16',
    },
    {
      id: 23,
      category: "Development",
      categoryColor: "indigo" as const,
      savedHours: 43,
      title: "Test Coverage Booster",
      description: "Automatically generate comprehensive test cases to meet and exceed code coverage requirements.",
      favorites: 2123,
      views: 3567,
      tags: ['build'],
      dateAdded: '2025-10-13',
    },
    {
      id: 24,
      category: "Development",
      categoryColor: "indigo" as const,
      savedHours: 35,
      title: "Custom Object Generator",
      description: "Quickly scaffold custom objects with standard fields, validation rules, and page layouts.",
      favorites: 1756,
      views: 2876,
      tags: ['build'],
      dateAdded: '2025-10-10',
    },
  ];

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const filteredTemplates = allTemplates
    .filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
                             template.category.toLowerCase().includes(selectedCategory.replace('-', ' & '));
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => template.tags.includes(tag));
      return matchesSearch && matchesCategory && matchesTags;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.favoriteCount || 0) - (a.favoriteCount || 0);
        case 'hours':
          return (b.savedHours || 0) - (a.savedHours || 0);
        case 'newest':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <TopNav
        title="Template Library"
        subtitle="Discover time-saving templates for your projects"
        onBack={onBack}
        showBackButton={true}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
            />
          </div>

          {/* Quick Filter Tags */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-slate-600">Quick filters:</span>
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  selectedTags.includes(tag.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{tag.icon}</span>
                <span>{tag.label}</span>
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              <span className="font-medium">{filteredTemplates.length}</span> templates found
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="hours">Hours Saved</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar - Categories */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{category.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Templates Grid */}
          <div className="flex-1">
            {filteredTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No templates found</h3>
                <p className="text-slate-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    category={template.category}
                    title={template.title}
                    description={template.description}
                    remixCount={template.remixCount}
                    favoriteCount={template.favoriteCount}
                    variant="standard"
                    onClick={() => onSelectTemplate(template)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TemplateLibraryPage;
