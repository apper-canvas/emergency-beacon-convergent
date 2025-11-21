import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import { userProfileService } from '@/services/api/userProfileService';
import { portfolioWorkItemService } from '@/services/api/portfolioWorkItemService';

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [workItems, setWorkItems] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProfile: false,
    selectedTemplate: false
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load user profile
      const profile = await userProfileService.getCurrentUserProfile();
      setUserProfile(profile);

      // Load work items
      const items = await portfolioWorkItemService.getAll();
      setWorkItems(items);

      // Calculate stats
      setStats({
        totalProjects: items.length,
        completedProfile: !!profile,
        selectedTemplate: false // TODO: Add template selection tracking
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const quickActions = [
    {
      title: 'Complete Profile',
      description: 'Finish setting up your professional profile',
      icon: 'User',
      color: 'blue',
      action: () => navigate('/profile'),
      completed: stats.completedProfile
    },
    {
      title: 'Choose Template',
      description: 'Select a template for your portfolio',
      icon: 'Layout',
      color: 'purple',
      action: () => navigate('/templates'),
      completed: stats.selectedTemplate
    },
    {
      title: 'Add Work Items',
      description: 'Showcase your projects and work',
      icon: 'Plus',
      color: 'green',
      action: () => navigate('/work-items'),
      completed: stats.totalProjects > 0
    }
  ];

  const getActionColor = (color, completed) => {
    const baseColors = {
      blue: completed ? 'bg-blue-100 text-blue-800' : 'bg-blue-50 text-blue-600',
      purple: completed ? 'bg-purple-100 text-purple-800' : 'bg-purple-50 text-purple-600',
      green: completed ? 'bg-green-100 text-green-800' : 'bg-green-50 text-green-600'
    };
    return baseColors[color] || baseColors.blue;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
        </h1>
        <p className="text-gray-600">
          Let's continue building your amazing portfolio.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Briefcase" size={24} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profile Status</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.completedProfile ? 'Complete' : 'Incomplete'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              stats.completedProfile ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <ApperIcon 
                name={stats.completedProfile ? 'CheckCircle' : 'AlertCircle'} 
                size={24} 
                className={stats.completedProfile ? 'text-green-600' : 'text-yellow-600'} 
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Template</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.selectedTemplate ? 'Selected' : 'Pending'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              stats.selectedTemplate ? 'bg-purple-100' : 'bg-gray-100'
            }`}>
              <ApperIcon 
                name="Layout" 
                size={24} 
                className={stats.selectedTemplate ? 'text-purple-600' : 'text-gray-600'} 
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg cursor-pointer transition-colors hover:bg-opacity-80 ${
                getActionColor(action.color, action.completed)
              }`}
              onClick={action.action}
            >
              <div className="flex items-start gap-3">
                <ApperIcon name={action.icon} size={20} />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{action.title}</h3>
                    {action.completed && (
                      <ApperIcon name="Check" size={16} className="text-green-600" />
                    )}
                  </div>
                  <p className="text-sm opacity-80 mt-1">{action.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Work Items */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Work Items</h2>
          <Link to="/work-items">
            <Button variant="outline" size="sm">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Work Item
            </Button>
          </Link>
        </div>

        {workItems.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Briefcase" size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No work items yet</h3>
            <p className="text-gray-600 mb-6">
              Start building your portfolio by adding your first work item.
            </p>
            <Link to="/work-items">
              <Button>
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Your First Work Item
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workItems.slice(0, 6).map((item) => (
              <div key={item.Id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-gray-900 mb-2">
                  {item.title_c || item.Name}
                </h4>
                {item.description_c && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description_c}
                  </p>
                )}
                {item.website_url_c && (
                  <a
                    href={item.website_url_c}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <ApperIcon name="ExternalLink" size={14} className="mr-1" />
                    View Project
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {workItems.length > 6 && (
          <div className="text-center mt-6">
            <Link to="/work-items">
              <Button variant="outline">
                View All Work Items ({workItems.length})
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;