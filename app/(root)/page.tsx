import AddDocumentBtn from "@/components/AddDocumentBtn";
import Header from "@/components/Header";
import { getAllDocuments } from "@/lib/actions/room.actions";
import { dateConverter } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import docIcon from "@/public/logo.svg";
import { DeleteModal } from "@/components/DeleteModal";
import Notification from "@/components/Notification";

export default async function Home() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/signin");
  const roomDocuments = await getAllDocuments(
    clerkUser.emailAddresses[0].emailAddress
  );
  return (
    <main>
      <Header className="sticky left-0 top-0">
        <div className="flex items-center justify-center gap-1 md:gap-2">
          <div className="text-white">
              <Notification />
            </div>
          <div>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </Header>
      {roomDocuments.data.length > 0 ? (
        <div className="container py-6">
          <AddDocumentBtn
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
          <div className="py-4">
            <h3 className=" font-semibold text-md text-white">All Documents</h3>
          </div>
          <div>
            <ul className="">
              {roomDocuments.data.map(({ id, metadata, createdAt }: any) => (
                <li key={id} className="mb-4 bg-[#191919] flex justify-between items-center">
                  <Link
                    href={`/documents/${id}`}
                    className="w-full flex justify-start items-center gap-4 py-2 px-2 border border-white/20 rounded-sm"
                  >
                    <div className="rounded-md p-2 bg-white/10">
                      <Image src={docIcon} alt="file" height={30} width={30} />
                    </div>
                    <div className="space-y-1">
                      <p className="line-clamp-1 text-md text-white">
                        {metadata.title}
                      </p>
                      <p className="text-sm font-light text-gray-400">
                        Created about {dateConverter(createdAt)}
                      </p>
                    </div>
                  </Link>
                  {/* TODO: Add a delete button */}
                  <DeleteModal roomId={id} />
                </li>
              ))}
            </ul>
          </div>
        </div>  
      ) : (
        <div>
          <AddDocumentBtn
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  );
}
