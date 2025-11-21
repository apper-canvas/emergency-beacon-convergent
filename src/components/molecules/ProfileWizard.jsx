import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import { cn } from '@/utils/cn';

const ProfileWizard = ({ onComplete, loading }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    skills: '',
    website: '',
    location: '',
    jobTitle: '',
    company: ''
  });

  const steps = [
    {
      title: 'Personal Information',
      icon: 'User',
      fields: ['firstName', 'lastName', 'email', 'phone']
    },
    {
      title: 'Professional Details',
      icon: 'Briefcase', 
      fields: ['jobTitle', 'company', 'location', 'website']
    },
    {
      title: 'About & Skills',
      icon: 'FileText',
      fields: ['bio', 'skills']
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    const profileData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      skills: formData.skills,
      ...formData
    };
    onComplete(profileData);
  };

  const isStepValid = () => {
    const currentStepFields = steps[currentStep].fields;
    const requiredFields = ['firstName', 'lastName', 'email'];
    
    return currentStepFields.some(field => 
      requiredFields.includes(field) ? formData[field].trim() : true
    );
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    return (
      <div className="space-y-4">
        {step.fields.map(field => {
          const isTextarea = field === 'bio';
          const fieldLabels = {
            firstName: 'First Name *',
            lastName: 'Last Name *',
            email: 'Email *',
            phone: 'Phone Number',
            jobTitle: 'Job Title',
            company: 'Company',
            location: 'Location',
            website: 'Website URL',
            bio: 'Bio (Tell us about yourself)',
            skills: 'Skills (comma separated)'
          };

          const fieldPlaceholders = {
            firstName: 'Enter your first name',
            lastName: 'Enter your last name',
            email: 'Enter your email address',
            phone: 'Enter your phone number',
            jobTitle: 'e.g. Frontend Developer',
            company: 'e.g. Tech Company Inc.',
            location: 'e.g. New York, NY',
            website: 'e.g. https://yourwebsite.com',
            bio: 'Describe your background and experience...',
            skills: 'e.g. React, JavaScript, UI/UX Design'
          };

          return (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-2">
                {fieldLabels[field]}
              </label>
              {isTextarea ? (
                <textarea
                  id={field}
                  value={formData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  placeholder={fieldPlaceholders[field]}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <Input
                  id={field}
                  type={field === 'email' ? 'email' : field === 'website' ? 'url' : 'text'}
                  value={formData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  placeholder={fieldPlaceholders[field]}
                  className="w-full"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Profile</h2>
        <p className="text-gray-600">Let's get to know you better</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
              index <= currentStep 
                ? "border-blue-500 bg-blue-500 text-white" 
                : "border-gray-300 bg-gray-100 text-gray-500"
            )}>
              <ApperIcon name={step.icon} size={16} />
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-16 h-1 mx-2 transition-colors",
                index < currentStep ? "bg-blue-500" : "bg-gray-300"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step Title */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{steps[currentStep].title}</h3>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ApperIcon name="ChevronLeft" size={16} className="mr-2" />
          Previous
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          disabled={loading || !isStepValid()}
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
              Creating...
            </>
          ) : currentStep === steps.length - 1 ? (
            <>
              Complete Profile
              <ApperIcon name="Check" size={16} className="ml-2" />
            </>
          ) : (
            <>
              Next
              <ApperIcon name="ChevronRight" size={16} className="ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Step Indicator */}
      <div className="text-center mt-4 text-sm text-gray-500">
        Step {currentStep + 1} of {steps.length}
      </div>
    </Card>
  );
};

export default ProfileWizard;