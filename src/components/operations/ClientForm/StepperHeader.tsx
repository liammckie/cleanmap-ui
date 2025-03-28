
import React from 'react';

interface StepperHeaderProps {
  currentStep: number;
  steps: {
    CLIENT_DETAILS: number;
    SITES: number;
    REVIEW: number;
  };
}

const StepperHeader: React.FC<StepperHeaderProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex mb-6">
      <div className={`flex-1 text-center relative ${currentStep >= steps.CLIENT_DETAILS ? 'text-primary' : 'text-muted-foreground'}`}>
        <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${currentStep >= steps.CLIENT_DETAILS ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
          1
        </div>
        <div className="text-xs">Client Details</div>
        <div className="absolute top-4 left-1/2 w-full h-0.5 bg-muted -z-10" />
      </div>
      
      <div className={`flex-1 text-center relative ${currentStep >= steps.SITES ? 'text-primary' : 'text-muted-foreground'}`}>
        <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${currentStep >= steps.SITES ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
          2
        </div>
        <div className="text-xs">Add Sites</div>
        <div className="absolute top-4 left-1/2 w-full h-0.5 bg-muted -z-10" />
      </div>
      
      <div className={`flex-1 text-center ${currentStep >= steps.REVIEW ? 'text-primary' : 'text-muted-foreground'}`}>
        <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${currentStep >= steps.REVIEW ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
          3
        </div>
        <div className="text-xs">Review</div>
      </div>
    </div>
  );
};

export default StepperHeader;
