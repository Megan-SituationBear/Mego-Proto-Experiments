import React from 'react';
import Modal from './Modal';
import { PrimaryButton, SecondaryButton } from './index';

interface Integration {
  name: string;
  icon: string;
  description: string;
}

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect?: () => void;
  integrations?: Integration[];
  className?: string;
}

const defaultIntegrations: Integration[] = [
  { name: 'Slack', icon: '💬', description: 'Connect your Slack workspace' },
  { name: 'Confluence', icon: '📚', description: 'Link knowledge base' },
  { name: 'Jira', icon: '🎫', description: 'Sync with project management' },
  { name: 'Github', icon: '🐙', description: 'Access repositories' }
];

const IntegrationsModal: React.FC<IntegrationsModalProps> = ({
  isOpen,
  onClose,
  onConnect,
  integrations = defaultIntegrations,
  className = "",
}) => {
  const handleConnect = () => {
    if (onConnect) {
      onConnect();
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Integrations"
      className={className}
    >
      <div className="flex flex-col gap-6">
        {/* Body text section */}
        <div className="flex flex-col justify-start items-start gap-2">
          <p className="text-sm font-medium text-left text-slate-600 w-full">
            Choose the integrations you want to connect to enhance your workspace.
          </p>
        </div>

        {/* Integrations grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{integration.name}</h3>
                  <p className="text-sm text-[#45556c]">{integration.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Buttons section */}
        <div className="flex justify-center items-center gap-4">
          <SecondaryButton
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            onClick={handleConnect}
            className="flex-1"
          >
            Connect
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default IntegrationsModal;
