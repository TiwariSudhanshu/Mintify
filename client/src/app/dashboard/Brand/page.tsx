"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Info } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Type definition
interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  priceInEth?: number;
  image?: string;
  status?: string;
}


  export function BrandDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const router = useRouter();
  
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const res = await fetch("/api/getAllNFT");
          const json = await res.json();
  
          if (!Array.isArray(json)) {
            throw new Error("Invalid data format");
          }
  
          setProducts(json);
        } catch (err: any) {
          toast.error("Failed to load products: " + err.message);
        }
      };
  
      fetchProducts();
    }, []);
  
    const openDetails = (product: Product) => {
      setSelectedProduct(product);
      setIsDetailsModalOpen(true);
    };
  
  return (
    <div className="min-h-screen bg-gradient-to-b pt-30 from-black via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Brand Dashboard
            </h1>
            <p className="mt-1 text-gray-300">Manage your authenticated products</p>
          </div>
          <Button
            onClick={() => router.push("/add-product")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Add New Product
          </Button>
        </div>
      </header>

      {/* Stats Overview */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-300">Total Products</h3>
            <p className="text-3xl font-bold mt-2">{products.length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-300">Active Listings</h3>
            <p className="text-3xl font-bold mt-2">
              {products.filter((p) => p.status === "Active").length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-300">Authentications</h3>
            <p className="text-3xl font-bold mt-2">214</p>
          </div>
        </div>

        {/* Product Grid */}
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500">
          Your Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="relative h-48">
                <Image
                  src={product.image || "/default-product.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover rounded-t-xl"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-xs font-medium py-1 px-2 rounded-full">
                  {product.status || "Unknown"}
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
                    ID: #{product._id.slice(-4).padStart(4, "0")}
                  </p>
                </div>
              </div>
            </div>
          ))}
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
                src={selectedProduct.image || "/default-product.jpg"}
                alt={selectedProduct.name}
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
            <p className="text-gray-300 mb-4">{selectedProduct.description}</p>
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

export default BrandDashboard;
