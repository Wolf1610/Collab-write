import { cn } from "@/lib/utils";
import { useIsThreadActive } from "@liveblocks/react-lexical";
import { Composer, Thread } from "@liveblocks/react-ui";
import { useThreads } from "@liveblocks/react/suspense";

const ThreadWrapper = ({ thread }: ThreadWrapperProps) => {
  // thread is active or not
  const isActive = useIsThreadActive(thread.id);

  return (
    <Thread
      thread={thread}
      data-state={isActive ? "active" : null}
      className={cn(
        "border border-white/20 p-3 my-3 rounded-sm",
        isActive && "shadow-md",
        thread.resolved && "opacity-40"
      )}
    />
  );
};

const Comments = () => {
  const { threads } = useThreads();

  return (
    <div className="py-6">
      <Composer />
      {[...threads].reverse().map((thread) => (
        <ThreadWrapper key={thread.id} thread={thread}/>
      ))}
    </div>
  );
};

export default Comments;
