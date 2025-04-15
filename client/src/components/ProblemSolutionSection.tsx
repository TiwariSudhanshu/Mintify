import { CheckCircle2 } from "lucide-react";

export default function ProblemSolutionSection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="glassmorphism p-8 rounded-2xl border-white/10">
            <h2 className="text-2xl font-bold mb-6 gradient-text">The Problem We're Solving</h2>
            <p className="text-gray-300 mb-4">
              Traditional supply chains lack transparency, making it difficult to verify product authenticity, track origins, and ensure ethical sourcing. This opacity leads to:
            </p>
            <ul className="space-y-3 text-gray-300 mb-6">
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span>Counterfeit products entering legitimate supply chains</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span>Difficulty in tracing product origins and manufacturing conditions</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span>Lack of trust between supply chain participants</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span>Inefficient recall processes when issues are discovered</span>
              </li>
            </ul>
            <p className="text-gray-300">
              Our blockchain-powered platform addresses these challenges by creating an immutable, transparent record of every product's journey through the supply chain.
            </p>
          </div>
          
          <div className="glassmorphism p-8 rounded-2xl border-white/10">
            <h2 className="text-2xl font-bold mb-6 gradient-text">How Blockchain Works</h2>
            <p className="text-gray-300 mb-4">
              Blockchain is a distributed ledger technology that creates a permanent, unalterable record of transactions. In our supply chain application:
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-purple-400">1</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Decentralized Network</h3>
                  <p className="text-gray-300 text-sm">Multiple parties maintain copies of the same ledger, eliminating single points of failure</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-pink-400">2</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Immutable Records</h3>
                  <p className="text-gray-300 text-sm">Once recorded, data cannot be altered, ensuring trust and transparency</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-400">3</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Smart Contracts</h3>
                  <p className="text-gray-300 text-sm">Automated agreements that execute when predefined conditions are met</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-400">4</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Consensus Mechanisms</h3>
                  <p className="text-gray-300 text-sm">Protocols that ensure all participants agree on the validity of transactions</p>
                </div>
              </div>
            </div>
            <p className="text-gray-300">
              By leveraging these blockchain features, we create a transparent, trustworthy supply chain ecosystem where all participants can verify product authenticity and origin.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 