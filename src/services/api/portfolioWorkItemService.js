import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

export const portfolioWorkItemService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "website_url_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "portfolio_id_c"}}
        ],
        orderBy: [{
          "fieldName": "CreatedOn",
          "sorttype": "DESC"
        }]
      };

      const response = await apperClient.fetchRecords('portfolio_work_items_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching work items:', error?.response?.data?.message || error);
      toast.error('Failed to load work items');
      return [];
    }
  },

  async create(workItemData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        records: [{
          Name: workItemData.Name || workItemData.title_c,
          title_c: workItemData.title_c,
          description_c: workItemData.description_c,
          website_url_c: workItemData.website_url_c,
          image_c: workItemData.image_c,
          portfolio_id_c: workItemData.portfolio_id_c ? parseInt(workItemData.portfolio_id_c) : undefined
        }]
      };

      const response = await apperClient.createRecord('portfolio_work_items_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} work item records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Work item created successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating work item:', error?.response?.data?.message || error);
      toast.error('Failed to create work item');
      return null;
    }
  },

  async update(id, workItemData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        records: [{
          Id: parseInt(id),
          Name: workItemData.Name || workItemData.title_c,
          title_c: workItemData.title_c,
          description_c: workItemData.description_c,
          website_url_c: workItemData.website_url_c,
          image_c: workItemData.image_c,
          portfolio_id_c: workItemData.portfolio_id_c ? parseInt(workItemData.portfolio_id_c) : undefined
        }]
      };

      const response = await apperClient.updateRecord('portfolio_work_items_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} work item records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Work item updated successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error updating work item:', error?.response?.data?.message || error);
      toast.error('Failed to update work item');
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('portfolio_work_items_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} work item records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Work item deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting work item:', error?.response?.data?.message || error);
      toast.error('Failed to delete work item');
      return false;
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "website_url_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "portfolio_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById('portfolio_work_items_c', id, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching work item ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }
};