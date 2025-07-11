"use client"
import React, { useContext, useState, useEffect } from 'react'
import FormSection from '../_components/FormSection'
import OutputSection from '../_components/OutputSection'
import { TEMPLATE } from '../../_components/TemplateListSection'
import Templates from '@/app/(data)/Templates'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { chatSession } from '@/utils/AiModal'
import { db } from '@/utils/db'
import { AIOutput } from '@/utils/schema'
import PostGenerator from '@/app/post-generator/page'
import moment from 'moment'
import { TotalUsageContext } from '@/app/(context)/TotalUsageContext'
import { useRouter } from 'next/navigation'
import { UserSubscriptionContext } from '@/app/(context)/UserSubscriptionContext'
import { UpdateCreditUsageContext } from '@/app/(context)/UpdateCreditUsageContext'
import { useUser } from '@clerk/nextjs'

interface PROPS {
    params: {
        'template-slug': string
    }
}

function CreateNewContent(props: PROPS) {
    // Use 'any' type for selectedTemplate to avoid linter error from incomplete template objects
    const selectedTemplate: any = Templates?.find((item) => item.slug === props.params['template-slug']);
    const [loading, setLoading] = useState(false);
    const [isPost, setIsPost] = useState<string>('');
    const [aiOutput, setAiOutput] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { user } = useUser();
    const router = useRouter();
    const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);
    const { userSubscription, setUserSubscription } = useContext(UserSubscriptionContext);
    const { updateCreditUsage, setUpdateCreditUsage } = useContext(UpdateCreditUsageContext);

    // Set isPost if the template is post-generator
    useEffect(() => {
        if (selectedTemplate?.slug === 'post-generator' && isPost != 'post-generator') setIsPost('post-generator');
    }, [selectedTemplate, isPost]);

    const GenerateAIContent = async (formData: any) => {
        try {
            if (!process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY) {
                throw new Error('Google Gemini API key is not configured');
            }
            if (totalUsage >= 10000 && !userSubscription) {
                router.push('/dashboard/billing');
                return;
            }
            setLoading(true);
            setError('');
            const SelectedPrompt = selectedTemplate?.aiPrompt;
            const FinalAIPrompt = JSON.stringify(formData) + ", " + SelectedPrompt;
            const result = await chatSession.sendMessage(FinalAIPrompt);
            if (!result || !result.response) {
                throw new Error('No response received from AI service');
            }
            const responseText = result.response.text();
            setAiOutput(responseText);
            try {
                await SaveInDb(JSON.stringify(formData), selectedTemplate?.slug, responseText);
            } catch (dbError) {
                console.error('Database save failed:', dbError);
            }
            setUpdateCreditUsage(Date.now());
        } catch (err: any) {
            console.error('Error in GenerateAIContent:', err);
            setError(err.message || 'An error occurred while generating content');
        } finally {
            setLoading(false);
        }
    }

    const SaveInDb = async (formData: any, slug: any, aiResp: string) => {
        try {
            if (!process.env.NEXT_PUBLIC_DRIZZLE_DB_URL) {
                throw new Error('Database URL is not configured');
            }
            
            const result = await db.insert(AIOutput).values({
                formData: formData,
                templateSlug: slug,
                aiResponse: aiResp,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD/MM/yyyy'),
            });

        } catch (err) {
            console.error('Database save error:', err);
            throw err;
        }
    }
    
    // Show error if template not found
    if (!selectedTemplate) {
        return (
            <div className='p-5 text-white'>
                <Link href={"/dashboard"}>
                    <Button> <ArrowLeft /> Back</Button>
                </Link>
                <div className='mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg'>
                    <h2 className='text-xl font-bold text-red-400'>Template Not Found</h2>
                    <p className='text-red-300'>The template "{props.params['template-slug']}" could not be found.</p>
                </div>
            </div>
        );
    }
    
    return (
        isPost == 'post-generator' ? (
            <PostGenerator />
        ) : (
            <div className='p-5'>
                <Link href={"/dashboard"}>
                    <Button> <ArrowLeft /> Back</Button>
                </Link>
                
                {error && (
                    <div className='mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg'>
                        <h2 className='text-xl font-bold text-red-400'>Error</h2>
                        <p className='text-red-300'>{error}</p>
                    </div>
                )}
                
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5 py-5 '>
                    {/* FormSection */}
                    <FormSection
                        selectedTemplate={selectedTemplate}
                        userFormInput={(v: any) => GenerateAIContent(v)}
                        loading={loading}
                    />
                    {/* OutputSection */}
                    <div className='col-span-2'>
                        <OutputSection aiOutput={aiOutput} />
                    </div>
                </div>
            </div>
        )
    );
}

export default CreateNewContent;
