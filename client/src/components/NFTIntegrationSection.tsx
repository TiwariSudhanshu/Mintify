import { CheckCircle2 } from "lucide-react";

export default function NFTIntegrationSection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="glassmorphism p-8 rounded-2xl border-white/10">
          <h2 className="text-2xl font-bold mb-6 gradient-text">NFTs in Supply Chain Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 mb-6">
                Non-Fungible Tokens (NFTs) are unique digital assets that represent ownership of a specific item. In our supply chain platform, each product is minted as an NFT with detailed metadata including:
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Product specifications and materials</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Manufacturing location and date</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Quality certifications and compliance data</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Environmental impact metrics</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-gray-300 mb-6">
                As products move through the supply chain, their NFT metadata is updated to include:
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-pink-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Transportation details and logistics data</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-pink-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Storage conditions and handling information</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-pink-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Quality inspections and test results</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-pink-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Transfer of ownership between parties</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10">
            <h3 className="text-lg font-medium mb-3">Benefits of NFT Integration</h3>
            <p className="text-gray-300">
              By representing products as NFTs, we create a digital twin that can be easily verified, transferred, and tracked throughout the supply chain. This approach enhances transparency, reduces fraud, and provides consumers with verifiable product information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 