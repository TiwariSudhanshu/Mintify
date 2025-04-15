import BackgroundElements from "@/components/BackgroundElements";
import PageHeader from "@/components/PageHeader";
import ProblemSolutionSection from "@/components/ProblemSolutionSection";
import NFTIntegrationSection from "@/components/NFTIntegrationSection";
import UseCasesSection from "@/components/UseCasesSection";
import LearnMoreCTASection from "@/components/LearnMoreCTASection";

export default function LearnMore() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <BackgroundElements />

      {/* Page Header */}
      <PageHeader 
        title="Learn More About Our Platform"
        description="Discover how blockchain technology is revolutionizing supply chain transparency"
      />

      {/* Problem and Solution Section */}
      <ProblemSolutionSection />

      {/* NFT Integration Section */}
      <NFTIntegrationSection />

      {/* Use Cases Section */}
      <UseCasesSection />

      {/* CTA Section */}
      <LearnMoreCTASection />
    </main>
  );
} 