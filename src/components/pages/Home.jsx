import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
              <ApperIcon name="Palette" size={32} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Build Your Perfect
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Portfolio
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create stunning portfolio websites with our easy-to-use wizard. Choose from professional templates, 
            showcase your work, and stand out from the crowd.
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button size="lg" className="min-w-[160px]">
                  <ApperIcon name="Rocket" size={20} className="mr-2" />
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="min-w-[160px]">
                  <ApperIcon name="LogIn" size={20} className="mr-2" />
                  Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/dashboard">
              <Button size="lg">
                <ApperIcon name="ArrowRight" size={20} className="mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6">
              <ApperIcon name="Wand2" size={24} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Wizard Setup</h3>
            <p className="text-gray-600">
              Step-by-step wizard guides you through creating your profile and portfolio in minutes.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-xl mb-6">
              <ApperIcon name="Layout" size={24} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Templates</h3>
            <p className="text-gray-600">
              Choose from carefully crafted templates designed to showcase your work beautifully.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-6">
              <ApperIcon name="Upload" size={24} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Rich Media Support</h3>
            <p className="text-gray-600">
              Upload images, attach links, and showcase your projects with rich media content.
            </p>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600 text-sm">Create your account to get started</p>
            </div>

            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Complete Profile</h3>
              <p className="text-gray-600 text-sm">Fill out your information using our guided wizard</p>
            </div>

            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose Template</h3>
              <p className="text-gray-600 text-sm">Select from our collection of professional templates</p>
            </div>

            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full font-bold text-lg mb-4">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Add Your Work</h3>
              <p className="text-gray-600 text-sm">Upload projects, images, and showcase your portfolio</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <Card className="p-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Build Your Portfolio?</h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of professionals who've created stunning portfolios with our platform.
            </p>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                <ApperIcon name="Sparkles" size={20} className="mr-2" />
                Start Building Now
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Home;