import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

export const templateService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "preview_image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "price_c"}}
        ],
        orderBy: [{
          "fieldName": "Name",
          "sorttype": "ASC"
        }]
      };

      const response = await apperClient.fetchRecords('templates_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching templates:', error?.response?.data?.message || error);
      toast.error('Failed to load templates');
      return [];
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
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "preview_image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "price_c"}}
        ]
      };

      const response = await apperClient.getRecordById('templates_c', id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching template ${id}:`, error?.response?.data?.message || error);
      toast.error('Failed to load template');
      return null;
    }
  },

  async getByCategory(category) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "preview_image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "price_c"}}
        ],
        where: [{
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [category]
        }],
        orderBy: [{
          "fieldName": "Name",
          "sorttype": "ASC"
        }]
      };

      const response = await apperClient.fetchRecords('templates_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching templates by category:', error?.response?.data?.message || error);
      toast.error('Failed to load templates');
      return [];
    }
  }
};