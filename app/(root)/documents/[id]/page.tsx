import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Document = async ({ params: { id } }: SearchParamProps) => {
  // const { id } = await params;

  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/signin");

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  if (!room) redirect("/");

  // TODO: Access the permission of the user to access the document
  const userIds = Object.keys(room.usersAccesses); // Obj.key means -> we will get only ids
  const users = await getClerkUsers({ userIds });

  // extract user data
  const userData = users.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes("room:write")
      ? "editor"
      : "viewer",
  }));

  // for current users
  const currentUserType = room.usersAccesses[
    clerkUser.emailAddresses[0].emailAddress
  ]?.includes("room:write")
    ? "editor"
    : "viewer";

  return (
    <main className="text-white">
      <CollaborativeRoom 
        roomId={id} 
        roomMetadata={room.metadata} 
        users={userData}  
        currentUserType={currentUserType}
      />
    </main>
  );
};

export default Document;
