import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type SearchParamProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

const Document = async ({ params }: SearchParamProps) => {
  const { id } = params;

  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/signin");

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  if (!room) redirect("/");

  const userIds = Object.keys(room.usersAccesses);
  const users = await getClerkUsers({ userIds });

  const userData = users.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes("room:write")
      ? "editor"
      : "viewer",
  }));

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
