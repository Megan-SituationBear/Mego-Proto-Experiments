import { useState } from 'react';
import { 
  ShareIcon, 
  DocumentDuplicateIcon, 
  StarIcon as StarOutline,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface WorkspaceProps {
  hasStarted: boolean;
  projectTitle?: string;
}

interface Step {
  number: number;
  title: string;
  description: string;
}

interface Message {
  type: 'user' | 'bot';
  name: string;
  time: string;
  text: string;
  avatar?: string;
}

const Workspace: React.FC<WorkspaceProps> = ({ projectTitle = 'Landing Page Redesign' }) => {
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'steps' | 'code' | 'artifacts'>('steps');
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [activeStepNumber, setActiveStepNumber] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const steps: Step[] = [
    {
      number: 1,
      title: 'Complete Hero Section Update',
      description: 'Finalize the new copy and ensure it\'s mobile-responsive. This includes updating the headline, subheadline, and call-to-action buttons.'
    },
    {
      number: 2,
      title: 'Optimize Images',
      description: 'Compress and resize images for faster loading times. Target: reduce image sizes by 60% without quality loss.'
    },
    {
      number: 3,
      title: 'Add Call-to-Action Buttons',
      description: 'Implement primary and secondary CTAs with proper styling. Primary: Get Started, Secondary: Learn More'
    },
    {
      number: 4,
      title: 'Test Responsive Design',
      description: 'Verify layout works across all device sizes: mobile (320px), tablet (768px), and desktop (1200px+)'
    },
    {
      number: 5,
      title: 'Performance Audit',
      description: 'Run Lighthouse test and optimize based on results. Target scores: Performance 90+, Accessibility 100, SEO 100'
    }
  ];

  const messages: Message[] = [
    {
      type: 'bot',
      name: 'AI Assistant',
      time: '10:30 AM',
      text: `Great! I've created a workspace for "${projectTitle}". Click on any suggested step to load it here for modification.`
    }
  ];

  const handleStepClick = (step: Step) => {
    setSelectedStep(step);
    setActiveStepNumber(step.number);
  };

  const closeWorkItem = () => {
    setSelectedStep(null);
    setActiveStepNumber(null);
  };

  const toggleChat = () => {
    setIsChatCollapsed(!isChatCollapsed);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
      {/* Header */}
      <header style={{
        minHeight: '64px',
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', margin: 0 }}>
            {projectTitle}
          </h1>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Oct 16, 2025</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            padding: '8px 16px',
            border: '1px solid #e5e7eb',
            background: 'white',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShareIcon style={{ width: '16px', height: '16px' }} />
            <span>Share</span>
          </button>
          <button style={{
            padding: '8px 16px',
            border: '1px solid #e5e7eb',
            background: 'white',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <DocumentDuplicateIcon style={{ width: '16px', height: '16px' }} />
            <span>Duplicate</span>
          </button>
          <button 
            onClick={toggleFavorite}
            style={{
              padding: '8px 16px',
              border: '1px solid #e5e7eb',
              background: 'white',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: isFavorite ? '#f59e0b' : 'inherit'
            }}
          >
            {isFavorite ? (
              <StarSolid style={{ width: '16px', height: '16px' }} />
            ) : (
              <StarOutline style={{ width: '16px', height: '16px' }} />
            )}
            <span>Favorite</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isChatCollapsed ? '0 1fr' : '1fr 3fr',
        height: 'calc(100% - 64px)',
        transition: 'grid-template-columns 0.3s ease'
      }}>
        {/* Left Section - Chat */}
        <section style={{
          borderRight: isChatCollapsed ? 'none' : '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          background: '#fafafa',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          {/* Collapse Toggle */}
          <div 
            onClick={toggleChat}
            style={{
              position: 'absolute',
              right: isChatCollapsed ? 'auto' : '-20px',
              left: isChatCollapsed ? '-20px' : 'auto',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '60px',
              background: '#2563eb',
              borderRadius: isChatCollapsed ? '4px 0 0 4px' : '0 4px 4px 0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              zIndex: 10
            }}
          >
            {isChatCollapsed ? (
              <ChevronRightIcon style={{ width: '16px', height: '16px' }} />
            ) : (
              <ChevronLeftIcon style={{ width: '16px', height: '16px' }} />
            )}
          </div>

          {/* Chat Header */}
          <div style={{
            padding: '20px 24px',
            background: 'white',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#111827',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: 0
            }}>
              <ChatBubbleLeftRightIcon style={{ width: '20px', height: '20px' }} />
              Modify Your Work
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#6b7280',
              marginTop: '4px',
              marginBottom: 0
            }}>
              Chat with AI to make changes to your project
            </p>
          </div>

          {/* Chat Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px'
          }}>
            {/* Work Item Preview */}
            {selectedStep && (
              <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px',
                border: '2px solid #2563eb'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: 0
                  }}>
                    <span style={{
                      display: 'inline-flex',
                      width: '24px',
                      height: '24px',
                      background: '#2563eb',
                      color: 'white',
                      borderRadius: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      {selectedStep.number}
                    </span>
                    <span>{selectedStep.title}</span>
                  </h3>
                  <button 
                    onClick={closeWorkItem}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <XMarkIcon style={{ width: '20px', height: '20px' }} />
                  </button>
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: 1.6
                }}>
                  {selectedStep.description}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message, index) => (
              <div key={index} style={{ marginBottom: '24px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: message.type === 'bot' ? '#4f46e5' : '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 600
                  }}>
                    {message.type === 'bot' ? 'AI' : 'U'}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                    {message.name}
                  </span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {message.time}
                  </span>
                </div>
                <div style={{ paddingLeft: '36px' }}>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#374151', margin: 0 }}>
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div style={{
            padding: '20px 24px',
            background: 'white',
            borderTop: '1px solid #e5e7eb'
          }}>
            <textarea 
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              rows={3}
              placeholder="Type your modification request..."
            />
          </div>
        </section>

        {/* Right Section */}
        <section style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          position: 'relative'
        }}>
          {/* Tabs */}
          <div style={{ borderBottom: '1px solid #e5e7eb', background: 'white' }}>
            <div style={{ display: 'flex', padding: '0 24px' }}>
              {(['steps', 'code', 'artifacts'] as const).map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: activeTab === tab ? '#2563eb' : '#6b7280',
                    cursor: 'pointer',
                    borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab === 'steps' ? 'Suggested Steps' : tab === 'code' ? 'View Code' : 'All Artifacts'}
                </div>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {/* Suggested Steps Tab */}
            {activeTab === 'steps' && (
              <div style={{ padding: '24px' }}>
                {steps.map((step) => (
                  <div
                    key={step.number}
                    onClick={() => handleStepClick(step)}
                    style={{
                      background: activeStepNumber === step.number ? '#eff6ff' : '#f9fafb',
                      border: `1px solid ${activeStepNumber === step.number ? '#2563eb' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div>
                      <span style={{
                        display: 'inline-flex',
                        width: '24px',
                        height: '24px',
                        background: '#2563eb',
                        color: 'white',
                        borderRadius: '50%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 600,
                        marginRight: '12px'
                      }}>
                        {step.number}
                      </span>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#111827'
                      }}>
                        {step.title}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      paddingLeft: '36px',
                      margin: '4px 0 0 0'
                    }}>
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* View Code Tab */}
            {activeTab === 'code' && (
              <div style={{ padding: '24px' }}>
                <div style={{
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '20px',
                  borderRadius: '8px',
                  fontFamily: 'Monaco, Consolas, monospace',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  overflowX: 'auto'
                }}>
                  <pre style={{ margin: 0 }}>{`<section class="hero-section">
  <div class="container">
    <h1 class="hero-title">
      Transform Your Business with Our Solution
    </h1>
    <p class="hero-subtitle">
      Streamline your workflow and boost productivity
      with our innovative platform
    </p>
    <div class="hero-buttons">
      <button class="btn-primary">Get Started</button>
      <button class="btn-secondary">Learn More</button>
    </div>
  </div>
</section>`}</pre>
                </div>
              </div>
            )}

            {/* All Artifacts Tab */}
            {activeTab === 'artifacts' && (
              <div style={{ padding: '24px' }}>
                {[
                  { name: 'Hero Section v2', type: 'HTML/CSS • Updated 5 mins ago' },
                  { name: 'Hero Background Image', type: 'PNG • 2.4 MB' },
                  { name: 'Landing Page Copy', type: 'Text • Updated 10 mins ago' },
                  { name: 'Style Guide', type: 'CSS • 12 KB' }
                ].map((artifact, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#111827'
                      }}>
                        {artifact.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        {artifact.type}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        padding: '6px 14px',
                        fontSize: '12px',
                        border: '1px solid #e5e7eb',
                        background: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}>
                        Apply
                      </button>
                      <button style={{
                        padding: '6px 14px',
                        fontSize: '12px',
                        border: '1px solid #2563eb',
                        background: '#2563eb',
                        color: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}>
                        Download
                      </button>
                      <button style={{
                        padding: '6px 14px',
                        fontSize: '12px',
                        border: '1px solid #e5e7eb',
                        background: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}>
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Workspace;
