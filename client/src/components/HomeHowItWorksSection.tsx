export default function HomeHowItWorksSection() {
  return (
    <section className="py-24 px-6 sm:px-8 lg:px-10 bg-black relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold gradient-text mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A simple, streamlined process to bring transparency and trust to your supply chain.
          </p>
        </div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Step 1 */}
          <div className="glassmorphism p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition duration-300 shadow-lg hover:shadow-purple-600/20">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 mx-auto">
              <span className="text-3xl font-bold text-purple-400">1</span>
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Register Your Product</h3>
            <p className="text-gray-300 text-center">
              Create a detailed digital record of your product, including origin, materials, and specifications.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glassmorphism p-8 rounded-2xl border border-white/10 hover:border-pink-500/50 transition duration-300 shadow-lg hover:shadow-pink-600/20">
            <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center mb-6 mx-auto">
              <span className="text-3xl font-bold text-pink-400">2</span>
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Mint as NFT</h3>
            <p className="text-gray-300 text-center">
              Mint a unique NFT for each product that serves as a certificate of authenticity and ownership.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glassmorphism p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition duration-300 shadow-lg hover:shadow-blue-600/20">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 mx-auto">
              <span className="text-3xl font-bold text-blue-400">3</span>
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Track & Verify</h3>
            <p className="text-gray-300 text-center">
              Track the product throughout its supply chain journey and allow customers to verify its authenticity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
