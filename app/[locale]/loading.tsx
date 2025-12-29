import { Spinner } from "@/components/spinner";

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <Spinner size="xl" />
      <span className="text-muted-foreground text-xl font-bold">Loading...</span>
    </div>
  );
}
