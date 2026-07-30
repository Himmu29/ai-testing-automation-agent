import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { SettingsIcon } from 'lucide-react'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { TestCase } from './UserRepoList'
import axios from 'axios'

type props = {
    testCase?: TestCase,
    setReload:any
}

function TestCaseSettingDialog({testCase,setReload}:props) {

    const [formTestCase, setFormTestCase] = useState({
        title:testCase?.title || '',
        description:testCase?.description || '',
        targetRoute:testCase?.targetRoute || '',
        expectedResult:testCase?.expectedResult || ''
    });


    const handleInputChange = (fieldName:string,value:string)=>{
        setFormTestCase((prev)=>({
            ...prev,
            [fieldName]:value
        }))
    }

    const updateCase = async ()=>{
        const result = await axios.post('/api/test-cases/settings',{
            ...formTestCase,
            testCaseId: testCase?.id
        });
        console.log(result?.data);
        setReload();
    }


    return (
        <Dialog>
            <DialogTrigger>
                <Button size={'icon'} variant={'outline'} className="cursor-pointer">
                    <SettingsIcon className="h-4 w-4" />
                </Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Testing Requirements</DialogTitle>
                    <DialogDescription>
                        Modifying these parameters automatically clears pre-generated
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <div className='mt-1'>
                        <label className='text-gray-500'>Test Title</label>
                        <Input value={formTestCase?.title} className='mt-1' 
                        onChange={(event)=>handleInputChange('title',event?.target?.value)}
                        placeholder='Title' />
                    </div>

                    <div className='mt-5'>
                        <label className='text-gray-500'>Description/Action</label>
                        <Textarea value={formTestCase?.description} className='mt-1' 
                        onChange={(event)=>handleInputChange('description',event?.target?.value)}
                        placeholder='Description' />
                    </div>

                    <div className='mt-5'>
                        <label className='text-gray-500'>Target Route/Path</label>
                        <Input value={formTestCase?.targetRoute} className='mt-1' 
                        onChange={(event)=>handleInputChange('targetRoute',event?.target?.value)}
                        placeholder='Target Route' />
                    </div>

                    <div className='mt-5'>
                        <label className='text-gray-500'>Expected Result</label>
                        <Input value={formTestCase?.expectedResult} className='mt-1' 
                        onChange={(event)=>handleInputChange('expectedResult',event?.target?.value)}
                        placeholder='Expected Result' />
                    </div>

                    <DialogFooter className='mt-5'>
                        <DialogClose>
                            <Button variant={'outline'}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={updateCase} >Update Case</Button>
                    </DialogFooter>

                </div>
            </DialogContent>
        </Dialog>
    )
}

export default TestCaseSettingDialog