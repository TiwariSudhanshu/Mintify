"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import WalletConnectPopup from "./WalletConnectPopup";

export default function HomeHeroSection() {
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);

  return (
    <section className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900 to-gray-950 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Content */}
        <div className="w-full lg:w-1/2 text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Next-Gen Product
            </span>
            <span className="block text-white">
              Authenticity & Traceability
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500">
              Powered by Web3
            </span>
          </h1>
        
        </div>

        {/* Right Side (can be an illustration later) */}
        {/* Right Side (can be an illustration later) */}
<div className="w-full lg:w-1/2 mt-10 lg:mt-0 flex flex-col items-center justify-center text-center">
  <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
    Ensure end-to-end product transparency with NFT-based ownership and tamper-proof blockchain tracking. Say goodbye to counterfeits and hello to consumer trust.
  </p>
  <div className="flex flex-col sm:flex-row gap-4">
    <Button
      size="lg"
      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      onClick={() => setIsWalletPopupOpen(true)}
    >
      Get Started <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
    <Link href="/learn-more">
      <Button
        size="lg"
        variant="outline"
        className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 px-8 py-6 text-lg font-medium rounded-xl"
      >
        Learn More
      </Button>
    </Link>
  </div>
</div>

      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-80px] w-[500px] h-[500px] bg-blue-500/10 rounded-full filter blur-3xl" />
      </div>

      {/* Wallet Connect Modal */}
      <WalletConnectPopup
        isOpen={isWalletPopupOpen}
        onClose={() => setIsWalletPopupOpen(false)}
      />
    </section>
  );
}
