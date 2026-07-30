import React, { useState } from 'react'
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
import { Button } from '../ui/button'
import { Settings2, Settings2Icon } from 'lucide-react'
import { Input } from '../ui/input'
import { UserRepo } from './WorkspaceBody'
import axios from 'axios'

type props = {
    repo:UserRepo
    setReload:()=>void
}

function RepoSettings({repo,setReload}:props) {

    const [isOpen, setIsOpen] = useState(false);

    const [repoSettings, setRepoSettings] = useState({
        targetDomain:repo.targetDomain,
        globalInstruction:repo.globalInstruction,
    })

    const handleSaveSettings = async ()=>{
        const result = await axios.post('/api/user-repo/settings',{
            repoId:repo?.repoId,
            targetDomain:repoSettings?.targetDomain,
            globalInstruction:repoSettings?.globalInstruction,
        });
        console.log(result?.data);
        setReload();
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open)=>setIsOpen(open)}>
            <DialogTrigger>
                <Button className='cursor-pointer'> <Settings2 className="h-4 w-4 mr-1"/> Project Config</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='flex gao-2 items-center'> <Settings2 className='text-primary' /> Project/Repo Settings</DialogTitle>
                    <DialogDescription>
                        Configure domain and other settings
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div>
                        <label className='text-gray-500'>APP URL/DEFAULT WEBSITE</label>
                        <Input value={repoSettings?.targetDomain}
                        onChange={(e)=>setRepoSettings({...repoSettings,targetDomain:e.target.value})}
                        placeholder='App url/Domain' className='mt-1'/>
                        <p className='text-gray-400 text-xs mt-2'>If provided, test cases will run on this domain</p>
                    </div>
                    <div className='mt-4'>
                        <label className='text-gray-500'>GLOBAL TEST INSTRUCTION</label>
                        <Input value={repoSettings?.globalInstruction}
                        onChange={(e)=>setRepoSettings({...repoSettings,globalInstruction:e.target.value})}
                        placeholder='Instructions' className='mt-1'/>
                        <p className='text-gray-400 text-xs mt-2'>Global Instructions will be added in every test case instruction</p>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose>
                        <Button className='cursor-pointer' variant={'outline'}>Cancel</Button>
                    </DialogClose>
                    <Button className='cursor-pointer' onClick={handleSaveSettings}>Save Config</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RepoSettings