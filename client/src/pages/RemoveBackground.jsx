import { Eraser, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [input, setInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState('');

  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) {
      toast.error('Please select an image first');
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      
      const formData = new FormData();
      formData.append('image', input);

      const { data } = await axios.post(
        '/api/ai/remove-image-background',
        formData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (data.success) {
        setContent(data.content);
        toast.success('Background removed successfully!');
      } else {
        toast.error(data.message || 'Failed to process image');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-full overflow-y-scroll flex p-6 items-start flex-wrap gap-4 text-slate-700'>
      {/* left col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg bg-white p-4 rounded-lg border border-gray-200'> 
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#FF4938]'/>
          <h1 className='text-xl font-semibold'>Background Remove</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Upload Image</p>
        <input 
          onChange={handleFileChange} 
          type="file" 
          accept='image/*' 
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600' 
          required
        />
       
        <p className='text-xs text-gray-500 font-light mt-1'>Supports JPG, PNG, and other image formats</p>
        
        <button 
          type="submit"
          disabled={loading} 
          className='w-full justify-center flex items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 border-2 rounded-full border-t-transparent border-white animate-spin' />
          ) : (
            <Eraser className='w-5' />
          )}
          <span>Remove Background</span>
        </button>
      </form>
      
      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
          <Eraser className='w-5 h-5 text-[#FF4938]'/>
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>
        <div className='flex flex-1 justify-center items-center min-h-[300px]'>
          {content ? (
            <img 
              src={content} 
              alt="Processed" 
              className='max-w-full max-h-[400px] object-contain' 
            />
          ) : preview ? (
            <div className='relative'>
              <img 
                src={preview} 
                alt="Preview" 
                className='max-w-full max-h-[400px] object-contain opacity-50' 
              />
              <div className='absolute inset-0 flex items-center justify-center'>
                <p className='text-sm text-gray-500 bg-white/80 px-3 py-1 rounded-full'>
                  Click "Remove Background" to process
                </p>
              </div>
            </div>
          ) : (
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Eraser className='w-9 h-9'/>
              <p>Upload an image and click "Remove Background" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;