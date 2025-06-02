"use client";

import { createDocumet } from "@/lib/actions/room.actions";
import { Button } from "./ui/button"
import { useRouter } from "next/navigation";
import Image from "next/image";
import addIcon from "@/public/add.svg";

const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
    const router = useRouter();
    const addDocumentHandler = async () => {
        try {
            const room = await createDocumet({ userId, email });
            if (room) router.push(`/documents/${room.id}`); 
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className="flex justify-center py-8" onClick={addDocumentHandler}>
        <Button type="submit" className="bg-white rounded-sm">
            <Image
                src={addIcon}
                alt="add" 
                width={20}
                height={20}
            />
            <p className="text-black font-medium">Start a blank document</p>
        </Button>
    </div>
  )
}

export default AddDocumentBtn
