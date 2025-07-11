"use client"
import React, { useState } from 'react'
import { TEMPLATE } from '../../_components/TemplateListSection'
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';

interface PROPS {
    selectedTemplate?: TEMPLATE;
    userFormInput:any,
    loading:boolean
}

function FormSection({ selectedTemplate,userFormInput,loading }: PROPS) {

    const [formData,setFormData]=useState<any>({});
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

    const handleInputChange=(event:any)=>{
        const {name,value}=event.target;
        setFormData({...formData,[name]:value})
        
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({...prev, [name]: ''}));
        }
    }

    const validateForm = () => {
        const errors: {[key: string]: string} = {};
        
        if (!selectedTemplate?.form) return errors;
        
        selectedTemplate.form.forEach((field) => {
            if (field.required && (!formData[field.name] || formData[field.name].trim() === '')) {
                errors[field.name] = `${field.label} is required`;
            }
        });
        
        return errors;
    };

    const onSubmit=(e:any)=>{
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        if (!selectedTemplate) {
            console.error('No template selected');
            return;
        }
        userFormInput(formData);
    }

    if (!selectedTemplate) {
        return (
            <div className='p-5 text-white shadow-md border border-gray-600 rounded-lg bg-[#1e1e1f]'>
                <div className='text-center'>
                    <h2 className='font-bold text-2xl mb-2 text-red-400'>Template Not Found</h2>
                    <p className='text-white text-sm'>The selected template could not be loaded.</p>
                </div>
            </div>
        );
    }

    return (
        <div className='p-5 text-white shadow-md border border-gray-600 rounded-lg bg-[#1e1e1f] '>
            {/* @ts-ignore */}
            <Image src={selectedTemplate?.icon}
                alt='icon' width={70} height={70} />
            <h2 className='font-bold text-2xl mb-2 mt-4 text-primary'>{selectedTemplate?.name}</h2>
            <p className='text-white text-sm'>{selectedTemplate?.desc}</p>

            <form className='mt-6 text-white' onSubmit={onSubmit}>
                {selectedTemplate?.form?.map((item, index) => (
                    <div key={index} className='my-2 flex flex-col gap-2 mb-7'>
                        <label className='font-bold'>{item.label}</label>
                        {item.field == 'input' ?
                            <>
                                <Input 
                                    name={item.name} 
                                    required={item?.required}
                                    onChange={handleInputChange}
                                    className={formErrors[item.name] ? 'border-red-500' : ''}
                                />
                                {formErrors[item.name] && (
                                    <span className='text-red-400 text-sm'>{formErrors[item.name]}</span>
                                )}
                            </>
                            : item.field == 'textarea' ?
                            <>
                                <Textarea 
                                    name={item.name} 
                                    required={item?.required}
                                    className={`border border-gray-600 ${formErrors[item.name] ? 'border-red-500' : ''}`}
                                    rows={5}
                                    maxLength={2000}
                                    onChange={handleInputChange} 
                                /> 
                                <label className='text-xs text-white'>Note:Max 2000 Words</label>
                                {formErrors[item.name] && (
                                    <span className='text-red-400 text-sm'>{formErrors[item.name]}</span>
                                )}
                            </>    
                            : null
                        }
                    </div>
                ))}
                <Button 
                    type="submit" 
                    className='w-full py-6'
                    disabled={loading}
                >
                    {loading && <Loader2Icon className='animate-spin mr-2'/>}
                    {loading ? 'Generating Content...' : 'Generate Content'}
                </Button>
            </form>
        </div>
    )
}

export default FormSection;