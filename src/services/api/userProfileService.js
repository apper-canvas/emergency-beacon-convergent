import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

export const userProfileService = {
  async create(profileData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        records: [{
          Name: profileData.name || profileData.firstName + ' ' + profileData.lastName,
          Tags: profileData.skills || '',
          ...profileData
        }]
      };

      const response = await apperClient.createRecord('user_profiles_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} profile records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Profile created successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating profile:', error?.response?.data?.message || error);
      toast.error('Failed to create profile');
      return null;
    }
  },

  async update(id, profileData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        records: [{
          Id: parseInt(id),
          Name: profileData.name || profileData.firstName + ' ' + profileData.lastName,
          Tags: profileData.skills || '',
          ...profileData
        }]
      };

      const response = await apperClient.updateRecord('user_profiles_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} profile records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Profile updated successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error updating profile:', error?.response?.data?.message || error);
      toast.error('Failed to update profile');
      return null;
    }
  },

  async getCurrentUserProfile() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}}
        ],
        orderBy: [{
          "fieldName": "CreatedOn",
          "sorttype": "DESC"
        }],
        pagingInfo: {
          "limit": 1,
          "offset": 0
        }
      };

      const response = await apperClient.fetchRecords('user_profiles_c', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('Error fetching user profile:', error?.response?.data?.message || error);
      return null;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}}
        ]
      };

      const response = await apperClient.getRecordById('user_profiles_c', id, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching profile ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }
};