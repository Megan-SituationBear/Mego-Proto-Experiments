import { TopNav } from '../components/ui';
import { TemplateCard } from '../components/ui';

interface DashboardPageProps {
  userName?: string;
  projects?: Array<{
    id: string;
    title: string;
    description?: string;
    category?: string;
    lastModified?: string;
    timeSaved?: number;
    deployments?: number;
  }>;
  stats?: {
    totalTimeSaved?: number;
    totalProjects?: number;
    totalDeployments?: number;
  };
  onViewProject?: (project: any) => void;
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
  projects = [],
  stats = {},
  onViewProject,
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
  const {
    totalTimeSaved = 0,
    totalProjects = 0,
    totalDeployments = 0,
  } = stats;

  // Sort projects by most recent (using lastModified or id as fallback)
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.lastModified && b.lastModified) {
      return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
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

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Recent Projects
            </h2>
            {sortedProjects.length > 0 && (
              <span className="text-sm text-slate-600">
                {sortedProjects.length} project{sortedProjects.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {sortedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProjects.map((project) => (
                <TemplateCard
                  key={project.id}
                  category={project.category || 'Project'}
                  title={project.title}
                  description={project.description || `Time saved: ${project.timeSaved || 0}h | Deployments: ${project.deployments || 0}`}
                  remixCount={0}
                  favoriteCount={0}
                  variant="standard"
                  isFavorited={false}
                  onClick={() => onViewProject?.(project)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No projects yet
              </h3>
              <p className="text-slate-600">
                Get started by creating your first project
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

