import SearchComponent from "@/components/ui/animated-glowing-search-bar";

// A route file may only export `default` (+ Next metadata exports),
// so the demo wrapper stays local instead of being exported.
const DemoOne = () => {
  return <SearchComponent />;
};

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <DemoOne />
    </main>
  );
}
