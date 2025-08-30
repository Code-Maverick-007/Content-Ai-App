import React, { useState } from 'react';
import { Edit, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: 'Short (500-800 words)' },
    { length: 1200, text: 'Medium (800-1200 words)' },
    { length: 2000, text: 'Long (1200+ words)' },
  ];

  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [input, setInput] = useState('');
  const [selectedLength, setSelectedLength] = useState(articleLength[0]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    try {
      setLoading(true);
      const prompt = `Write an article about ${input} in ${selectedLength.text}`;
      const token = await getToken();

      const { data } = await axios.post(
        '/api/ai/generate-article', 
        { prompt, length: selectedLength.length },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (data.success) {
        setContent(data.content || data.content); 
      } else {
        toast.error(data.message || 'Failed to generate article');
      }
    } catch (error) {
      console.error('API Error:', error);
      toast.error(error.response?.data?.message || 'Failed to generate article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-full overflow-y-scroll flex p-6 items-start flex-wrap gap-4 text-slate-700'>
      {/* Left column - Form */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg bg-white p-4 rounded-lg border border-gray-200'> 
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]'/>
          <h1 className='text-xl font-semibold'>Article Configuration</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Article Topic</p>
        <input 
          onChange={(e) => setInput(e.target.value)} 
          value={input} 
          type="text" 
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' 
          placeholder='The future of artificial intelligence is...' 
          required
          disabled={loading}
        />
        <p className='mt-4 text-sm font-medium'>Article Length</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {articleLength.map((item, index) => (
            <span 
              onClick={() => !loading && setSelectedLength(item)} 
              key={index} 
              className={`text-sm px-4 py-1 border rounded-full cursor-pointer
                ${selectedLength.text === item.text ? 'bg-blue-50 text-blue-700' : 'text-gray-500 border-gray-300'}
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {item.text}
            </span>
          ))}
        </div>
        <button 
          type="submit"
          disabled={loading || !input.trim()}
          className={`w-full justify-center flex items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 
          text-sm rounded-lg ${loading || !input.trim() ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent border-white animate-spin' />
          ) : (
            <Edit className='w-5' />
          )}
          Generate Article
        </button>
      </form>
      
      {/* Right column - Preview */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[500px]'>
        <div className='flex items-center gap-3'>
          <Edit className='w-5 h-5 text-[#4A7AFF]'/>
          <h1 className='text-xl font-semibold'>Generated Article</h1>
        </div>
        {!content ? (
          <div className='flex flex-1 justify-center items-center min-h-[300px]'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Edit className='w-9 h-9'/>
              <p>Enter a topic and click "Generate article" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-auto text-slate-600 prose max-w-none">
            <div className='reset-tw'> 
            <ReactMarkdown>{content}</ReactMarkdown>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteArticle;