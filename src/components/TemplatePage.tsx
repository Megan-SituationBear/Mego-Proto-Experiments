import { useState } from 'react';
import PrimaryButton from './ui/PrimaryButton';

interface TemplatePageProps {
  template: {
    category: string;
    categoryColor: 'purple' | 'blue' | 'green' | 'amber';
    savedHours: number;
    title: string;
    description: string;
    favorites: number;
    views: number;
  } | null;
  onBack: () => void;
  onUseTemplate: () => void;
}

const TemplatePage: React.FC<TemplatePageProps> = ({
  template,
  onBack,
  onUseTemplate,
}) => {
  if (!template) {
    return null;
  }

  const steps = [
    { label: 'Started', status: 'completed' },
    { label: 'Set Up Environment', status: 'completed' },
    { label: 'Creating Automation', status: 'active' },
    { label: 'Creating Automation', status: 'upcoming' },
    { label: 'Testing in Sandbox', status: 'upcoming' },
    { label: 'Apply in Real World', status: 'upcoming' },
    { label: 'Saved', status: 'upcoming' },
  ];

  const [activeTab, setActiveTab] = useState<'work' | 'highlights' | 'output'>('work');

  const categoryColors = {
    purple: 'bg-indigo-100 text-indigo-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
  };

  // This is only shown to logged-out users
  const handleUseTemplate = () => {
    onUseTemplate(); // Goes to pricing page
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Back button and Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded hover:bg-slate-100 transition-colors"
                aria-label="Back"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div>
                <div className="text-xs text-slate-500">Date</div>
                <h1 className="text-lg font-semibold text-slate-900">[Item]: {template.title}</h1>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded hover:bg-slate-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="p-2 rounded hover:bg-slate-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Stepper */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-3 left-0 right-0 h-0.5 bg-slate-200" style={{ zIndex: 0 }}></div>
            <div 
              className="absolute top-3 left-0 h-0.5 bg-blue-600 transition-all duration-500" 
              style={{ width: '28.5%', zIndex: 0 }}
            ></div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center" style={{ zIndex: 1 }}>
                  {/* Step Circle */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 transition-all ${
                      step.status === 'completed'
                        ? 'bg-blue-600'
                        : step.status === 'active'
                        ? 'bg-green-500'
                        : 'bg-slate-300'
                    }`}
                  >
                    {step.status === 'completed' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  {/* Step Label */}
                  <span className={`text-xs text-center max-w-[100px] ${
                    step.status === 'active' ? 'font-semibold text-slate-900' : 'text-slate-600'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('work')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'work'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              The Work
            </button>
            <button
              onClick={() => setActiveTab('highlights')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'highlights'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Highlights
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'output'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Output
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Template Details */}
          <div className="lg:col-span-2">
            {/* Category Badge and Stats */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryColors[template.categoryColor]}`}>
                  {template.category}
                </span>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                    {template.favorites.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    {template.views.toLocaleString()} views
                  </span>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-slate-900 mb-3">{template.title}</h2>
              <p className="text-lg text-slate-700 mb-4">{template.description}</p>

              <div className="flex items-center gap-2 text-lg font-semibold text-blue-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Saves an estimated {template.savedHours} hours
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              {activeTab === 'work' && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">How This Template Works</h3>
                  <div className="space-y-4 text-slate-700">
                    <p>This template will guide you through the complete process of implementing this solution in your Salesforce environment.</p>
                    
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">1</div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">Environment Setup</h4>
                          <p className="text-sm">Configure your Salesforce org and connect necessary integrations</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">2</div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">Create Automation</h4>
                          <p className="text-sm">Build automated workflows based on best practices</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">3</div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">Test in Sandbox</h4>
                          <p className="text-sm">Validate the solution in a safe environment</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">4</div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">Deploy to Production</h4>
                          <p className="text-sm">Apply the changes to your live environment</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'highlights' && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Key Highlights</h3>
                  <div className="space-y-3 text-slate-700">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Proven to save {template.savedHours}+ hours per implementation</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Used by {template.favorites.toLocaleString()}+ organizations</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Includes best practices and error handling</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Fully customizable to your specific needs</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'output' && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">What You'll Get</h3>
                  <div className="space-y-4 text-slate-700">
                    <p>Upon completion, this template will deliver:</p>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li>Fully configured automation workflows</li>
                      <li>Detailed documentation for maintenance</li>
                      <li>Test results and validation reports</li>
                      <li>Deployment package ready for production</li>
                      <li>Training materials for your team</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - CTA Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Ready to Get Started?</h3>
              <p className="text-sm text-slate-600 mb-6">
                Sign up to use this template and access all features of Copado AI.
              </p>

              <PrimaryButton onClick={handleUseTemplate} className="w-full mb-4">
                View Pricing Plans
              </PrimaryButton>

              <p className="text-xs text-center text-slate-500">
                Already have an account?{' '}
                <button onClick={onBack} className="text-blue-600 hover:underline">
                  Sign in
                </button>
              </p>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="font-semibold text-sm text-slate-900 mb-3">What's Included:</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Step-by-step guidance
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    AI-powered assistance
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Best practice recommendations
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Automated testing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePage;
