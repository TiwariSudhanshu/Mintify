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
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showOwnedNFTsModal, setShowOwnedNFTsModal] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [tokenId, setTokenId] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  
  const router = useRouter();
  const handleGetOwnershipHistory = async (tokenId: string) => {
    try {
      const response = await fetch("/api/getHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tokenId })
      });
      
      const data = await response.json();
      console.log("Ownership History Data: ", data.history);
      
      setHistory(data.history);
    }
    catch (error) {
      console.error("Error fetching ownership history:", error);
    }
  };



  // Format address for display
  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
  
  useEffect(() => {
    console.log("Search Result changed:", searchResult);
    console.log("Token ID changed:", tokenId);
    handleGetOwnershipHistory(tokenId);
  }, [searchResult]);

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
              onClick={() => setShowOwnedNFTsModal(true)}
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
                <Button variant="outline" className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10">
                  <ExternalLink className="h-5 w-5 mr-1" /> View on Chain
                </Button>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{searchResult.name}</h1>
                <div className="flex items-center mt-2 text-gray-400 text-sm">
                  <span className="border border-purple-500/30 bg-purple-500/10 text-purple-400 rounded-full px-2 py-0.5 text-xs font-medium">
                    NFT #{searchResult._id ? searchResult._id.substring(0, 8) : ''}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{searchResult?.category?.charAt(0).toUpperCase() + searchResult.category.slice(1)}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" /> {formatDate(searchResult.createdAt || '')}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">Price</p>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-white">{searchResult.priceInEth || searchResult.price} ETH</span>
                    </div>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg shadow-lg flex items-center"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Buy Now
                  </Button>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-300">{searchResult.description}</p>
              </div>

              {searchResult.attributes && searchResult.attributes.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Attributes</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {searchResult.attributes.map((attr, index) => (
                      <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
                        <p className="text-xs text-gray-400">{attr.trait_type}</p>
                        <p className="text-sm font-medium text-white mt-1">{attr.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResult.quantity && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Quantity</p>
                  <p className="text-sm font-medium text-white mt-1">{searchResult.quantity}</p>
                </div>
              )}

              <Button
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-6 py-2 rounded-lg shadow-lg flex items-center justify-center w-full"
                size="lg"
                onClick={() => setShowHistoryModal(true)}
              >
                <History className="mr-2 h-5 w-5" /> Track Ownership History
              </Button>

              {/* Creator & Owner Info */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                <h2 className="text-lg font-semibold mb-3">
                  Authentication Details
                </h2>
                
                <div className="space-y-4">
                  {searchResult.creator && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-teal-500 mr-3 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Creator</p>
                        <p className="text-white font-medium">{formatAddress(searchResult.creator)}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 mr-3 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Current Owner</p>
                      <p className="text-white font-medium">{formatAddress(searchResult.owner)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-80px] w-[500px] h-[500px] bg-blue-500/10 rounded-full filter blur-3xl" />
      </div>

      {/* Modern Ownership History Modal */}
      {showHistoryModal && history && history.length > 0 && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="bg-gray-900 border border-white/10 rounded-2xl p-0 max-w-2xl w-full shadow-2xl">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
            <History className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold">Ownership History</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full hover:bg-white/10"
          onClick={() => setShowHistoryModal(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-6 border-b border-white/10">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search transactions or addresses..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="p-6 max-h-96 overflow-y-auto">
        <div className="space-y-6">
          {history
            .slice()
            .slice(1) 
            .reverse()
            .map((entry, index) => (
              <div key={index} className="relative pl-8">
                <div
                  className={`absolute top-2 left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                      : 'bg-white/10'
                  }`}
                >
                  {index === 0 ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : (
                    <User className="h-4 w-4 text-gray-400" />
                  )}
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white truncate max-w-xs">
                      {entry}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto text-blue-400 hover:text-blue-300"
                      onClick={() => navigator.clipboard.writeText(entry)}
                    >
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </div>

                  {index === 0 && (
                    <div className="mt-2 text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-md inline-block">
                      Current Owner
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="p-4 border-t border-white/10 flex justify-end">
        <Button
          variant="outline"
          className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
          onClick={() => setShowHistoryModal(false)}
        >
          Close
        </Button>
      </div>
    </div>
  </div>
)}


      {/* My Collection Modal */}
      </div>
  )
}