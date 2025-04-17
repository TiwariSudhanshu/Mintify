"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Sample product data
const sampleProducts = [
  {
    _id: "prod123456789",
    name: "Luxury Watch Elite X1",
    description: "Premium luxury timepiece with authentic certification",
    category: "Watches",
    priceInEth: 2.5,
    image: "/default-product.jpg",
    status: "Active"
  },
  {
    _id: "prod987654321",
    name: "Designer Handbag Model S",
    description: "Authentic designer handbag with verification chip",
    category: "Fashion",
    priceInEth: 1.8,
    image: "/default-product.jpg",
    status: "Active"
  },
  {
    _id: "prod456789123",
    name: "Limited Edition Sneakers",
    description: "Collectible footwear with blockchain authentication",
    category: "Footwear",
    priceInEth: 0.9,
    image: "/default-product.jpg",
    status: "Sold"
  }
];

function SearchProduct(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const router = useRouter();

  // Filter products when search term changes
  useEffect(() => {
    const results = sampleProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm]);

  const openDetails = (product: any) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b pt-30 from-black via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500">
              Search Products
            </h1>
            <p className="mt-1 text-gray-300">Find and explore authenticated products</p>
          </div>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" /> Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Search Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="h-5 w-5 absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, description or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border border-white/10 rounded-md h-10 w-full px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <Button
                onClick={() => setSearchTerm("")}
                variant="outline"
                className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500">
            Search Results
          </h2>
          <p className="text-gray-400">{filteredProducts.length} products found</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="relative h-48">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-xl"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-xs font-medium py-1 px-2 rounded-full">
                    {product.status}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{product.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <Button
                      variant="outline"
                      className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm"
                      onClick={() => openDetails(product)}
                    >
                      Details <Info className="ml-1 h-4 w-4" />
                    </Button>
                    <p className="text-xs text-gray-400">
                      {product.priceInEth} ETH
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                <h3 className="text-xl font-medium text-gray-300">No products found</h3>
                <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-80px] w-[500px] h-[500px] bg-blue-500/10 rounded-full filter blur-3xl" />
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative bg-gray-900 border border-white/10 rounded-xl p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
            <Button
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-1"
              onClick={() => setIsDetailsModalOpen(false)}
            >
              ✕
            </Button>
            <div className="mb-4">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
            <p className="text-gray-300 mb-4">{selectedProduct.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm text-gray-400">Category</h4>
                <p className="font-medium">{selectedProduct.category}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-400">Price</h4>
                <p className="font-medium">{selectedProduct.priceInEth} ETH</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-400">Status</h4>
                <p className="font-medium">{selectedProduct.status}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-400">ID</h4>
                <p className="font-medium">#{selectedProduct._id.slice(-8)}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchProduct;