import { useState } from 'react';
import { ArrowLeft, Star, Eye, Clock, Share2 } from 'lucide-react';

interface WorkItemTemplateProps {
  type: 'project' | 'artifact';
  isLoggedIn?: boolean;
  onBack?: () => void;
  onUseTemplate?: () => void;
  onSignIn?: () => void;
  templateData?: any; // Can pass custom template data
}

const WorkItemTemplate: React.FC<WorkItemTemplateProps> = ({
  type,
  isLoggedIn = false,
  onBack,
  onUseTemplate,
  onSignIn,
  templateData: customTemplateData,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // For artifacts, isLoggedIn is always true
  const actualIsLoggedIn = type === 'artifact' ? true : isLoggedIn;

  // Progress steps
  const steps = [
    { label: 'Started', status: 'completed' },
    { label: 'Set Up\nEnvironment', status: 'completed' },
    { label: 'Creating\nAutomation', status: 'current' },
    { label: 'Creating\nAutomation', status: 'upcoming' },
    { label: 'Testing in\nSandbox', status: 'upcoming' },
    { label: 'Apply in Real\nWorld', status: 'upcoming' },
    { label: 'Saved', status: 'upcoming' },
  ];

  // Default template data - can be overridden via props
  const defaultTemplateData = {
    category: type === 'artifact' ? 'Deployment Artifacts' : 'Strategists',
    categoryColor: type === 'artifact' ? 'blue' : 'purple',
    favorites: 1234,
    views: 154,
    title: type === 'artifact' 
      ? 'Deployment Artifact: Complete Package' 
      : 'Strategy Title Here About Using Real Data',
    subtitle: 'Working On: Saved Est | Hrs | By Analyzing | What | To Avoid | Risk | By | Using Integrations | To Save | # Hours |',
    savedHours: 35,
    sections: [
      {
        title: 'How This Template Works',
        description: 'This template will guide you through the complete process of implementing this solution in your Salesforce environment.',
        steps: [
          {
            number: 1,
            title: 'Environment Setup',
            description: 'Configure your Salesforce org and connect necessary integrations.',
          },
          {
            number: 2,
            title: 'Data Analysis',
            description: 'Analyze your current data and identify optimization opportunities.',
          },
          {
            number: 3,
            title: 'Automation Creation',
            description: 'Build automated workflows to streamline your processes.',
          },
          {
            number: 4,
            title: 'Testing & Validation',
            description: 'Test in sandbox and validate results before production deployment.',
          },
        ],
      },
    ],
    whatsIncluded: [
      'Step-by-step guidance',
      'AI-powered assistance',
      'Best practice recommendations',
      'Automated testing',
      'Deployment checklist',
      'Documentation templates',
    ],
  };

  const templateData = customTemplateData || defaultTemplateData;

  const getStepStatus = (status: string) => {
    if (status === 'completed') {
      return 'bg-blue-600 border-blue-600';
    } else if (status === 'current') {
      return 'bg-green-500 border-green-500';
    }
    return 'bg-gray-300 border-gray-300';
  };

  const getStepLineStatus = (index: number) => {
    if (steps[index].status === 'completed') {
      return 'bg-blue-600';
    }
    return 'bg-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <div className="text-sm text-gray-500">Date</div>
                <h1 className="text-xl font-semibold text-gray-900">
                  [Item]: {templateData.title}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Star
                  className={`w-5 h-5 ${
                    isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="relative flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1 relative">
                {/* Line before circle (except first) */}
                {index > 0 && (
                  <div
                    className={`absolute top-4 right-1/2 w-full h-0.5 ${getStepLineStatus(
                      index - 1
                    )}`}
                    style={{ transform: 'translateY(-50%)' }}
                  />
                )}
                {/* Circle */}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full border-2 ${getStepStatus(
                    step.status
                  )} flex items-center justify-center`}
                >
                  {step.status === 'completed' && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                {/* Label */}
                <div className="mt-2 text-center">
                  <div
                    className={`text-sm whitespace-pre-line ${
                      step.status === 'current'
                        ? 'font-semibold text-gray-900'
                        : 'text-gray-600'
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
                {/* Line after circle (except last) */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-0.5 ${getStepLineStatus(
                      index
                    )}`}
                    style={{ transform: 'translateY(-50%)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button className="px-6 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                    The Work
                  </button>
                  <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Highlights
                  </button>
                  <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Output
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Category Badge and Stats */}
                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-3 py-1 ${
                    templateData.categoryColor === 'purple' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  } text-sm font-medium rounded-full`}>
                    {templateData.category}
                  </span>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{templateData.favorites.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{templateData.views} views</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {templateData.title}
                </h2>

                {/* Subtitle */}
                <p className="text-gray-600 mb-6">{templateData.subtitle}</p>

                {/* Time Savings */}
                <div className="flex items-center gap-2 text-blue-600 mb-8">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg font-medium">
                    Saves an estimated {templateData.savedHours} hours
                  </span>
                </div>

                {/* How This Template Works */}
                {templateData.sections.map((section: any, idx: number) => (
                  <div key={idx} className="mb-8">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {section.title}
                      </h3>
                      <p className="text-gray-600 mb-6">{section.description}</p>

                      {/* Steps */}
                      <div className="space-y-4">
                        {section.steps.map((step: any) => (
                          <div key={step.number} className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                              {step.number}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {step.title}
                              </h4>
                              <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - CTA Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h3>

              {actualIsLoggedIn ? (
                <>
                  <p className="text-gray-600 mb-6">
                    Use this template to start your {type === 'project' ? 'project' : 'artifact'}.
                  </p>
                  <button
                    onClick={onUseTemplate}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mb-4"
                  >
                    Use This Template
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">
                    Sign up to use this template and access all features of Copado AI.
                  </p>
                  <button
                    onClick={onUseTemplate}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mb-2"
                  >
                    View Pricing Plans
                  </button>
                  <div className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <button onClick={onSignIn} className="text-blue-600 hover:text-blue-700 font-medium">
                      Sign in
                    </button>
                  </div>
                </>
              )}

              {/* What's Included */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">What's Included:</h4>
                <ul className="space-y-3">
                  {templateData.whatsIncluded.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg
                        className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkItemTemplate;
