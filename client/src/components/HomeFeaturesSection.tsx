import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ShieldCheck, BadgeCheck, SatelliteDish } from "lucide-react";

export default function HomeFeaturesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-10 bg-black relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold gradient-text mb-4">
            Platform Highlights
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Unlock unparalleled visibility, authentication, and efficiency across your supply chain.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <HoverCard>
            <HoverCardTrigger>
              <Card className="glassmorphism h-full p-6 border border-white/10 hover:border-purple-500/50 transition duration-300 hover:shadow-lg hover:shadow-purple-600/20">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                    <ShieldCheck className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">Tamper-Proof Records</CardTitle>
                  <CardDescription className="text-gray-400">
                    Immutable blockchain entries ensure every transaction is verifiable and secure.
                  </CardDescription>
                </CardHeader>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="glassmorphism border-white/10 max-w-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-base">Tamper-Proof Records</h4>
                <p className="text-sm text-gray-300">
                  All activities are securely logged on the blockchain, eliminating the risk of data manipulation and enhancing transparency.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>

          {/* Feature 2 */}
          <HoverCard>
            <HoverCardTrigger>
              <Card className="glassmorphism h-full p-6 border border-white/10 hover:border-pink-500/50 transition duration-300 hover:shadow-lg hover:shadow-pink-600/20">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-4">
                    <BadgeCheck className="h-6 w-6 text-pink-400" />
                  </div>
                  <CardTitle className="text-xl">Product Authentication</CardTitle>
                  <CardDescription className="text-gray-400">
                    Every product is linked with a unique NFT for proof of authenticity and ownership.
                  </CardDescription>
                </CardHeader>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="glassmorphism border-white/10 max-w-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-base">Product Authentication</h4>
                <p className="text-sm text-gray-300">
                  NFTs contain origin, batch, and ownership data, allowing customers to verify authenticity instantly through a blockchain record.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>

          {/* Feature 3 */}
          <HoverCard>
            <HoverCardTrigger>
              <Card className="glassmorphism h-full p-6 border border-white/10 hover:border-blue-500/50 transition duration-300 hover:shadow-lg hover:shadow-blue-600/20">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                    <SatelliteDish className="h-6 w-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">Live Product Tracking</CardTitle>
                  <CardDescription className="text-gray-400">
                    Track product movement, condition, and location in real-time across your ecosystem.
                  </CardDescription>
                </CardHeader>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="glassmorphism border-white/10 max-w-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-base">Live Product Tracking</h4>
                <p className="text-sm text-gray-300">
                  Gain complete visibility of supply routes with real-time telemetry and blockchain-verified updates for smarter logistics.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </section>
  );
}
