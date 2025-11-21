import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import WorkItemCard from '@/components/molecules/WorkItemCard';
import WorkItemForm from '@/components/molecules/WorkItemForm';
import { portfolioWorkItemService } from '@/services/api/portfolioWorkItemService';
import { toast } from 'react-toastify';

const WorkItems = () => {
  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadWorkItems();
  }, []);

  const loadWorkItems = async () => {
    setLoading(true);
    try {
      const data = await portfolioWorkItemService.getAll();
      setWorkItems(data);
    } catch (error) {
      console.error('Error loading work items:', error);
      toast.error('Failed to load work items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteItem = async (item) => {
    if (!confirm(`Are you sure you want to delete "${item.title_c || item.Name}"?`)) {
      return;
    }

    try {
      const success = await portfolioWorkItemService.delete(item.Id);
      if (success) {
        setWorkItems(prev => prev.filter(w => w.Id !== item.Id));
        toast.success('Work item deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting work item:', error);
      toast.error('Failed to delete work item');
    }
  };

  const handleFormSubmit = async (formData) => {
    setSaving(true);
    try {
      let result;
      
      if (editingItem) {
        // Update existing item
        result = await portfolioWorkItemService.update(editingItem.Id, formData);
        if (result) {
          setWorkItems(prev => prev.map(item => 
            item.Id === editingItem.Id ? result : item
          ));
        }
      } else {
        // Create new item
        result = await portfolioWorkItemService.create(formData);
        if (result) {
          setWorkItems(prev => [result, ...prev]);
        }
      }

      if (result) {
        setShowForm(false);
        setEditingItem(null);
        toast.success(`Work item ${editingItem ? 'updated' : 'created'} successfully!`);
      }
    } catch (error) {
      console.error('Error saving work item:', error);
      toast.error('Failed to save work item');
    } finally {
      setSaving(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <WorkItemForm
          workItem={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={saving}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Work Items</h1>
          <p className="text-gray-600">
            Showcase your projects, achievements, and portfolio pieces.
          </p>
        </div>
        <Button onClick={handleAddItem}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Work Item
        </Button>
      </div>

      {/* Work Items Grid */}
      {workItems.length === 0 ? (
        <Empty
          icon="Briefcase"
          title="No work items yet"
          description="Start building your portfolio by adding your first work item. Showcase your projects, skills, and achievements."
          action={
            <Button onClick={handleAddItem}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Your First Work Item
            </Button>
          }
        />
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              {workItems.length} work item{workItems.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workItems.map(item => (
              <WorkItemCard
                key={item.Id}
                workItem={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkItems;