"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch } from "react-redux";
import { clearUserMetaData } from "@/store/userMetaDataSlice";
import { clearRole } from "@/store/userRoleSlice";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Clock, 
  Heart, 
  Share2, 
  History, 
  ShoppingCart, 
  CheckCircle, 
  X,
  User,
  ExternalLink,
  Calendar,
  ArrowUpRight,
  Grid,
  Filter,
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useContract } from '@/hooks/useContract';
import { getProviderAndSigner, contract_ABI, contractAddress } from '@/lib/contract';
import { ethers } from "ethers";


// Define TypeScript interfaces
interface NFT {
  id?: number;
  _id?: string;
  name: string;
  description: string;
  image: string;
  price?: string;
  priceInEth?: number;
  category: string;
  status?: string;
  tokenId?: string;
  contractAddress?: string;
  creator?: string;
  owner: string;
  quantity?: number;
  createdAt?: string;
  attributes: ProductAttribute[];
  ownershipHistory?: ProductOwnershipRecord[];
}

interface ProductAttribute {
  trait_type: string;
  value: string;
}

interface ProductOwnershipRecord {
  address: string;
  timestamp: string;
  txHash: string;
}

export default function ConsumerDashboard() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResult, setSearchResult] = useState<NFT | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [tokenId, setTokenId] = useState<string>("");
  const [history, setHistory] = useState<ProductOwnershipRecord[]>([]);
  
  const router = useRouter();
 


  // Format address for display
  


  // Format time for display


  // Process API response to match our NFT interface
  const processAPIResponse = (data: any): NFT => {
    return {
      _id: data._id || '',
      name: data.name || '',
      description: data.description || '',
      image: data.image || '',
      priceInEth: data.priceInEth || 0,
      category: data.category || 'unknown',
      owner: data.owner || '',
      attributes: data.attributes || [],
      // Add default values for UI elements that expect them
      status: 'Available',
      createdAt: new Date().toISOString(),
      ownershipHistory: [
        {
          address: data.owner || '',
          timestamp: new Date().toISOString(),
          txHash: '0x' + Math.random().toString(16).substring(2, 34)
        }
      ]
    };
  };
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear Redux state
    dispatch(clearUserMetaData());
    dispatch(clearRole());
    
    // Also clear any additional sessionStorage items if needed
    if (typeof window !== 'undefined') {
      sessionStorage.clear(); // This clears all sessionStorage items
    }
    
    // Show success message
    toast.success("Logged out successfully");
    
    // Redirect to home page
    router.push('/');
  };

  // Search for NFT by ID
  const handleSearch = async() => {
    setIsSearching(true);
    try {
      const response = await fetch("/api/searchNFT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tokenId: searchQuery })
      });
      
      const data = await response.json();
      let productInfo = data.ProductInfo; 

      
      // Process the API response to match our NFT interface
      const processedData = processAPIResponse(productInfo)
      
      setTokenId(searchQuery);
      setSearchResult(processedData);
      setIsSearching(false);
      setSearchQuery("");
    }
    catch (error) {
      console.error("Error fetching NFT data:", error);
      setIsSearching(false);
      setSearchResult(null);
    }
  };
  

  return (
    <div className="min-h-screen pt-30 bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <div className="fixed text-2xl cursor-pointer top-0 right-0 p-4 z-50 bg-gray-900/80 backdrop-blur-sm rounded-bl-xl rounded-tr-xl shadow-lg flex items-center gap-2">
            <IoIosLogOut onClick={handleLogout}/>
            </div>
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              NFT Marketplace
            </h1>
            <p className="text-gray-400">Discover, collect, and authenticate luxury items</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 flex items-center"
              // onClick={() => setShowOwnedNFTsModal(true)}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              My Collection
            </Button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6">Find NFT by ID</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter NFT ID or Token Number..."
                className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg shadow-lg"
              onClick={handleSearch}
              disabled={isSearching || !searchQuery}
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchResult && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-semibold mb-6">Search Result</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column - Product Image */}
            <div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 overflow-hidden">
                <div className="relative aspect-square">
                  <Image 
                    src={searchResult.image} 
                    alt={searchResult.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-xs font-medium py-1 px-2 rounded-full">
                    {searchResult.status}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10">
                    <Heart className="h-5 w-5 mr-1" /> Favorite
                  </Button>
                  <Button variant="outline" className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10">
                    <Share2 className="h-5 w-5 mr-1" /> Share
                  </Button>
                </div>
                <Button onClick={()=>{router.push(`/product/${tokenId}`);}}
                 variant="outline" className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-red-300">
                  <ExternalLink className="h-5 w-5 mr-1" /> View in Detail
                </Button>
              </div>
            </div>

            {/* Right Column - Product Details */}
            
          </div>
        </section>
      )}

      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-80px] w-[500px] h-[500px] bg-blue-500/10 rounded-full filter blur-3xl" />
      </div>

      {/* Modern Ownership History Modal */}


      {/* My Collection Modal */}
      </div>
  )
}