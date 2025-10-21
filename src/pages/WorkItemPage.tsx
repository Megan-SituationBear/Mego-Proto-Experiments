import { useState } from 'react';
import { ArrowLeft, Star, Eye, Clock, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { AIInput, TopNav } from '../components/ui';

/**
 * WorkItemPage Component - Handles multiple states for templates, projects, and artifacts
 * 
 * COMPONENT STATES:
 * 
 * 1. TEMPLATE: NOT LOGGED IN
 *    - User viewing a pre-built template from gallery without being signed in
 *    - Shows: Template details, "View Pricing Plans" CTA, "Sign in" link
 *    - Cannot: Favorite, use template, start conversation
 * 
 * 2. TEMPLATE: LOGGED IN
 *    - User viewing a pre-built template from gallery while signed in
 *    - Shows: Template details, "Remix" button (opens rename modal), favorite button
 *    - Can: Favorite template, remix to create new project from template
 * 
 * 3. PROJECT FROM TEMPLATE: NOT LOGGED IN
 *    - User viewing a shared project (that was created from a template) without being signed in
 *    - Shows: Project details (read-only), "Sign up" CTA
 *    - Cannot: Edit, favorite, or interact with project
 * 
 * 4. PROJECT FROM TEMPLATE: LOGGED IN (isDuplicatedTemplate = true)
 *    - User working on their own project created from a template
 *    - Shows: Full workspace with AI input, conversation, outputs, highlights
 *    - Can: Edit project, chat with AI, generate artifacts, manage project
 * 
 * 5. PROJECT FROM SCRATCH: LOGGED IN (isNewProject = true)
 *    - User working on a new project created from conversation on home page
 *    - Shows: Simplified workspace view with conversation continuation
 *    - Can: Continue conversation, build project from scratch
 * 
 * 6. ARTIFACT: LOGGED IN
 *    - User viewing/editing a generated artifact
 *    - Shows: Artifact content, modification input
 *    - Can: Modify artifact, download, share
 *    - Note: Artifacts are always in logged-in state (no public artifacts)
 */

interface WorkItemTemplateProps {
  type: 'project' | 'artifact';
  isLoggedIn?: boolean;
  initialIsFavorite?: boolean;
  isNewProject?: boolean;
  isDuplicatedTemplate?: boolean;
  onBack?: () => void;
  onUseTemplate?: (customName?: string) => void;
  onSignIn?: () => void;
  onToggleFavorite?: (isFavorited: boolean) => void;
  onSendMessage?: (text: string, setTypingIndicator?: (show: boolean) => void) => void;
  templateData?: any; // Can pass custom template data
  conversationMessages?: any[];
  userMessageCount?: number;
}

const WorkItemTemplate: React.FC<WorkItemTemplateProps> = ({
  type,
  isLoggedIn = false,
  initialIsFavorite = false,
  isNewProject = false,
  isDuplicatedTemplate = false,
  onBack,
  onUseTemplate,
  onSignIn,
  onToggleFavorite,
  onSendMessage,
  templateData: customTemplateData,
  conversationMessages = [],
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [showCopadoTyping, setShowCopadoTyping] = useState(false);
  const [selectedContent, setSelectedContent] = useState<{type: 'output' | 'highlight', title: string, content: string} | null>(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [activeTab, setActiveTab] = useState<'steps' | 'highlights' | 'output'>('steps');
  const [showSalesforceAuthModal, setShowSalesforceAuthModal] = useState(false);

  const handleToggleFavorite = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    if (onToggleFavorite) {
      onToggleFavorite(newFavoriteState);
    }
  };

  // Sample code for artifact display
  const sampleCode = `public class AppointmentHandler {
    public static void handleAppointment(Id appointmentId) {
        // Query the appointment
        Appointment__c appt = [
            SELECT Id, Status__c, Patient__c, Provider__c
            FROM Appointment__c
            WHERE Id = :appointmentId
            LIMIT 1
        ];
        
        // Update appointment status
        appt.Status__c = 'Confirmed';
        update appt;
        
        // Send confirmation email
        sendConfirmationEmail(appt);
    }
    
    private static void sendConfirmationEmail(Appointment__c appt) {
        // Email logic here
        System.debug('Sending email for: ' + appt.Id);
    }
}`;

  // ============ STATE DETERMINATION ============
  // Determine which of the 6 states we're in
  
  // For artifacts, isLoggedIn is always true
  // const actualIsLoggedIn = type === 'artifact' ? true : isLoggedIn;
  
  // State 1: Template - Not Logged In
  const isTemplateNotLoggedIn = type === 'project' && !isDuplicatedTemplate && !isNewProject && !isLoggedIn;
  
  // State 2: Template - Logged In
  const isTemplateLoggedIn = type === 'project' && !isDuplicatedTemplate && !isNewProject && isLoggedIn;
  
  // State 3: Project from Template - Not Logged In (viewing shared project)
  // const isProjectFromTemplateNotLoggedIn = type === 'project' && isDuplicatedTemplate && !isLoggedIn;
  
  // State 4: Project from Template - Logged In (active workspace from template)
  const isProjectFromTemplateLoggedIn = type === 'project' && isDuplicatedTemplate && isLoggedIn;
  
  // State 5: Project from Scratch - Logged In (created from conversation)
  const isProjectFromScratchLoggedIn = type === 'project' && isNewProject && isLoggedIn;
  
  // State 6: Artifact - Logged In (always logged in)
  const isArtifactLoggedIn = type === 'artifact';
  
  // Format relative time for projects
  const getRelativeTime = () => {
    const now = new Date();
    const createdDate = new Date(now.getTime() - (2 * 60 * 60 * 1000)); // 2 hours ago for demo
    const diffMs = now.getTime() - createdDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}hr ago`;
    return `${diffDays}d ago`;
  };

  // Default template data - can be overridden via props
  const defaultTemplateData = {
    category: type === 'artifact' ? 'Deployment Artifacts' : 'Strategists',
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

  // Merge custom template data with defaults
  const templateData = customTemplateData 
    ? {
        ...defaultTemplateData,
        ...customTemplateData,
        // Use description as subtitle if subtitle not provided
        subtitle: customTemplateData.subtitle || customTemplateData.description || defaultTemplateData.subtitle,
      }
    : defaultTemplateData;

  // ============ ARTIFACT: LOGGED IN ============
  if (isArtifactLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 animate-fadeIn">
        {/* Header */}
        <TopNav
          title={templateData.title || 'Appointment Handler Class'}
          subtitle="Code | Last Modified"
          onBack={onBack}
          showFavorite={true}
          isFavorited={isFavorite}
          onFavorite={handleToggleFavorite}
          primaryAction={{
            label: 'Download',
            onClick: () => {
              console.log('Download artifact');
              // TODO: Implement download functionality
            },
            variant: 'blue'
          }}
        />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Code/Artifact Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                {/* Code Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {templateData.title || 'Appointment Handler Class'}
                  </h3>
                  <button
                    onClick={() => {
                      // Copy code to clipboard
                      navigator.clipboard.writeText(sampleCode);
                      console.log('Code copied!');
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                </div>

                {/* Code Block */}
                <div className="p-6">
                  <pre className="bg-slate-900 text-slate-100 p-6 rounded-lg overflow-x-auto text-sm font-mono">
                    <code>{sampleCode}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Instructions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sticky top-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Instructions</h3>
                
                <div className="space-y-4 text-sm text-slate-700">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Where to put this code:</h4>
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                      <li>Navigate to Setup in Salesforce</li>
                      <li>Go to Apex Classes</li>
                      <li>Click "New" to create a new class</li>
                      <li>Paste the code into the editor</li>
                      <li>Click "Save"</li>
                    </ol>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Salesforce Developer Edition or higher</li>
                      <li>System Administrator permissions</li>
                      <li>API v58.0 or later</li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-2">Next Steps:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Test the class in a sandbox first</li>
                      <li>Create test methods with 75%+ coverage</li>
                      <li>Deploy to production when ready</li>
                    </ul>
                  </div>
                </div>

                <button className="w-full mt-6 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                  View in Salesforce
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ PROJECT FROM TEMPLATE: LOGGED IN ============
  if (isProjectFromTemplateLoggedIn) {
    const outputItems = [
      { title: 'Code', subtitle: 'asdlfsdf', content: 'Code implementation details here. You can modify and customize this code to fit your specific needs.' },
      { title: 'Artifact', subtitle: 'asdkfjasdfj', content: 'Artifact documentation and resources. Update this section with your specific artifact details.' }
    ];

    const highlightItems = templateData.whatsIncluded || [
      'Step-by-step guidance',
      'AI-powered assistance',
      'Best practice recommendations',
      'Automated testing',
      'Deployment checklist',
      'Documentation templates',
    ];

    return (
      <div className="min-h-screen bg-slate-50 animate-fadeIn">
        {/* Header */}
        <TopNav
          title={templateData.title}
          subtitle={`Template Duplicate | ${getRelativeTime()}`}
          onBack={onBack}
          showFavorite={true}
          isFavorited={isFavorite}
          onFavorite={handleToggleFavorite}
          primaryAction={{
            label: 'Share',
            onClick: () => console.log('Share clicked'),
            icon: <Share2 className="w-4 h-4" />,
            variant: 'white'
          }}
        />

        {/* Progress Steps */}
        <div className="bg-gradient-to-r from-indigo-400 to-indigo-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => setShowAllSteps(!showAllSteps)}
              className="flex items-center gap-2 text-white text-sm mb-2"
            >
              {showAllSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>Show All Steps</span>
            </button>
            <div>
              <p className="text-white text-sm font-semibold">Next Step: Set up sandboxes</p>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Left Column - Main Content */}
            <div className="flex-1">
              {/* AI Input Section */}
              <div className="mb-6">
                <p className="text-slate-600 text-sm mb-4">
                  Modify this artifact at any time here. A new version will be saved.
                </p>
                <AIInput
                  placeholder="Describe modifications..."
                  onSendMessage={(text) => {
                    if (onSendMessage) {
                      onSendMessage(text, setShowCopadoTyping);
                    }
                  }}
                  onIntegrationsClick={() => console.log('Integrations clicked')}
                  autoFocus={false}
                  isLoggedIn={true}
                  pageContext="workspace"
                  hasConversation={conversationMessages.length > 0}
                  messages={conversationMessages}
                  showTypingIndicator={showCopadoTyping}
                />
              </div>

              {/* Selected Content Display */}
              {selectedContent ? (
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">{selectedContent.title}</h2>
                  <p className="text-slate-700 whitespace-pre-wrap">{selectedContent.content}</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                  <p className="text-slate-500">Select an output or highlight from the right panel to view and edit</p>
                </div>
              )}
            </div>

            {/* Right Sidebar - Output & Highlights */}
            <div className="w-80 space-y-6">
              {/* Output Section */}
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Output</h3>
                <div className="space-y-3">
                  {outputItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedContent({
                        type: 'output',
                        title: item.title,
                        content: item.content
                      })}
                      className="w-full text-left p-3 hover:bg-slate-50 rounded transition-colors border border-slate-200"
                    >
                      <p className="font-semibold text-slate-900">{item.title}:</p>
                      <p className="text-sm text-slate-600">{item.subtitle}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Highlights Section */}
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Highlights</h3>
                <div className="space-y-2">
                  {highlightItems.map((item: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedContent({
                        type: 'highlight',
                        title: `Highlight: ${item}`,
                        content: `Details about ${item}. This section provides comprehensive information and guidance.`
                      })}
                      className="w-full text-left p-2 hover:bg-slate-50 rounded transition-colors text-sm text-slate-700"
                    >
                      <span className="text-green-600 mr-2">✓</span>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ PROJECT FROM SCRATCH: LOGGED IN ============
  if (isProjectFromScratchLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 animate-fadeIn">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left: Back Button */}
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>

              {/* Center: Title */}
              <div className="flex-1 text-center">
                <div className="text-xs text-slate-500 mb-1">
                  Project - New
                </div>
                <h1 className="text-xl font-semibold text-slate-900">
                  {templateData.title}
                </h1>
              </div>

              {/* Right: Share and Favorite */}
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Star className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Sections */}
        <div className="bg-indigo-100 border-b border-indigo-200 px-6 py-3">
          <div className="max-w-4xl mx-auto text-sm text-slate-900">
            <span className="font-semibold">Last Step:</span> Created Project Space
          </div>
        </div>

        <div className="bg-indigo-600 border-b border-indigo-700 px-6 py-3">
          <div className="max-w-4xl mx-auto text-sm text-white">
            <span className="font-semibold">Next Step:</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Continue Conversation Section */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-center text-slate-600 font-medium mb-6">
              Continue The Conversation
            </h2>

            <AIInput
              placeholder=""
              onSendMessage={(text) => {
                if (onSendMessage) {
                  onSendMessage(text, setShowCopadoTyping);
                }
              }}
              onIntegrationsClick={() => console.log('Integrations clicked')}
              autoFocus={false}
              isLoggedIn={true}
              pageContext="workspace"
              hasConversation={conversationMessages.length > 0}
              messages={conversationMessages}
              showTypingIndicator={showCopadoTyping}
            />
          </div>

          {/* Conversation Label */}
          <div className="text-sm text-slate-600">
            Conv
          </div>
        </div>
      </div>
    );
  }

  // ============ TEMPLATE: NOT LOGGED IN ============
  if (isTemplateNotLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 animate-fadeIn">
        {/* Header */}
        <TopNav
          title={templateData.title}
          categoryBadge={{
            text: templateData.category,
            color: templateData.category.toLowerCase().includes('deploy') ? 'blue' 
              : templateData.category.toLowerCase().includes('plan') ? 'purple'
              : templateData.category.toLowerCase().includes('support') ? 'green'
              : templateData.category.toLowerCase().includes('optim') ? 'amber'
              : 'slate'
          }}
          onBack={onBack}
          showFavorite={true}
          isFavorited={isFavorite}
          onFavorite={handleToggleFavorite}
          primaryAction={{
            label: 'Run',
            onClick: () => onUseTemplate?.(), // Opens pricing page when not logged in
            variant: 'blue'
          }}
        />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                <div className="border-b border-slate-200">
                  <div className="flex">
                    <button 
                      onClick={() => setActiveTab('steps')}
                      className={`px-6 py-4 text-sm font-medium ${
                        activeTab === 'steps'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Steps
                    </button>
                    <button 
                      onClick={() => setActiveTab('highlights')}
                      className={`px-6 py-4 text-sm font-medium ${
                        activeTab === 'highlights'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Highlights
                    </button>
                    <button 
                      onClick={() => setActiveTab('output')}
                      className={`px-6 py-4 text-sm font-medium ${
                        activeTab === 'output'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Output
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {/* Steps Tab */}
                  {activeTab === 'steps' && (
                    <>
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          <span>{templateData.favorites.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{templateData.views} views</span>
                        </div>
                      </div>

                      {/* Subtitle */}
                      <p className="text-slate-600 mb-6">{templateData.subtitle}</p>

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
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">
                              {section.title}
                            </h3>
                            <p className="text-slate-600 mb-6">{section.description}</p>

                            {/* Steps */}
                            <div className="space-y-4">
                              {section.steps.map((step: any) => (
                                <div key={step.number} className="flex gap-4">
                                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                                    {step.number}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-slate-900 mb-1">
                                      {step.title}
                                    </h4>
                                    <p className="text-sm text-slate-600">{step.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Highlights Tab */}
                  {activeTab === 'highlights' && (
                    <div className="space-y-3">
                      {templateData.whatsIncluded.map((item: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
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
                          <span className="text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Output Tab */}
                  {activeTab === 'output' && (
                    <div className="text-center py-12 text-slate-500">
                      <p>Output examples will be available after you remix this template</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - CTA Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sticky top-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Ready to Get Started?
                </h3>

                <p className="text-slate-600 mb-6">
                  Sign up to use this template and access all features of Copado AI.
                </p>
                
                <button
                  onClick={() => onUseTemplate?.()}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mb-2"
                >
                  View Pricing Plans
                </button>
                
                <div className="text-center text-sm text-slate-600">
                  Already have an account?{' '}
                  <button onClick={onSignIn} className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in
                  </button>
                </div>

                {/* What's Included */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-4">What's Included:</h4>
                  <ul className="space-y-3">
                    {templateData.whatsIncluded.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
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
  }

  // ============ TEMPLATE: LOGGED IN ============
  if (isTemplateLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 animate-fadeIn">
        {/* Header */}
        <TopNav
          title={templateData.title}
          categoryBadge={{
            text: templateData.category,
            color: templateData.category.toLowerCase().includes('deploy') ? 'blue' 
              : templateData.category.toLowerCase().includes('plan') ? 'purple'
              : templateData.category.toLowerCase().includes('support') ? 'green'
              : templateData.category.toLowerCase().includes('optim') ? 'amber'
              : 'slate'
          }}
          onBack={onBack}
          showFavorite={true}
          isFavorited={isFavorite}
          onFavorite={handleToggleFavorite}
          primaryAction={{
            label: 'Set up sandboxes to run',
            onClick: () => setShowSalesforceAuthModal(true),
            variant: 'blue'
          }}
        />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* AI Input Section */}
          <div className="mb-6">
            <p className="text-slate-600 text-sm mb-4">
              Try out this template. Ask questions or describe what you'd like to do.
            </p>
            <AIInput
              placeholder="Ask about this template or describe your use case..."
              onSendMessage={(text) => {
                console.log('Template preview message:', text);
                // Could show a preview of how the template works
              }}
              onIntegrationsClick={() => console.log('Integrations clicked')}
              autoFocus={false}
              isLoggedIn={true}
              pageContext="workspace"
              hasConversation={false}
              messages={[]}
              showTypingIndicator={false}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Template Description */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{templateData.favorites.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{templateData.views} views</span>
                  </div>
                </div>

                {/* Subtitle */}
                <p className="text-slate-600 mb-6">{templateData.subtitle}</p>

                {/* Time Savings */}
                <div className="flex items-center gap-2 text-blue-600 mb-8">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg font-medium">
                    Saves an estimated {templateData.savedHours} hours
                  </span>
                </div>

                {/* Description */}
                <div className="prose max-w-none">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">About This Template</h3>
                  <p className="text-slate-600">
                    This template will guide you through the complete process of implementing this solution in your Salesforce environment.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Output & Steps */}
            <div className="lg:col-span-1 space-y-6">
              {/* Output Section */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Output</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-semibold text-slate-900 text-sm mb-1">Artifacts</p>
                    <p className="text-xs text-slate-600">Deployment packages, configurations</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-semibold text-slate-900 text-sm mb-1">Code</p>
                    <p className="text-xs text-slate-600">Apex classes, triggers, components</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-semibold text-slate-900 text-sm mb-1">User Stories</p>
                    <p className="text-xs text-slate-600">Requirements and acceptance criteria</p>
                  </div>
                </div>
              </div>

              {/* Steps Section */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Steps</h3>
                <div className="space-y-2">
                  {templateData.sections[0]?.steps.map((step: any) => (
                    <div key={step.number} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded transition-colors">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        {step.number}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{step.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Salesforce Authentication Modal */}
        <Dialog open={showSalesforceAuthModal} onClose={() => setShowSalesforceAuthModal(false)} className="relative z-50">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
          />

          <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel
                transition
                className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {/* Close button */}
                <button
                  onClick={() => setShowSalesforceAuthModal(false)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>

                <DialogTitle className="text-2xl font-bold text-slate-900 mb-2">
                  Connect Salesforce
                </DialogTitle>
                
                <p className="text-sm text-slate-600 mb-6">
                  Authenticate with Salesforce to set up sandboxes and run this template.
                </p>

                {/* Salesforce Logo */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                    </svg>
                  </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-slate-700">
                    You'll be redirected to Salesforce to authorize access to your sandbox environments.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSalesforceAuthModal(false)}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implement Salesforce OAuth flow
                      console.log('Authenticate with Salesforce');
                      setShowSalesforceAuthModal(false);
                      // After auth, could open rename modal or directly create project
                      setTemplateName(templateData.title || 'My Project');
                      setShowRenameModal(true);
                    }}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Connect Salesforce
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }

  // Fallback - should never reach here if all states are properly handled
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Unknown State</h1>
        <p className="text-slate-600 mb-4">This work item is in an unexpected state.</p>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>

      {/* Rename Template Modal - Shared across states */}
      <Dialog open={showRenameModal} onClose={() => setShowRenameModal(false)} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            >
              {/* Close button */}
              <button
                onClick={() => setShowRenameModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <DialogTitle className="text-2xl font-bold text-slate-900 mb-2">
                Name Your {type === 'project' ? 'Project' : 'Artifact'}
              </DialogTitle>
              
              <p className="text-sm text-slate-600 mb-6">
                Give your {type === 'project' ? 'project' : 'artifact'} a name to get started.
              </p>

              {/* Input field */}
              <div className="mb-6">
                <label htmlFor="template-name" className="block text-sm font-medium text-slate-700 mb-2">
                  {type === 'project' ? 'Project' : 'Artifact'} Name
                </label>
                <input
                  id="template-name"
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                  placeholder="Enter a name..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && templateName.trim()) {
                      setShowRenameModal(false);
                      onUseTemplate?.(templateName.trim());
                    }
                  }}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRenameModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (templateName.trim()) {
                      setShowRenameModal(false);
                      onUseTemplate?.(templateName.trim());
                    }
                  }}
                  disabled={!templateName.trim()}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default WorkItemTemplate;
