import { HomeAssembly } from "@/components/home/home-assembly";
import { HomeFinalOutput } from "@/components/home/home-final-output";
import { HomeHero } from "@/components/home/home-hero";

export default function HomePage() {
  return (
    <main className="page home-page home-overdrive">
      <HomeHero />
      <HomeAssembly />
      <HomeFinalOutput />
    </main>
  );
}
