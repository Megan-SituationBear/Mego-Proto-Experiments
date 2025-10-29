import { useState } from 'react';

interface PricingPageProps {
  onBack: () => void;
  onSelectPlan: (plan: string) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onBack, onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Free',
      description: 'Get started with essential features at no cost',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        '3 projects per month',
        'Basic AI assistance',
        'Community templates',
        'Community support',
      ],
      cta: 'Get Started Free',
      highlighted: false,
    },
    {
      name: 'Starter',
      description: 'Perfect for individuals and small teams getting started',
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        '5 projects per month',
        'Basic AI assistance',
        'Standard templates',
        'Email support',
        'Community access',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      name: 'Projects + Templates',
      description: 'For growing teams that need advanced features',
      monthlyPrice: 79,
      annualPrice: 790,
      features: [
        'Unlimited projects',
        'Advanced AI assistance',
        'All premium templates',
        'Priority support',
        'Custom integrations',
        'Team collaboration',
        'Advanced analytics',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      monthlyPrice: null,
      annualPrice: null,
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Custom template creation',
        'SSO & advanced security',
        'SLA guarantees',
        'Onboarding & training',
        'API access',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Back button and Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 rounded hover:bg-slate-100 transition-colors"
                aria-label="Back"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.178 8.00001C16.412 6.23401 13.549 6.23401 11.784 8.00001L12 8.21601L12.216 8.00001C13.982 6.23401 16.845 6.23401 18.611 8.00001C20.377 9.76601 20.377 12.629 18.611 14.394C16.845 16.16 13.982 16.16 12.216 14.394L12 14.178L11.784 14.394C10.018 16.16 7.15497 16.16 5.38897 14.394C3.62297 12.628 3.62297 9.76601 5.38897 8.00001C7.15497 6.23401 10.018 6.23401 11.784 8.00001L12 8.21601L11.784 8.00001C10.018 6.23401 7.15497 6.23401 5.38897 8.00001C3.62297 9.76601 3.62297 12.629 5.38897 14.394C7.15497 16.16 10.018 16.16 11.784 14.394L12 14.178L12.216 14.394C13.982 16.16 16.845 16.16 18.611 14.394C20.377 12.628 20.377 9.76601 18.611 8.00001C16.845 6.23401 13.982 6.23401 12.216 8.00001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900">Copado AI</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Start saving time today with Copado AI. All plans include a 14-day free trial.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-blue-600 text-white shadow-sm hover:bg-indigo-600 hover:shadow-md'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
              billingCycle === 'annual'
                ? 'bg-blue-600 text-white shadow-sm hover:bg-indigo-600 hover:shadow-md'
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

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-2xl ${
                plan.highlighted ? 'ring-2 ring-blue-600 scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  {plan.monthlyPrice !== null ? (
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-slate-900">
                          ${plan.monthlyPrice === 0 ? '0' : (billingCycle === 'monthly' ? plan.monthlyPrice : Math.floor(plan.annualPrice / 12))}
                        </span>
                        <span className="text-slate-600">/month</span>
                      </div>
                      {billingCycle === 'annual' && plan.monthlyPrice > 0 && (
                        <p className="text-sm text-slate-500 mt-1">
                          ${plan.annualPrice} billed annually
                        </p>
                      )}
                      {plan.monthlyPrice === 0 && (
                        <p className="text-sm text-slate-500 mt-1">
                          Forever free
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-slate-900">
                      Custom Pricing
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => onSelectPlan(plan.name)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all mb-6 cursor-pointer ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white shadow-sm hover:bg-indigo-600 hover:shadow-md'
                      : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {plan.cta}
                </button>

                {/* Features List */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-900 mb-3">
                    What's included:
                  </p>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
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
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Can I switch plans later?
              </h3>
              <p className="text-slate-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-slate-600">
                We accept all major credit cards, PayPal, and wire transfers for Enterprise customers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-slate-600">
                Yes! All plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                What happens after my trial ends?
              </h3>
              <p className="text-slate-600">
                You'll be automatically enrolled in your selected plan. You can cancel anytime before the trial ends with no charges.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-slate-600 mb-6">
            Our team is here to help you find the perfect plan for your needs.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2 rounded border border-slate-300 text-slate-900 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer">
              Contact Sales
            </button>
            <button className="px-6 py-2 rounded bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-indigo-600 hover:shadow-md transition-all cursor-pointer">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
