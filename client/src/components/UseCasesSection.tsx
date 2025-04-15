import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Globe, Shield, Database } from "lucide-react";

export default function UseCasesSection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center gradient-text">Industry Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="glassmorphism border-white/10">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-green-400" />
              </div>
              <CardTitle>Food & Agriculture</CardTitle>
              <CardDescription >
                Track food products from farm to table, ensuring freshness and safety
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2  ">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Verify organic certification</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Track temperature during transport</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Rapid recall in case of contamination</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="glassmorphism border-white/10">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <CardTitle>Luxury Goods</CardTitle>
              <CardDescription className=" ">
                Combat counterfeiting and verify authenticity of high-value items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2  ">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Verify product authenticity</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Track ownership history</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Enhance brand protection</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="glassmorphism border-white/10">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-purple-400" />
              </div>
              <CardTitle>Pharmaceuticals</CardTitle>
              <CardDescription className=" ">
                Ensure drug safety and prevent counterfeit medications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2  ">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Verify drug authenticity</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Track expiration dates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Comply with regulatory requirements</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
} 