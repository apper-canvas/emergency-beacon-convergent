import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import { cn } from '@/utils/cn';

const TemplateCard = ({ template, onSelect, selected = false, className }) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(template);
    }
  };

  const formatPrice = (price) => {
    if (price === 0 || price === '0') return 'Free';
    return `$${price}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      portfolio: 'bg-blue-100 text-blue-800',
      business: 'bg-green-100 text-green-800', 
      personal: 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const renderPreviewImage = () => {
    if (template.preview_image_c && Array.isArray(template.preview_image_c) && template.preview_image_c.length > 0) {
      return (
        <img
          src={template.preview_image_c[0].Url || template.preview_image_c[0].url}
          alt={`${template.Name} preview`}
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
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer",
      selected && "ring-2 ring-blue-500 ring-offset-2",
      className
    )}>
      <div onClick={handleSelect}>
        {/* Preview Image */}
        <div className="relative">
          {renderPreviewImage()}
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-white text-gray-900 shadow-md">
              {formatPrice(template.price_c)}
            </Badge>
          </div>

          {/* Selected Indicator */}
          {selected && (
            <div className="absolute top-3 left-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                <ApperIcon name="Check" size={16} className="text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
              {template.Name}
            </h3>
          </div>

          {/* Category */}
          {template.category_c && (
            <div className="mb-3">
              <Badge className={getCategoryColor(template.category_c)}>
                {template.category_c.charAt(0).toUpperCase() + template.category_c.slice(1)}
              </Badge>
            </div>
          )}

          {/* Description */}
          {template.description_c && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {template.description_c}
            </p>
          )}

          {/* Select Button */}
          <Button 
            className="w-full"
            variant={selected ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
          >
            {selected ? (
              <>
                <ApperIcon name="Check" size={16} className="mr-2" />
                Selected
              </>
            ) : (
              <>
                <ApperIcon name="Eye" size={16} className="mr-2" />
                Select Template
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TemplateCard;