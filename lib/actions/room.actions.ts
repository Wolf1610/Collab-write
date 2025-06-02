"use server";
import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";

export const createDocumet = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };

    // user can edit diff documents
    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [],
    });

    // revalidate a path -> new document will appear on frontend we create a new room
    revalidatePath("/");

    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while creating  a room ${error}`);
  }
};

export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    // const hasAccess = Object.keys(room.usersAccesses).includes(userId);
    // if (!hasAccess) {
    //   throw new Error(`You don't have access to this document.`);
    // }
    return parseStringify(room);
  } catch (error) {
    console.log(error);
  }
};

// For Title Update section
export const updateDocument = async (roomId: string, title: string) => {
  try {
    const updateRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updateRoom);
  } catch (error) {
    console.log(`Error happeden while updating room -- ${error}`);
  }
};

// Getting all rooms
export const getAllDocuments = async (email: string) => {
  try {
    const allRooms = await liveblocks.getRooms({ userId: email });
    return parseStringify(allRooms);
  } catch (error) {
    console.log(error);
  }
};
