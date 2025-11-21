import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import ApperFileFieldComponent from '@/components/atoms/FileUploader/ApperFileFieldComponent';

const WorkItemForm = ({ workItem, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title_c: '',
    description_c: '',
    website_url_c: '',
    image_c: []
  });

  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    if (workItem) {
      setFormData({
        title_c: workItem.title_c || '',
        description_c: workItem.description_c || '',
        website_url_c: workItem.website_url_c || '',
        image_c: workItem.image_c || []
      });
      setUploadedImages(workItem.image_c || []);
    }
  }, [workItem]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get files from the file uploader
      const { ApperFileUploader } = window.ApperSDK;
      const files = await ApperFileUploader.FileField.getFiles('image_c');
      
      const submitData = {
        ...formData,
        image_c: files || uploadedImages
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
      await onSubmit({
        ...formData,
        image_c: uploadedImages
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <ApperIcon name="Plus" size={20} className="text-gray-700" />
        <span className="font-semibold text-gray-900">
          {workItem ? 'Edit Work Item' : 'Add Work Item'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Project Title *
          </label>
          <Input
            id="title"
            type="text"
            value={formData.title_c}
            onChange={(e) => handleInputChange('title_c', e.target.value)}
            placeholder="Enter project title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description_c}
            onChange={(e) => handleInputChange('description_c', e.target.value)}
            placeholder="Describe your project..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Website URL */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
            Website/Live Demo URL
          </label>
          <Input
            id="website"
            type="url"
            value={formData.website_url_c}
            onChange={(e) => handleInputChange('website_url_c', e.target.value)}
            placeholder="https://your-project.com"
          />
        </div>

        {/* Images Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Images (optional) - up to 5 files
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <ApperFileFieldComponent
              elementId="image_c"
              config={{
                fieldName: 'image_c',
                fieldKey: 'image_c',
                tableName: 'portfolio_work_items_c',
                apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
                apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
                existingFiles: uploadedImages,
                fileCount: uploadedImages.length
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!formData.title_c.trim() || loading}
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                {workItem ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} className="mr-2" />
                {workItem ? 'Update Work Item' : 'Create Work Item'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default WorkItemForm;