import { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
// Import Lottie when you add the animation file
// import Lottie from 'lottie-react';
// import animationData from './path-to-your-lottie-animation.json';

interface BuildingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const BuildingModal: React.FC<BuildingModalProps> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Matching templates...',
    'Configuring agents...',
    'Setting up your workspace...',
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    // Cycle through steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000); // Change text every 1 second

    // Complete after 3 seconds
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(completeTimeout);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <DialogBackdrop
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-white rounded-2xl p-12 shadow-2xl max-w-md w-full">
          {/* Lottie Animation Container */}
          <div className="flex justify-center mb-8">
            {/* TODO: Add your Lottie animation here */}
            {/* <Lottie 
              animationData={animationData}
              loop={true}
              className="w-32 h-32"
            /> */}
            
            {/* Placeholder: Animated Cubes (CSS) */}
            <div className="w-32 h-32 flex items-center justify-center">
              <div className="relative">
                <div className="absolute animate-ping w-16 h-16 bg-blue-400 rounded-lg opacity-20"></div>
                <div className="relative w-16 h-16 bg-blue-600 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Building Text */}
          <h2 className="text-2xl font-semibold text-center text-slate-900 mb-3">
            Building Your Copado
          </h2>

          {/* Animated Status Text */}
          <div className="text-center min-h-[24px]">
            <p 
              key={currentStep}
              className="text-sm text-slate-600 animate-fade-in"
            >
              {steps[currentStep]}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? 'w-8 bg-blue-600' 
                    : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>
        </DialogPanel>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </Dialog>
  );
};

export default BuildingModal;
