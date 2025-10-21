import { useState } from 'react';
import PrimaryButton from './ui/PrimaryButton';
import { AIInput, TemplateCard } from './ui';
import FindTemplatesModal from './ui/FindTemplatesModal';

interface Project {
  id: string;
  title: string;
  description: string;
  lastModified: Date;
  category: string;
}

interface HomePageProps {
  hasProjects?: boolean;
  onCreateProject?: () => void;
  onOpenProject?: (projectId: string) => void;
  onLogout?: () => void;
  onSendMessage?: (text: string) => void;
  onViewTemplate?: (template: any) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  hasProjects = false,
  onCreateProject,
  onOpenProject,
  onLogout,
  onSendMessage,
  onViewTemplate,
}) => {
  // Mock projects data for demo
  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'Landing Page Redesign',
      description: 'Redesigning the main landing page with new brand guidelines',
      lastModified: new Date('2024-10-15'),
      category: 'Design'
    },
    {
      id: '2',
      title: 'API Integration',
      description: 'Integrate Salesforce API with customer portal',
      lastModified: new Date('2024-10-16'),
      category: 'Development'
    },
    {
      id: '3',
      title: 'User Research Study',
      description: 'Conducting user interviews for feature prioritization',
      lastModified: new Date('2024-10-17'),
      category: 'Research'
    },
    {
      id: '4',
      title: 'Database Migration',
      description: 'Migrating legacy database to new cloud infrastructure',
      lastModified: new Date('2024-10-14'),
      category: 'DevOps'
    }
  ];

  const [projects] = useState<Project[]>(hasProjects ? mockProjects : []);
  const [showFindTemplatesModal, setShowFindTemplatesModal] = useState(false);

  const recommendedTemplates = [
    {
      category: "Strategists",
      categoryColor: "purple" as const,
      savedHours: 35,
      title: "Strategy Title Here About Using Real Data",
      description: "Working On: Saved Est | Hrs | By Analyzing | What | To Avoid | Risk",
      favorites: 1234,
      views: 154
    },
    {
      category: "Customer Satisfaction Heroes",
      categoryColor: "blue" as const,
      savedHours: 42,
      title: "Optimize User Experience with Customer Feedback",
      description: "Working on: Saved est 42hrs by analyzing customer data",
      favorites: 987,
      views: 203
    },
    {
      category: "Developers & Launchers",
      categoryColor: "green" as const,
      savedHours: 51,
      title: "Build and Launch Features Faster",
      description: "Working on: Saved est 51hrs by analyzing code patterns",
      favorites: 1456,
      views: 298
    },
  ];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.178 8.00001C16.412 6.23401 13.549 6.23401 11.784 8.00001L12 8.21601L12.216 8.00001C13.982 6.23401 16.845 6.23401 18.611 8.00001C20.377 9.76601 20.377 12.629 18.611 14.394C16.845 16.16 13.982 16.16 12.216 14.394L12 14.178L11.784 14.394C10.018 16.16 7.15497 16.16 5.38897 14.394C3.62297 12.628 3.62297 9.76601 5.38897 8.00001C7.15497 6.23401 10.018 6.23401 11.784 8.00001L12 8.21601L11.784 8.00001C10.018 6.23401 7.15497 6.23401 5.38897 8.00001C3.62297 9.76601 3.62297 12.629 5.38897 14.394C7.15497 16.16 10.018 16.16 11.784 14.394L12 14.178L12.216 14.394C13.982 16.16 16.845 16.16 18.611 14.394C20.377 12.628 20.377 9.76601 18.611 8.00001C16.845 6.23401 13.982 6.23401 12.216 8.00001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-slate-900">Copado AI</h1>
            </div>

            {/* Right: User Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={onCreateProject}
                className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                New Project
              </button>
              <button className="p-2 rounded hover:bg-gray-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6m-6-12h6m6 0h6m-6 12h6m-18 0h6"/>
                </svg>
              </button>
              <button 
                onClick={onLogout}
                className="p-2 rounded hover:bg-gray-100 transition-colors"
                title="Logout"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Input Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What would you like to create today?</h2>
          <AIInput
            placeholder="Describe your project idea..."
            onSendMessage={(text) => {
              if (onSendMessage) {
                onSendMessage(text);
              } else if (onCreateProject) {
                onCreateProject();
              }
            }}
            onIntegrationsClick={() => console.log('Integrations clicked')}
            autoFocus={false}
            isLoggedIn={true}
            pageContext="home"
            hasConversation={false}
            messages={[]}
            showTypingIndicator={false}
          />
        </div>

        {/* Templates For You Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Templates For You</h2>
            <button
              onClick={() => setShowFindTemplatesModal(true)}
              className="px-4 py-2 rounded-lg border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
            >
              Match with Templates
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedTemplates.map((template, index) => (
              <TemplateCard
                key={index}
                category={template.category}
                categoryColor={template.categoryColor}
                savedHours={template.savedHours}
                title={template.title}
                description={template.description}
                favorites={template.favorites}
                views={template.views}
                onClick={() => onViewTemplate?.(template)}
              />
            ))}
          </div>
        </div>

        {projects.length === 0 ? (
          /* Empty State - No Projects */
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="text-center max-w-md">
              {/* Empty State Icon */}
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                </div>
              </div>

              {/* Empty State Text */}
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                No Projects Yet
              </h2>
              <p className="text-gray-600 mb-8">
                Get started by creating your first project. Copado AI will help you streamline and supercharge your Salesforce workflows.
              </p>

              {/* CTA Button */}
              <PrimaryButton onClick={onCreateProject}>
                Create Your First Project
              </PrimaryButton>

              {/* Additional Help Text */}
              <p className="text-sm text-gray-500 mt-6">
                Need help getting started?{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  View Documentation
                </a>
              </p>
            </div>
          </div>
        ) : (
          /* Projects Grid */
          <div>
            {/* Page Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Your Projects</h2>
              <p className="text-gray-600">Manage and access all your Copado AI projects</p>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => onOpenProject?.(project.id)}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
                >
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {project.category}
                    </span>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>

                  {/* Project Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Footer: Last Modified */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Last modified</span>
                    <span className="font-medium">{formatDate(project.lastModified)}</span>
                  </div>
                </div>
              ))}

              {/* New Project Card */}
              <button
                onClick={onCreateProject}
                className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-400 hover:bg-blue-50 transition-all min-h-[200px] flex flex-col items-center justify-center group"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 group-hover:text-blue-600 transition-colors">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                  Create New Project
                </span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Find Templates Modal */}
      <FindTemplatesModal
        isOpen={showFindTemplatesModal}
        onClose={() => setShowFindTemplatesModal(false)}
        onSelectTemplate={(template) => {
          setShowFindTemplatesModal(false);
          onViewTemplate?.(template);
        }}
      />
    </div>
  );
};

export default HomePage;
