"use client";
import React from "react";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import Image from "next/image";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import EmptyWorkspace from "./EmptyWorkspace";

function WorkspaceBody() {
  const { userDetail } = useContext(UserDetailContext);
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
            <Button className="cursor-pointer"> Install </Button>
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
