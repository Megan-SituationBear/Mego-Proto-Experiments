import React, { useState } from 'react';

interface WorkspaceProps {
  hasStarted: boolean;
}

const Workspace: React.FC<WorkspaceProps> = ({ hasStarted }) => {
  const [selectedView, setSelectedView] = useState('projects');

  const views = [
    { id: 'projects', label: 'Projects', icon: '📋' },
    { id: 'deployments', label: 'Deployments', icon: '🚀' },
    { id: 'orgs', label: 'Orgs', icon: '🏢' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  const mockProjects = [
    { id: 1, name: 'Q4 Feature Release', status: 'In Progress', progress: 75, lastActivity: '2 hours ago' },
    { id: 2, name: 'User Permission Audit', status: 'Completed', progress: 100, lastActivity: '1 day ago' },
    { id: 3, name: 'Integration Setup', status: 'Planning', progress: 25, lastActivity: '3 days ago' },
  ];

  const renderProjects = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Your Projects</h3>
        <button className="px-4 py-2 bg-copado-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          + New Project
        </button>
      </div>
      
      <div className="grid gap-4">
        {mockProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800">{project.name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {project.status}
              </span>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`bg-copado-blue h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-500">Last activity: {project.lastActivity}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWelcome = () => (
    <div className="flex items-center justify-center h-full p-8">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-gradient-to-r from-copado-blue to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-semibold text-slate-800 mb-3">Create Your Customer Plan</h2>
        <p className="text-slate-600 mb-8 text-lg leading-relaxed">
          As a trusted Copado customer, let me help you build a comprehensive strategy for your client's Salesforce needs.
        </p>
        
        <div className="space-y-4 max-w-md mx-auto">
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4">
            <p className="text-sm text-slate-700">
              <span className="font-medium text-copado-blue">Start by describing</span> your customer's current situation, goals, or challenges
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-copado-blue rounded-full"></div>
              <span>Assessment</span>
            </div>
            <div className="w-8 h-px bg-slate-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              <span>Strategy</span>
            </div>
            <div className="w-8 h-px bg-slate-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              <span>Plan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header - Only show when started */}
      {hasStarted && (
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setSelectedView(view.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    selectedView === view.id
                      ? 'bg-copado-blue text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100/80'
                  }`}
                >
                  <span>{view.icon}</span>
                  <span className="font-medium">{view.label}</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100/80">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100/80">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {hasStarted ? (
          <div className="p-6">
            {selectedView === 'projects' ? renderProjects() : renderWelcome()}
          </div>
        ) : (
          renderWelcome()
        )}
      </div>
    </div>
  );
};

export default Workspace;
