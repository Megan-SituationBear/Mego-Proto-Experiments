import { useState } from 'react';
import { TopNav, TabToggle } from '../components/ui';

interface DashboardPageProps {
  userName?: string;
  recentItems?: Array<{
    id: string;
    title: string;
    type?: string;
    category?: string;
    lastModified?: string;
    isFavorited?: boolean;
  }>;
  favoritedItems?: Array<{
    id: string;
    title: string;
    type?: string;
    category?: string;
    lastModified?: string;
  }>;
  artifacts?: Array<{
    id: string;
    title: string;
    type?: string;
    createdAt?: string;
  }>;
  stats?: {
    totalTimeSaved?: number;
    totalProjects?: number;
    totalDeployments?: number;
  };
  onViewItem?: (item: any) => void;
  onAvatarClick?: () => void;
  salesforceOrg?: {
    name?: string;
    sandbox?: string;
  };
  connectedIntegrations?: {
    salesforce?: boolean;
    slack?: boolean;
    jira?: boolean;
    github?: boolean;
  };
  onLogoClick?: () => void;
  onSearchClick?: () => void;
  onDashboardClick?: () => void;
  onLearnClick?: () => void;
  onIntegrationsClick?: () => void;
  onPricingClick?: () => void;
  onIntegrationClick?: (integration: 'salesforce' | 'slack' | 'jira' | 'github') => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  userName = 'User',
  recentItems = [],
  favoritedItems = [],
  artifacts = [],
  stats = {},
  onViewItem,
  onAvatarClick,
  salesforceOrg,
  connectedIntegrations = {},
  onLogoClick,
  onSearchClick,
  onDashboardClick,
  onLearnClick,
  onIntegrationsClick,
  onPricingClick,
  onIntegrationClick,
}) => {
  const [activeTab, setActiveTab] = useState<'recent' | 'favorites' | 'artifacts'>('recent');
  
  const {
    totalTimeSaved = 0,
    totalProjects = 0,
    totalDeployments = 0,
  } = stats;

  // Sort items by most recent
  const sortedRecentItems = [...recentItems].sort((a, b) => {
    if (a.lastModified && b.lastModified) {
      return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
    }
    return b.id.localeCompare(a.id);
  });

  const sortedArtifacts = [...artifacts].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return b.id.localeCompare(a.id);
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <TopNav
        showLogo={true}
        logoText="+ COPADO AI"
        onLogoClick={onLogoClick}
        onSearchClick={onSearchClick}
        onDashboardClick={onDashboardClick}
        onAvatarClick={onAvatarClick}
        userName={userName}
        isLoggedIn={true}
        onLearnClick={onLearnClick}
        onIntegrationsClick={onIntegrationsClick}
        onPricingClick={onPricingClick}
        salesforceOrg={salesforceOrg}
        connectedIntegrations={connectedIntegrations}
        onIntegrationClick={onIntegrationClick}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            My Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Welcome back, {userName}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Time Saved */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                Time Saved
              </h3>
              <div className="text-2xl">⏱️</div>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {totalTimeSaved.toLocaleString()}h
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Hours saved across all projects
            </p>
          </div>

          {/* Total Projects */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                Projects
              </h3>
              <div className="text-2xl">📁</div>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {totalProjects}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Active projects
            </p>
          </div>

          {/* Total Deployments */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                Deployments
              </h3>
              <div className="text-2xl">🚀</div>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {totalDeployments}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Total deployments
            </p>
          </div>
        </div>

        {/* Tab Toggle and Content Section */}
        <div>
          <div className="flex items-center justify-center mb-6">
            <TabToggle
              tabs={[
                { id: 'recent', label: 'Recent', count: sortedRecentItems.length },
                { id: 'favorites', label: 'Favorites', count: favoritedItems.length },
                { id: 'artifacts', label: 'Artifacts', count: sortedArtifacts.length }
              ]}
              activeTab={activeTab}
              onTabChange={(id) => setActiveTab(id as 'recent' | 'favorites' | 'artifacts')}
              size="default"
              variant="blue"
            />
          </div>

          {/* Table View */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Last Modified</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeTab === 'recent' && sortedRecentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => onViewItem?.(item)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{item.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600">{item.type || 'Workspace'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {item.category || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {item.lastModified || 'Just now'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-700">Open</button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'favorites' && favoritedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => onViewItem?.(item)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          <div className="text-sm font-medium text-slate-900">{item.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600">{item.type || 'Workspace'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {item.category || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {item.lastModified || 'Just now'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-700">Open</button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'artifacts' && sortedArtifacts.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => onViewItem?.(item)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{item.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600">{item.type || 'Artifact'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                          Artifact
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {item.createdAt || 'Just now'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-700">Open</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Empty States */}
              {activeTab === 'recent' && sortedRecentItems.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-slate-500">No recent items yet. Start working to see them here!</p>
                </div>
              )}
              {activeTab === 'favorites' && favoritedItems.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-slate-500">No favorites yet. Star items to save them here!</p>
                </div>
              )}
              {activeTab === 'artifacts' && sortedArtifacts.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-slate-500">No artifacts yet. Create artifacts from your workspaces!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

