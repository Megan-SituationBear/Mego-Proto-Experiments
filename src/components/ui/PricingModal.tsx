import { useState } from 'react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string; // e.g., "downloads and pinning"
}

const PricingModal: React.FC<PricingModalProps> = ({ 
  isOpen, 
  onClose,
  feature = "downloads and pinning"
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  if (!isOpen) return null;

  const plans = [
    {
      name: 'Free',
      description: 'Get started with essential features',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        '3 projects per month',
        'Basic AI assistance',
        'Community templates',
        'Community support',
      ],
      cta: 'Current Plan',
      highlighted: false,
      isFree: true,
    },
    {
      name: 'Starter',
      description: 'Perfect for individuals getting started',
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        'Unlimited projects',
        'Advanced AI assistance',
        'Download artifacts',
        'Pin messages',
        'Standard templates',
        'Email support',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
      isFree: false,
    },
    {
      name: 'Pro',
      description: 'For professionals and growing teams',
      monthlyPrice: 79,
      annualPrice: 790,
      features: [
        'Everything in Starter',
        'All premium templates',
        'Priority support',
        'Custom integrations',
        'Team collaboration',
        'Advanced analytics',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
      isFree: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Upgrade for {feature}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose a plan to unlock premium features. All plans include a 14-day free trial.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Annual
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg ${
                  plan.highlighted 
                    ? 'border-blue-600 shadow-md scale-105' 
                    : 'border-slate-200'
                }`}
              >
                {/* Recommended Badge */}
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-xs font-semibold py-2 text-center">
                    RECOMMENDED
                  </div>
                )}

                <div className={`p-6 ${plan.highlighted ? 'pt-12' : ''}`}>
                  {/* Plan Name */}
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-4">
                    {plan.monthlyPrice !== null ? (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-slate-900">
                            ${plan.monthlyPrice === 0 ? '0' : (billingCycle === 'monthly' ? plan.monthlyPrice : Math.floor(plan.annualPrice / 12))}
                          </span>
                          <span className="text-slate-600 text-sm">/month</span>
                        </div>
                        {billingCycle === 'annual' && plan.monthlyPrice > 0 && (
                          <p className="text-xs text-slate-500 mt-1">
                            ${plan.annualPrice} billed annually
                          </p>
                        )}
                        {plan.monthlyPrice === 0 && (
                          <p className="text-xs text-slate-500 mt-1">
                            Forever free
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => {
                      if (!plan.isFree) {
                        console.log('Upgrade to:', plan.name);
                        // Handle upgrade
                      }
                    }}
                    disabled={plan.isFree}
                    className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all mb-4 ${
                      plan.isFree
                        ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                        : plan.highlighted
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                        : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  {/* Features List */}
                  <div className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Questions? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Contact our sales team</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;

