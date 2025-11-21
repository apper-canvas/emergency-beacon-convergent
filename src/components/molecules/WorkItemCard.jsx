import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import { cn } from '@/utils/cn';

const WorkItemCard = ({ workItem, onEdit, onDelete, className }) => {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(workItem);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(workItem);
    }
  };

  const renderImage = () => {
    if (workItem.image_c && Array.isArray(workItem.image_c) && workItem.image_c.length > 0) {
      return (
        <img
          src={workItem.image_c[0].Url || workItem.image_c[0].url}
          alt={workItem.title_c}
          className="w-full h-48 object-cover"
        />
      );
    }
    
    return (
      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <ApperIcon name="Image" size={48} className="text-gray-400" />
      </div>
    );
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Image */}
      <div className="relative">
        {renderImage()}
        
        {/* Actions */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleEdit}
            className="bg-white/90 backdrop-blur-sm"
          >
            <ApperIcon name="Edit" size={14} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDelete}
            className="bg-white/90 backdrop-blur-sm text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" size={14} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-2">
          {workItem.title_c || workItem.Name}
        </h3>

        {workItem.description_c && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {workItem.description_c}
          </p>
        )}

        {/* Website Link */}
        {workItem.website_url_c && (
          <div className="flex items-center gap-2 mb-3">
            <ApperIcon name="ExternalLink" size={16} className="text-gray-400" />
            <a
              href={workItem.website_url_c}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm truncate"
            >
              View Live Project
            </a>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          <Button
            size="sm"
            variant="outline"
            onClick={handleEdit}
            className="flex-1"
          >
            <ApperIcon name="Edit" size={14} className="mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" size={14} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default WorkItemCard;