"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import WalletConnectPopup from "./WalletConnectPopup";

export default function HomeCTASection() {
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);

  return (
    <section className="py-24 px-6 sm:px-8 lg:px-10 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="glassmorphism p-12 rounded-3xl border-white/10 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 gradient-text">
            Ready to Transform Your Supply Chain?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join the future of transparent and verifiable product tracking with blockchain technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105"
              onClick={() => setIsWalletPopupOpen(true)}
            >
              Get Started Now
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Wallet Connect Popup */}
      <WalletConnectPopup
        isOpen={isWalletPopupOpen}
        onClose={() => setIsWalletPopupOpen(false)}
      />
    </section>
  );
}
