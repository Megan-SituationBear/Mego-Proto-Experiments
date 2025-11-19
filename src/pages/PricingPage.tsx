import React, { useState } from 'react';
import MatchingModal from '../components/ui/MatchingModal';
import NameCollectionModal from '../components/ui/NameCollectionModal';
import BuildingModal from '../components/ui/BuildingModal';

interface PricingPageProps {
  onNavigateHome?: () => void;
  onSignupComplete?: (userName: string) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ 
  onNavigateHome,
  onSignupComplete
}) => {
  const [showMatchingModal, setShowMatchingModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [userName, setUserName] = useState('');

  const handleQuestionsComplete = () => {
    setShowMatchingModal(false);
    setShowNameModal(true);
  };

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setShowNameModal(false);
    setShowBuildingModal(true);
  };

  const handleBuildingComplete = () => {
    setShowBuildingModal(false);
    if (onSignupComplete) {
      onSignupComplete(userName);
    }
  };

  const handleGetStarted = (planName: string) => {
    if (planName === 'Enterprise') {
      window.open('mailto:sales@copado.com', '_blank');
    } else {
      setShowMatchingModal(true);
    }
  };
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: 'per user/month',
      description: 'Perfect for individuals getting started',
      features: [
        'Unlimited projects',
        'Advanced AI assistance',
        'Download artifacts',
        'Pin messages',
        'Standard templates',
        'Email support',
      ],
      cta: 'Get Started For Free',
      highlighted: false
    },
    {
      name: 'Team',
      price: '$79',
      period: 'per user/month',
      description: 'For professionals and growing teams',
      features: [
        'Everything in Starter',
        'All premium templates',
        'Priority support',
        'Custom integrations',
        'Team collaboration',
        'Advanced analytics',
        'Shared workspaces',
        'Team templates'
      ],
      cta: 'Get Started For Free',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large teams needing advanced features',
      features: [
        'Everything in Team',
        'Dedicated account manager',
        'Custom AI training',
        'Advanced security & SSO',
        'SLA guarantee',
        'Audit logs',
        'Custom integrations',
        'Unlimited storage'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 text-slate-900 hover:text-blue-600 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <span className="font-bold text-lg">+ COPADO AI</span>
            </button>
            
            <button
              onClick={onNavigateHome}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4">
          Work is Team Work
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
          Save, share, create team templates for salesforce work items, discuss and collaborate.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl border-4 border-blue-400'
                  : 'bg-white border-2 border-slate-200 shadow-lg'
              }`}
            >
              {plan.highlighted && (
                <div className="inline-block px-3 py-1 bg-yellow-400 text-blue-900 text-xs font-bold rounded-full mb-3">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                {plan.name}
              </h3>
              
              <div className="mb-3">
                <span className={`text-3xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                  {plan.price}
                </span>
                <span className={`text-xs ml-2 ${plan.highlighted ? 'text-blue-100' : 'text-slate-500'}`}>
                  {plan.period}
                </span>
              </div>
              
              <p className={`text-xs mb-5 ${plan.highlighted ? 'text-blue-100' : 'text-slate-600'}`}>
                {plan.description}
              </p>
              
              <button
                onClick={() => handleGetStarted(plan.name)}
                className={`w-full py-2.5 px-6 rounded-lg font-semibold text-sm transition-all mb-5 ${
                  plan.highlighted
                    ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {plan.cta}
              </button>
              
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? 'text-blue-200' : 'text-green-500'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className={`text-xs ${plan.highlighted ? 'text-blue-100' : 'text-slate-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Can I switch plans later?
            </h3>
            <p className="text-slate-600">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              What happens after my trial ends?
            </h3>
            <p className="text-slate-600">
              Your 14-day trial is completely free. After it ends, you can choose to subscribe or continue with limited features.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Do you offer refunds?
            </h3>
            <p className="text-slate-600">
              Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.
            </p>
          </div>
        </div>
      </div>

      {/* Signup Flow Modals */}
      <MatchingModal
        isOpen={showMatchingModal}
        onClose={() => setShowMatchingModal(false)}
        onComplete={handleQuestionsComplete}
        onBrowseTemplates={() => handleQuestionsComplete()}
      />

      <NameCollectionModal
        isOpen={showNameModal}
        onSubmit={handleNameSubmit}
      />

      <BuildingModal
        isOpen={showBuildingModal}
        onComplete={handleBuildingComplete}
      />
    </div>
  );
};

export default PricingPage;
