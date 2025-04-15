import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LearnMoreCTASection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="glassmorphism rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto border border-white/10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 gradient-text">Ready to Transform Your Supply Chain?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join leading companies already using our blockchain platform for supply chain transparency
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link href="/">
              <Button size="lg" variant="outline" className="border-white/20 text-black px-8 py-6 text-lg rounded-xl">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 