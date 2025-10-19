import React from 'react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import IconButton from '../IconButton';
import TextButton from '../TextButton';
import ButtonLockup from '../ButtonLockup';
import { Plus, Heart, Settings, Download, Share2 } from 'lucide-react';

/**
 * Example demonstrating all button components
 */
const ButtonsExample: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      {/* Primary & Secondary Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Primary & Secondary Buttons</h3>
        <div className="flex flex-wrap gap-3">
          <PrimaryButton onClick={() => console.log('Primary clicked')}>
            Primary Button
          </PrimaryButton>
          <PrimaryButton disabled>
            Disabled Primary
          </PrimaryButton>
          <SecondaryButton onClick={() => console.log('Secondary clicked')}>
            Secondary Button
          </SecondaryButton>
          <SecondaryButton disabled>
            Disabled Secondary
          </SecondaryButton>
        </div>
      </div>

      {/* Icon Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Icon Buttons</h3>
        <div className="space-y-3">
          {/* Primary Icons */}
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

          {/* Secondary Icons */}
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
            <IconButton variant="secondary" size="md" rounded>
              <Heart className="w-5 h-5" />
            </IconButton>
          </div>

          {/* Ghost Icons */}
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
            <IconButton variant="ghost" size="md" rounded>
              <Share2 className="w-5 h-5" />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Text Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Text Buttons</h3>
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

      {/* Button Lockups */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Button Lockups</h3>
        
        <div className="space-y-4 max-w-md">
          <div>
            <p className="text-sm text-gray-600 mb-2">Horizontal (default):</p>
            <ButtonLockup
              primaryText="Get Started"
              secondaryText="Learn More"
              onPrimaryClick={() => console.log('Primary clicked')}
              onSecondaryClick={() => console.log('Secondary clicked')}
            />
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Vertical:</p>
            <ButtonLockup
              orientation="vertical"
              primaryText="Continue"
              secondaryText="Cancel"
              onPrimaryClick={() => console.log('Continue clicked')}
              onSecondaryClick={() => console.log('Cancel clicked')}
            />
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Common Use Cases</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <strong>Primary Button:</strong> Main actions (Submit, Create, Save)
          </div>
          <div>
            <strong>Secondary Button:</strong> Alternative actions (Cancel, Back)
          </div>
          <div>
            <strong>Icon Button (Primary):</strong> Quick actions in UI (Add, Favorite)
          </div>
          <div>
            <strong>Icon Button (Ghost):</strong> Toolbar actions, minimal UI impact
          </div>
          <div>
            <strong>Text Button:</strong> Tertiary actions, links (Learn More, View All)
          </div>
          <div>
            <strong>Button Lockup:</strong> Modal actions, form submissions
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonsExample;
