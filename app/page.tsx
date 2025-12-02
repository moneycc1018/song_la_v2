import Header from "@/components/header";

export default function IndexPage() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <Header />
      <main className="w-full flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-4"></div>
      </main>
    </div>
  );
}
