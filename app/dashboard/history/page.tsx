
import Templates from '@/app/(data)/Templates'
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { AIOutput } from '@/utils/schema'
import { currentUser } from '@clerk/nextjs/server'
import { desc, eq } from 'drizzle-orm'
import Image from 'next/image'
import React from 'react'
import { TEMPLATE } from '../_components/TemplateListSection'
import CopyButton from './_components/CopyButton'

export interface HISTORY{
    id:Number,
    formData:string,
    aiResponse:string,
    templateSlug:string,
    createdBy:string,
    createdAt:string
}
async function History() {
    
    const user=await currentUser();

    {/* @ts-ignore */}
    const HistoryList:HISTORY[]=await db.select().from(AIOutput).where(eq(AIOutput?.createdBy,user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(AIOutput.id))
    ;

    const GetTemplateName=(slug:string)=>{

        const template:TEMPLATE|any=Templates?.find((item)=>item.slug==slug)
        return template;
    }
  return (
    <div className='min-h-screen bg-[#18181b] flex flex-col items-center justify-start'>
      <div className='mx-auto max-w-6xl w-full mt-10 p-6 rounded-2xl bg-[#23233a] shadow-lg border border-[#23233a]'>
        <h2 className='font-bold text-5xl text-white mb-2'>History</h2>
        <p className='text-gray-400 mb-6'>Search your previously generate AI content</p>
        <div className='grid grid-cols-7 font-bold bg-[#23233a] py-3 px-3 rounded-lg'>
          <h2 className='col-span-2'>TEMPLATE</h2>
          <h2 className='col-span-2'>AI RESP</h2>
          <h2>DATE</h2>
          <h2>WORDS</h2>
          <h2>COPY</h2>
        </div>
        <div className='divide-y divide-[#23233a]'>
          {HistoryList.map((item:HISTORY,index:number)=>(
            <div key={item.id as any} className='grid grid-cols-7 py-5 px-3 hover:bg-[#282846] transition rounded-lg'>
              <h2 className='col-span-2 flex gap-2 items-center text-white text-2xl'>
                <Image src={GetTemplateName(item?.templateSlug)?.icon} width={25} height={25} alt='icon' />
                {GetTemplateName(item.templateSlug)?.name}
              </h2>
              <h2 className='col-span-2 line-clamp-3 mr-3 text-white'>{item?.aiResponse}</h2>
              <h2 className='text-white'>{item.createdAt}</h2>
              <h2 className='text-white'>{item?.aiResponse.length}</h2>
              <h2>
                <CopyButton aiResponse={item.aiResponse} />
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default History