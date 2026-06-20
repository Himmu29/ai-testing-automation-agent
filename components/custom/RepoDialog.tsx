import React, { useContext, useEffect, useMemo, useState } from 'react'
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
import axios from 'axios'
import { Input } from '../ui/input'
import { UserDetailContext } from '@/context/UserDetailContext'

type Repo = {
  id: number;
  name: string;
  full_name: string;
  private_: boolean;
  html_url: string;
  description: string;
  language: string;
  updated_at: string;
  default_branch: string;
  owner: string;
}


function RepoDialog({setRefreshPage}:{setRefreshPage:(refresh: boolean) => void}) {
  
  const [repoList, setRepoList] = useState<Repo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const {userDetail} = useContext(UserDetailContext);
  const [isOpen,setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRepoList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await axios.get<Repo[]>('/api/github/repos');
      setRepoList(result.data);
    } catch (err) {
      setError('Failed to load repositories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getRepoList();
  }, []);

  const filteredRepoList = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return repoList;
    return repoList.filter(r => r.full_name.toLowerCase().includes(q));
  }, [searchTerm, repoList]);

  // const handleAdd = () => {
  //   if (!selectedRepo) return;
  //   onAdd?.(selectedRepo);
  //   setSelectedRepo(null);
  //   setSearchTerm('');
  // }

  const SaveRepoToDB = async ()=>{
    if(!selectedRepo) return;

    const result = await axios.post('/api/user-repo',{
      repoId:selectedRepo.id,
      name:selectedRepo.name,
      full_name:selectedRepo.full_name,
      private_:selectedRepo.private_,
      html_url:selectedRepo.html_url,
      description:selectedRepo.description,
      userId:userDetail?.id,
      owner:selectedRepo.owner,
      updatedAt:selectedRepo.updated_at,
      language:selectedRepo.language,
      default_branch:selectedRepo.default_branch,
    });

    console.log(result.data);
    setIsOpen(false);
    setRefreshPage(true);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open)=>setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button>+ Add Repo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Repository</DialogTitle>
          <DialogDescription>
            Search and select one of your github repositories.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Input
            placeholder="Search Repos by Name"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          {/* Repo List */}
          <ul className="max-h-60 overflow-y-auto border rounded-xl mt-4">
            {isLoading && (
              <li className="p-4 text-sm text-gray-500">Loading repositories…</li>
            )}
            {error && (
              <li className="p-4 text-sm text-red-500">{error}</li>
            )}
            {!isLoading && !error && filteredRepoList.length === 0 && (
              <li className="p-4 text-sm text-gray-500">No repositories found.</li>
            )}
            {!isLoading && !error && filteredRepoList.map((repo) => (
              <li
                key={repo.id}
                className={`p-4 border-b hover:bg-gray-100 cursor-pointer ${
                  selectedRepo?.id === repo.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => setSelectedRepo(repo)}
              >
                {repo.full_name}
              </li>
            ))}
          </ul>
        </div>
        <DialogFooter className="flex gap-5">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={()=>SaveRepoToDB()} disabled={!selectedRepo}>
              Add
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RepoDialog