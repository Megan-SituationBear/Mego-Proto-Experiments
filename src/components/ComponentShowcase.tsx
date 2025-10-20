import React, { useState } from 'react';
import {
  TopNav,
  PrimaryButton,
  SecondaryButton,
  IconButton,
  TextButton,
  ButtonLockup,
  Modal,
  TemplateCardLoggedIn,
  TemplateCardLoggedOut,
} from './ui';
import { Plus, Heart, Settings, Download, Share2, Sparkles, Zap } from 'lucide-react';

const ComponentShowcase: React.FC = () => {
  const [navState, setNavState] = useState<'logged-out' | 'logged-in-major' | 'logged-in-minor'>('logged-out');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorited1, setFavorited1] = useState(false);
  const [bookmarked1, setBookmarked1] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Examples */}
      <div className="mb-8">
        <TopNav
          state={navState}
          userName="John Doe"
          notificationCount={3}
          onSignIn={() => console.log('Sign In')}
          onSignUp={() => console.log('Sign Up')}
          onNewProject={() => console.log('New Project')}
          onProfileClick={() => console.log('Profile')}
          onSettingsClick={() => console.log('Settings')}
          onNotificationsClick={() => console.log('Notifications')}
          onLogout={() => console.log('Logout')}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-roboto font-bold text-slate-950 mb-2 tracking-header">
          Component Showcase
        </h1>
        <p className="text-slate-600 mb-8">
          All UI components in one place for easy reference and testing
        </p>

        {/* Nav State Switcher */}
        <section className="mb-12 bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-roboto font-semibold text-slate-950 mb-4 tracking-header">
            Navigation States
          </h2>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setNavState('logged-out')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                navState === 'logged-out'
                  ? 'bg-copado-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Logged Out
            </button>
            <button
              onClick={() => setNavState('logged-in-major')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                navState === 'logged-in-major'
                  ? 'bg-copado-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Logged In Major
            </button>
            <button
              onClick={() => setNavState('logged-in-minor')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                navState === 'logged-in-minor'
                  ? 'bg-copado-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Logged In Minor
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Current state: <strong>{navState}</strong> (see navigation above)
          </p>
        </section>

        {/* Buttons Section */}
        <section className="mb-12 bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-roboto font-semibold text-slate-950 mb-4 tracking-header">
            Buttons
          </h2>
          
          <div className="space-y-6">
            {/* Primary & Secondary */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Primary & Secondary</h3>
              <div className="flex flex-wrap gap-3">
                <PrimaryButton onClick={() => console.log('Primary clicked')}>
                  Primary Button
                </PrimaryButton>
                <SecondaryButton onClick={() => console.log('Secondary clicked')}>
                  Secondary Button
                </SecondaryButton>
                <PrimaryButton disabled>Disabled Primary</PrimaryButton>
                <SecondaryButton disabled>Disabled Secondary</SecondaryButton>
              </div>
            </div>

            {/* Icon Buttons */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Icon Buttons</h3>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="text-sm text-gray-600 w-24">Primary:</span>
                  <IconButton variant="primary" size="sm">
                    <Plus className="w-4 h-4" />
                  </IconButton>
                  <IconButton variant="primary" size="md">
                    <Heart className="w-5 h-5" />
                  </IconButton>
                  <IconButton variant="primary" size="lg">
                    <Settings className="w-6 h-6" />
                  </IconButton>
                  <IconButton variant="primary" size="md" rounded>
                    <Plus className="w-5 h-5" />
                  </IconButton>
                </div>
                
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="text-sm text-gray-600 w-24">Secondary:</span>
                  <IconButton variant="secondary" size="sm">
                    <Download className="w-4 h-4" />
                  </IconButton>
                  <IconButton variant="secondary" size="md">
                    <Share2 className="w-5 h-5" />
                  </IconButton>
                  <IconButton variant="secondary" size="lg">
                    <Settings className="w-6 h-6" />
                  </IconButton>
                </div>
                
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="text-sm text-gray-600 w-24">Ghost:</span>
                  <IconButton variant="ghost" size="sm">
                    <Plus className="w-4 h-4" />
                  </IconButton>
                  <IconButton variant="ghost" size="md">
                    <Heart className="w-5 h-5" />
                  </IconButton>
                  <IconButton variant="ghost" size="lg">
                    <Settings className="w-6 h-6" />
                  </IconButton>
                </div>
              </div>
            </div>

            {/* Text Buttons */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Text Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <TextButton onClick={() => console.log('Text clicked')}>
                  Learn More
                </TextButton>
                <TextButton underline>
                  View Details
                </TextButton>
                <TextButton disabled>
                  Disabled Text
                </TextButton>
              </div>
            </div>

            {/* Button Lockup */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Button Lockups</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Horizontal:</p>
                  <ButtonLockup
                    primaryText="Get Started"
                    secondaryText="Learn More"
                    onPrimaryClick={() => console.log('Primary')}
                    onSecondaryClick={() => console.log('Secondary')}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Vertical:</p>
                  <ButtonLockup
                    orientation="vertical"
                    primaryText="Continue"
                    secondaryText="Cancel"
                    onPrimaryClick={() => console.log('Continue')}
                    onSecondaryClick={() => console.log('Cancel')}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Template Cards Section */}
        <section className="mb-12 bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-roboto font-semibold text-slate-950 mb-4 tracking-header">
            Template Cards
          </h2>
          
          <div className="space-y-6">
            {/* Logged In Cards */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Logged In (Interactive)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <TemplateCardLoggedIn
                  category="Automation"
                  categoryColor="purple"
                  savedHours={5}
                  title="Automate Rollback & Co-Builds"
                  description="Automatically rollback deployments and trigger co-builds when errors are detected."
                  favorites={42}
                  views={128}
                  icon={<Sparkles className="w-5 h-5 text-purple-500" />}
                  isFavorited={favorited1}
                  isBookmarked={bookmarked1}
                  onFavorite={() => setFavorited1(!favorited1)}
                  onBookmark={() => setBookmarked1(!bookmarked1)}
                  onShare={() => console.log('Share')}
                  onClick={() => console.log('Card clicked')}
                />
                
                <TemplateCardLoggedIn
                  category="Workflow"
                  categoryColor="blue"
                  savedHours={3}
                  title="Time-Saving Workflow Automation"
                  description="Streamline your development workflow with smart automation."
                  favorites={38}
                  views={95}
                  icon={<Zap className="w-5 h-5 text-blue-500" />}
                  isFavorited={false}
                  isBookmarked={false}
                  onFavorite={() => console.log('Favorite')}
                  onBookmark={() => console.log('Bookmark')}
                  onShare={() => console.log('Share')}
                  onClick={() => console.log('Card clicked')}
                />
              </div>
            </div>

            {/* Logged Out Cards */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Logged Out (Gated)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <TemplateCardLoggedOut
                  category="Deployment"
                  categoryColor="green"
                  savedHours={8}
                  title="Continuous Deployment Pipeline"
                  description="Set up CI/CD with automated testing and multi-environment deployment."
                  favorites={67}
                  views={203}
                  onSignIn={() => console.log('Sign In')}
                  onSignUp={() => console.log('Sign Up')}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Modal Section */}
        <section className="mb-12 bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-roboto font-semibold text-slate-950 mb-4 tracking-header">
            Modal
          </h2>
          <PrimaryButton onClick={() => setIsModalOpen(true)}>
            Open Modal Example
          </PrimaryButton>
          
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Example Modal"
          >
            <p className="text-slate-600 mb-4">
              This is an example modal with the correct overlay color (#03142D at 85% opacity),
              proper padding (24px), gap (24px), and shadow.
            </p>
            <ButtonLockup
              primaryText="Confirm"
              secondaryText="Cancel"
              onPrimaryClick={() => setIsModalOpen(false)}
              onSecondaryClick={() => setIsModalOpen(false)}
            />
          </Modal>
        </section>

        {/* Component List */}
        <section className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-roboto font-semibold text-slate-950 mb-4 tracking-header">
            Available Components
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Navigation</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>TopNav (3 states)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Buttons</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>PrimaryButton</li>
                <li>SecondaryButton</li>
                <li>IconButton (3 variants, 3 sizes)</li>
                <li>TextButton</li>
                <li>ButtonLockup</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Cards</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>TemplateCard</li>
                <li>TemplateCardLoggedIn</li>
                <li>TemplateCardLoggedOut</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Modals</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Modal (base)</li>
                <li>SignInModal</li>
                <li>SignUpModal</li>
                <li>AuthModal</li>
                <li>FindTemplatesModal</li>
                <li>IntegrationsModal</li>
                <li>TemplateDetailModal</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ComponentShowcase;
