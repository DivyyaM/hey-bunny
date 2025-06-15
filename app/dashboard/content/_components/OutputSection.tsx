import React from 'react'
import MDEditor from '@uiw/react-md-editor';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface props{
  aiOutput:string;
}

function OutputSection({aiOutput}:props) {
  return (
    <div className='bg-black text-white shadow-lg border border-gray-600 rounded-lg'>
      <div className='flex justify-between items-center p-5'>
        <h2 className='font-medium text-lg'>Your Result</h2>
        <Button className='flex gap-2'
        onClick={()=>navigator.clipboard.writeText(aiOutput)}
        ><Copy className='w-4 h-4'/> Copy </Button>
      </div>
      <div data-color-mode="dark" className='p-4'>
        <MDEditor.Markdown 
          source={aiOutput} 
          style={{ 
            backgroundColor: 'transparent',
            color: 'white',
            height: '600px',
            overflow: 'auto'
          }}
        />
      </div>
    </div>
  )
}

export default OutputSection