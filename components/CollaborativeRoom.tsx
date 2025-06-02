"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import Header from "./Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { LexicalEditorComponent } from "./editor/LexicalEditor";
import ActiveCollaboraor from "./ActiveCollaboraor";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import editIcon from "@/public/edit-pencil.svg";
import { updateDocument } from "@/lib/actions/room.actions";
import Loader from "./Loader";

const CollaborativeRoom = ({
  roomId,
  roomMetadata,
  users,
  currentUserType
}: CollaborativeRoomProps) => {
  // Setting Untitled Section
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key !== "Enter") return;

    await handleUpdateTitle();
  };

  const handleUpdateTitle = async () => {
    if (documentTitle === roomMetadata.title) {
      setEditing(false);
      return;
    }

    try {
      setLoading(true);
      const updatedDocument = await updateDocument(roomId, documentTitle);
      if (updatedDocument) {
        setEditing(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        if (editing) {
          handleUpdateTitle();
          setEditing(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editing, documentTitle]);

  // recall everytime -> we are editing or not editing
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense
        fallback={
          <Loader />
        }
      >
        <div>
          <Header>
            <div className="flex justify-between items-center gap-1">
              <div className="flex w-full justify-end gap-1">
                <ActiveCollaboraor />
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </Header>
          <div className="border-b border-white/20">
            <div
              ref={containerRef}
              className="container flex justify-center py-3"
            >
              {editing ? (
                <Input
                  type="text"
                  value={documentTitle}
                  ref={inputRef}
                  placeholder="Enter title"
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  onKeyDown={updateTitleHandler}
                  onBlur={handleUpdateTitle}
                  className="border-none text-xl w-[500px] outline-none"
                />
              ) : (
                <p className="text-xl">{documentTitle}</p>
              )}

              {currentUserType === "editor" && !editing && (
                <Image
                  src={editIcon}
                  alt="edit"
                  width={24}
                  height={24}
                  onClick={() => setEditing(true)}
                  className="cursor-pointer"
                />
              )}

              {currentUserType !== "editor" && !editing && (
                <p className="text-gray-300">View only</p>
              )}

              {loading && <p className="text-sm text-gray-300">saving...</p>}
            </div>
          </div>
          <div className="container">
            <LexicalEditorComponent 
              roomId={roomId}
              currentUserType={currentUserType}
            />
          </div>
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;
