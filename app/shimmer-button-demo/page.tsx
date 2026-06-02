import ShimmerButton from "@/components/ui/shimmer-button";

export default function Page() {
  return (
    <>
      <style>{`@keyframes shimmer2 { 0% { background-position: 0% 0%; } 100% { background-position: -200% 0%; } }`}</style>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <ShimmerButton>Shimmer</ShimmerButton>
      </div>
    </>
  );
}
