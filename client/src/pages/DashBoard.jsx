import React from 'react';
import { FileText, ImageIcon, Scissors, ArrowRight, CheckCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const DashBoard = () => {
  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-800'>Welcome to Quick.ai</h1>
        <p className='text-gray-600'>Start creating amazing content with our AI-powered tools</p>
      </div>

      {/* Content Creation Guide */}
      <div className='mt-8'>
        <h2 className='text-xl font-bold text-gray-800 mb-6'>How to Create Amazing Content</h2>
        
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Write Article Guide */}
          <div className='bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow'>
            <div className='bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4'>
              <FileText className='w-6 h-6 text-blue-600' />
            </div>
            <h3 className='font-semibold text-lg mb-2'>Write Articles</h3>
            <p className='text-gray-600 mb-4'>Create engaging blog posts with our AI-powered writing assistant.</p>
            <NavLink 
              to='/ai/write-article'
              className='text-blue-600 hover:underline font-medium inline-flex items-center'
            >
              Start Writing <ArrowRight className='w-4 h-4 ml-1' />
            </NavLink>
          </div>

          {/* Generate Images Guide */}
          <div className='bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow'>
            <div className='bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4'>
              <ImageIcon className='w-6 h-6 text-purple-600' />
            </div>
            <h3 className='font-semibold text-lg mb-2'>Generate Images</h3>
            <p className='text-gray-600 mb-4'>Turn your ideas into stunning visuals with AI image generation.</p>
            <NavLink 
              to='/ai/generate-images'
              className='text-blue-600 hover:underline font-medium inline-flex items-center'
            >
              Create Images <ArrowRight className='w-4 h-4 ml-1' />
            </NavLink>
          </div>

          {/* Edit Images Guide */}
          <div className='bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow'>
            <div className='bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4'>
              <Scissors className='w-6 h-6 text-green-600' />
            </div>
            <h3 className='font-semibold text-lg mb-2'>Edit Images</h3>
            <p className='text-gray-600 mb-4'>Remove backgrounds or objects from your images with AI.</p>
            <div className='space-y-2'>
              <NavLink 
                to='/ai/remove-background'
                className='text-blue-600 hover:underline font-medium block text-sm'
              >
                Remove Background <ArrowRight className='w-3 h-3 inline ml-1' />
              </NavLink>
              <NavLink 
                to='/ai/remove-object'
                className='text-blue-600 hover:underline font-medium block text-sm'
              >
                Remove Objects <ArrowRight className='w-3 h-3 inline ml-1' />
              </NavLink>
            </div>
          </div>
        </div>

        {/* Quick Tips Section */}
        <div className='mt-12 bg-blue-50 p-6 rounded-xl'>
          <h3 className='font-semibold text-lg text-gray-800 mb-4'>Quick Tips</h3>
          <ul className='space-y-3 text-gray-700'>
            <li className='flex items-start'>
              <CheckCircle className='w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
              <span>Be specific in your prompts for better results</span>
            </li>
            <li className='flex items-start'>
              <CheckCircle className='w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
              <span>Use high-quality images for best editing results</span>
            </li>
            <li className='flex items-start'>
              <CheckCircle className='w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
              <span>Save your favorite creations to your dashboard</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;