import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import ProfileWizard from '@/components/molecules/ProfileWizard';
import { userProfileService } from '@/services/api/userProfileService';
import { toast } from 'react-toastify';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const profile = await userProfileService.getCurrentUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileComplete = async (profileData) => {
    setSaving(true);
    try {
      let result;
      
      if (userProfile) {
        // Update existing profile
        result = await userProfileService.update(userProfile.Id, profileData);
      } else {
        // Create new profile
        result = await userProfileService.create(profileData);
      }

      if (result) {
        setUserProfile(result);
        toast.success('Profile saved successfully!');
        // Navigate to dashboard or templates
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <ApperIcon name="User" size={24} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {userProfile ? 'Update Your Profile' : 'Create Your Profile'}
          </h1>
          <p className="text-gray-600">
            {userProfile 
              ? 'Keep your information up to date to make a great impression.'
              : 'Tell us about yourself to create a personalized portfolio experience.'
            }
          </p>
        </div>

        {/* Profile Wizard */}
        <ProfileWizard
          initialData={userProfile}
          onComplete={handleProfileComplete}
          loading={saving}
        />
      </div>
    </div>
  );
};

export default Profile;