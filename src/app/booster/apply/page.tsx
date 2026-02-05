
import { db } from "@/lib/prisma";
import BoosterApplyForm from "./BoosterApplyForm";

export const metadata = {
  title: "Apply as Booster | GamingQu",
};

export default async function BoosterApplyPage() {
  const games = await db.game.findMany({
    where: { isActive: true },
    select: { id: true, name: true, imageUrl: true },
    orderBy: { name: "asc" },
  });

  const gamesWithImages = games.filter((g) => g.imageUrl);
  
  // Use a stable, deterministic seed based on the build or a fixed value for server-side rendering
  // Or simply select the first one to be safe. 
  // If we really want "random", we can just pick the first one since "games" query doesn't have a random order.
  // But to make it "random" per request on server, we can't use Date.now() in render.
  // We can just use the seconds of the current minute if we accept it changes every minute? No.
  // Best practice: Pick one deterministically or pass random seed from a place that allows side effects.
  // Since this is a server component, it runs on request. Date.now() IS impure.
  // Let's just pick the first one with image or based on length.
  
  const randomGame = gamesWithImages.length > 0 ? gamesWithImages[0] : null;
  const randomImageUrl = randomGame?.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating particles */}
      <div className="particles" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <BoosterApplyForm heroImage={randomImageUrl} />
    </div>
  );
}
