import React, { useState } from 'react'
import { TEMPLATE } from './TemplateListSection'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2Icon } from 'lucide-react'

// [#1d2a53] gray color
function TemplateCard(item:TEMPLATE) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  // If the template is the bulk caption generator, link to the new page
  const isBulk = item?.slug === 'bulk-caption-generator';
  const href = isBulk ? '/dashboard/content/bulk-caption-generator' : '/dashboard/content/' + item?.slug;

  return (
    <Link href={href} onClick={handleClick}>
      <div className='p-5 shadow-lg border border-purple-700 rounded-2xl bg-gradient-to-br from-[#1e1e1f] via-[#23233a] to-black text-white flex flex-col gap-3 cursor-pointer h-full hover:scale-105 transition-all hover:bg-gradient-to-tr hover:from-purple-900 hover:to-black hover:border-pink-500 hover:shadow-pink-500/30 relative'>
        {isLoading && (
          <div className='absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl z-10'>
            <Loader2Icon className='w-6 h-6 animate-spin text-white' />
          </div>
        )}
        <Image src={item.icon} width={40} height={40} alt='icon' />
        <h2 className='font-bold text-xl'>{item.name}</h2>
        <p className='text-gray-300 text-sm'>{item.desc}</p>
      </div>
    </Link>
  );
}

export default TemplateCard