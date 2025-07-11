import React from 'react'
import MDEditor from '@uiw/react-md-editor';
import { Copy, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface props{
  aiOutput:string;
}

function OutputSection({aiOutput}:props) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(aiOutput);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className='bg-[#18181b] text-white shadow-lg border border-gray-600 rounded-lg'>
      <div className='flex justify-between items-center p-5'>
        <h2 className='font-medium text-lg'>Your Result</h2>
        {aiOutput && (
          <Button 
            className='flex gap-2'
            onClick={handleCopy}
          >
            <Copy className='w-4 h-4'/> Copy 
          </Button>
        )}
      </div>
      <div data-color-mode="dark" className='p-4'>
        {aiOutput ? (
          <MDEditor.Markdown 
            source={aiOutput} 
            style={{ 
              backgroundColor: 'transparent',
              color: 'white',
              height: '600px',
              overflow: 'auto'
            }}
          />
        ) : (
          <div className='flex flex-col items-center justify-center h-[600px] text-gray-400'>
            <FileText className='w-16 h-16 mb-4 opacity-50' />
            <h3 className='text-xl font-medium mb-2'>No Content Generated Yet</h3>
            <p className='text-sm text-center max-w-md'>
              Fill out the form on the left and click "Generate Content" to create your AI-powered content.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OutputSection