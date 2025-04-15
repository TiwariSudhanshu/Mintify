import HomeBackgroundElements from "@/components/HomeBackgroundElements";
import HomeHeroSection from "@/components/HomeHeroSection";
import HomeFeaturesSection from "@/components/HomeFeaturesSection";
import HomeHowItWorksSection from "@/components/HomeHowItWorksSection";
import HomeCTASection from "@/components/HomeCTASection";
import HomeFooter from "@/components/HomeFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white pt-16">
      <HomeBackgroundElements />
      <HomeHeroSection />
      <HomeFeaturesSection />
      <HomeHowItWorksSection />
      <HomeCTASection />
      <HomeFooter />
    </main>
  );
}
