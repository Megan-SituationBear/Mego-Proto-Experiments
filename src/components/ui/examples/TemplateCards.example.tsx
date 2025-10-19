import React, { useState } from 'react';
import TemplateCardLoggedIn from '../TemplateCardLoggedIn';
import TemplateCardLoggedOut from '../TemplateCardLoggedOut';
import { Sparkles, Zap, Rocket } from 'lucide-react';

/**
 * Example demonstrating Template Card variants
 */
const TemplateCardsExample: React.FC = () => {
  const [favorited1, setFavorited1] = useState(false);
  const [bookmarked1, setBookmarked1] = useState(false);
  const [favorited2, setFavorited2] = useState(true);
  const [bookmarked2, setBookmarked2] = useState(false);

  return (
    <div className="space-y-8 p-6">
      {/* Logged In Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Template Cards - Logged In</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TemplateCardLoggedIn
            category="Automation"
            categoryColor="purple"
            savedHours={5}
            title="Automate Rollback & Co-Builds"
            description="Automatically rollback deployments and trigger co-builds when errors are detected in your pipeline."
            favorites={42}
            views={128}
            icon={<Sparkles className="w-5 h-5 text-purple-500" />}
            isFavorited={favorited1}
            isBookmarked={bookmarked1}
            onFavorite={() => setFavorited1(!favorited1)}
            onBookmark={() => setBookmarked1(!bookmarked1)}
            onShare={() => console.log('Share clicked')}
            onClick={() => console.log('Card clicked')}
          />

          <TemplateCardLoggedIn
            category="Workflow"
            categoryColor="blue"
            savedHours={3}
            title="Time-Saving Workflow To Automation"
            description="This saves time by automating repetitive tasks and streamlining your development workflow."
            favorites={38}
            views={95}
            icon={<Zap className="w-5 h-5 text-blue-500" />}
            isFavorited={favorited2}
            isBookmarked={bookmarked2}
            onFavorite={() => setFavorited2(!favorited2)}
            onBookmark={() => setBookmarked2(!bookmarked2)}
            onShare={() => console.log('Share clicked')}
            onClick={() => console.log('Card clicked')}
          />

          <TemplateCardLoggedIn
            category="Deployment"
            categoryColor="green"
            savedHours={8}
            title="Continuous Deployment Pipeline"
            description="Set up a complete CI/CD pipeline with automated testing and deployment to multiple environments."
            favorites={67}
            views={203}
            icon={<Rocket className="w-5 h-5 text-green-500" />}
            isFavorited={false}
            isBookmarked={false}
            onFavorite={() => console.log('Favorite clicked')}
            onBookmark={() => console.log('Bookmark clicked')}
            onShare={() => console.log('Share clicked')}
            onClick={() => console.log('Card clicked')}
          />
        </div>

        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
          <strong>Features:</strong> Hover to see quick actions (Bookmark, Share). Click heart to favorite. 
          Card changes color on hover to indicate it's clickable.
        </div>
      </div>

      {/* Logged Out Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Template Cards - Logged Out</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TemplateCardLoggedOut
            category="Automation"
            categoryColor="purple"
            savedHours={5}
            title="Automate Rollback & Co-Builds"
            description="Automatically rollback deployments and trigger co-builds when errors are detected in your pipeline."
            favorites={42}
            views={128}
            icon={<Sparkles className="w-5 h-5 text-purple-500" />}
            onSignIn={() => console.log('Sign In clicked')}
            onSignUp={() => console.log('Sign Up clicked')}
          />

          <TemplateCardLoggedOut
            category="Workflow"
            categoryColor="blue"
            savedHours={3}
            title="Time-Saving Workflow To Automation"
            description="This saves time by automating repetitive tasks and streamlining your development workflow."
            favorites={38}
            views={95}
            icon={<Zap className="w-5 h-5 text-blue-500" />}
            onSignIn={() => console.log('Sign In clicked')}
            onSignUp={() => console.log('Sign Up clicked')}
          />

          <TemplateCardLoggedOut
            category="Deployment"
            categoryColor="green"
            savedHours={8}
            title="Continuous Deployment Pipeline"
            description="Set up a complete CI/CD pipeline with automated testing and deployment to multiple environments."
            favorites={67}
            views={203}
            icon={<Rocket className="w-5 h-5 text-green-500" />}
            onSignIn={() => console.log('Sign In clicked')}
            onSignUp={() => console.log('Sign Up clicked')}
          />
        </div>

        <div className="text-sm text-gray-600 bg-amber-50 p-3 rounded">
          <strong>Features:</strong> Hover to reveal lock overlay with sign in/up options. 
          Prevents interaction while encouraging authentication.
        </div>
      </div>

      {/* Comparison */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">When to Use</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-copado-blue mb-2">TemplateCardLoggedIn</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>User is authenticated</li>
              <li>Full interaction enabled</li>
              <li>Quick actions on hover</li>
              <li>Favorite and bookmark functionality</li>
              <li>Social sharing enabled</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-amber-600 mb-2">TemplateCardLoggedOut</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>User is not authenticated</li>
              <li>Preview mode with lock overlay</li>
              <li>Encourages sign up/sign in</li>
              <li>Shows value before requiring auth</li>
              <li>Soft-gates premium content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCardsExample;
