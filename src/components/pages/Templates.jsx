import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import TemplateCard from '@/components/molecules/TemplateCard';
import { templateService } from '@/services/api/templateService';
import { toast } from 'react-toastify';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const categories = [
    { value: 'all', label: 'All Templates', icon: 'Grid' },
    { value: 'portfolio', label: 'Portfolio', icon: 'Briefcase' },
    { value: 'business', label: 'Business', icon: 'Building' },
    { value: 'personal', label: 'Personal', icon: 'User' }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchTerm, selectedCategory]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await templateService.getAll();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => 
        template.category_c === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(template =>
        template.Name.toLowerCase().includes(term) ||
        template.description_c?.toLowerCase().includes(term)
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    toast.success(`Template "${template.Name}" selected!`);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      // TODO: Implement template usage logic
      toast.success(`Using template: ${selectedTemplate.Name}`);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Template</h1>
        <p className="text-gray-600">
          Select a professional template that best represents your style and work.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name="Search" size={20} className="text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="flex items-center gap-2"
            >
              <ApperIcon name={category.icon} size={16} />
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Counter */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
        </p>
        
        {selectedTemplate && (
          <Button onClick={handleUseTemplate} className="flex items-center gap-2">
            <ApperIcon name="Check" size={16} />
            Use "{selectedTemplate.Name}"
          </Button>
        )}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Empty
          icon="Layout"
          title="No templates found"
          description={
            searchTerm || selectedCategory !== 'all'
              ? "Try adjusting your search or filter criteria."
              : "No templates are available at the moment."
          }
          action={
            searchTerm || selectedCategory !== 'all' ? (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.Id}
              template={template}
              selected={selectedTemplate?.Id === template.Id}
              onSelect={handleTemplateSelect}
            />
          ))}
        </div>
      )}

      {/* Selected Template Actions */}
      {selectedTemplate && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Check" size={20} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{selectedTemplate.Name}</h4>
                <p className="text-sm text-gray-600">Template selected</p>
              </div>
            </div>
            <Button onClick={handleUseTemplate} className="w-full">
              <ApperIcon name="Rocket" size={16} className="mr-2" />
              Start Building
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;