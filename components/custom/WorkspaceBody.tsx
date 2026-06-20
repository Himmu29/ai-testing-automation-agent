"use client";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import Image from "next/image";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import EmptyWorkspace from "./EmptyWorkspace";
import axios from "axios";
import { useRouter } from "next/navigation";
import RepoDialog from "./RepoDialog";

function WorkspaceBody() {

  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();
  const [token,setToken] = useState('');

  useEffect(()=>{
    GetGithubUserToken();
  },[])

  const GetGithubUserToken = async ()=>{
    const result = await axios.get('/api/github/token');
    console.log(result.data.token);
    setToken(result.data.token);
  }

  const OnAddRepo = async ()=>{
    router.push('/api/github');
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-medium">Workspace</h2>
        <h2 className="text-blue-800 bg-blue-100 px-2 rounded-lg">
          Remaining Credits: {userDetail?.credits}
        </h2>
      </div>

      <Card className={"mt-5 flex justify-between items-center p-4 border rounded-lg"}>
        <div className="flex items-center gap-5">
          <Image src={"/github.png"} alt="Github Logo" width={40} height={40} />
          <h2 className="text-lg">Connect Github & Add repository</h2>
        </div>
        <div>
            {!token?<Button className="cursor-pointer" onClick={OnAddRepo}>Setup</Button>
            :<RepoDialog setRefreshPage={(refresh:boolean)=>console.log(refresh)}/>}
        </div>
      </Card>

      <Card className='mt-10'>
        <CardContent>
        <EmptyWorkspace/>
        </CardContent>
      </Card>
    </div>
  );
}

export default WorkspaceBody;
