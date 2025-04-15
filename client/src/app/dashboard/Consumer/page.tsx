"use client";

import { useState } from "react";
import Image from "next/image";
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

// Define TypeScript interfaces
interface NFT {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  category: string;
  status: string;
  tokenId: string;
  contractAddress: string;
  creator: string;
  owner: string;
  createdAt: string;
  attributes: ProductAttribute[];
  ownershipHistory: ProductOwnershipRecord[];
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

  // Sample user data
  const userWallet = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
  
  // Sample NFTs data - in a real app these would be fetched from an API
  const sampleNFTs = [
    {
      id: 2,
      name: "Limited Edition Designer Watch",
      description: "Exclusive timepiece with blockchain verification. Each watch comes with a unique serial number etched on the back, recorded on the blockchain for permanent authenticity verification.",
      image: "https://i.pinimg.com/736x/24/e4/4e/24e44e404db29926a77962f50b85b4a8.jpg",
      price: "0.85",
      category: "luxury",
      status: "Available",
      tokenId: "24601",
      contractAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      creator: "0x821aea9a577a9b44299b9c15c88cf3087f3b5544",
      owner: "0x7F74A2Cd60F37d69B4B4E5c6a8B15a485D34f616",
      createdAt: "2025-02-15T14:30:00Z",
      attributes: [
        { trait_type: "Material", value: "Stainless Steel" },
        { trait_type: "Movement", value: "Automatic" },
        { trait_type: "Water Resistance", value: "100m" },
        { trait_type: "Crystal", value: "Sapphire" },
        { trait_type: "Limited", value: "Yes" },
        { trait_type: "Edition", value: "25/100" }
      ],
      ownershipHistory: [
        {
          address: "0x7F74A2Cd60F37d69B4B4E5c6a8B15a485D34f616",
          timestamp: "2025-03-05T16:22:45Z",
          txHash: "0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4"
        },
        {
          address: "0x821aea9a577a9b44299b9c15c88cf3087f3b5544",
          timestamp: "2025-02-15T14:30:00Z",
          txHash: "0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6"
        }
      ]
    },
    {
      id: 3,
      name: "Premium Leather Handbag",
      description: "Handcrafted luxury leather handbag with unique serial number. Blockchain authenticated to guarantee authenticity and origin.",
      image: "https://i.pinimg.com/736x/ed/b8/5d/edb85df7d4158b0a29deea62a05c9c35.jpg",
      price: "0.65",
      category: "fashion",
      status: "Available",
      tokenId: "34578",
      contractAddress: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
      creator: "0x821aea9a577a9b44299b9c15c88cf3087f3b5544",
      owner: "0x821aea9a577a9b44299b9c15c88cf3087f3b5544",
      createdAt: "2025-03-02T10:15:00Z",
      attributes: [
        { trait_type: "Material", value: "Full Grain Leather" },
        { trait_type: "Hardware", value: "Gold Plated" },
        { trait_type: "Color", value: "Midnight Black" },
        { trait_type: "Limited", value: "Yes" },
        { trait_type: "Edition", value: "10/50" }
      ],
      ownershipHistory: [
        {
          address: "0x821aea9a577a9b44299b9c15c88cf3087f3b5544",
          timestamp: "2025-03-02T10:15:00Z",
          txHash: "0x7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c"
        }
      ]
    }
  ];

  // Sample owned NFTs - in a real app these would be fetched based on the user's wallet
  const ownedNFTs = [
    {
      id: 1,
      name: "Signature Wine Collection",
      image: "/api/placeholder/400/400",
      tokenId: "12345",
      price: "1.2",
      status: "Owned"
    },
    {
      id: 4,
      name: "Limited Edition Sneakers",
      image: "/api/placeholder/400/400",
      tokenId: "45678",
      price: "0.45",
      status: "Owned"
    }
  ];

  // Format address for display
  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Search for NFT by ID
  const handleSearch = () => {
    setIsSearching(true);
    // Simulate API call with timeout
    setTimeout(() => {
      const result = sampleNFTs.find(nft => nft.tokenId === searchQuery);
      setSearchResult(result || null);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="min-h-screen pt-30 bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
      {/* Header */}
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
                    NFT #{searchResult.tokenId}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{searchResult.category.charAt(0).toUpperCase() + searchResult.category.slice(1)}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" /> {formatDate(searchResult.createdAt)}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">Price</p>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-white">{searchResult.price} ETH</span>
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
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-teal-500 mr-3 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Creator</p>
                      <p className="text-white font-medium">{formatAddress(searchResult.creator)}</p>
                    </div>
                  </div>
                  
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
      {showHistoryModal && searchResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-0 max-w-2xl w-full shadow-2xl">
            {/* Header */}
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
            
            {/* Search */}
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
            
            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-6">
                {searchResult.ownershipHistory.map((record, index) => (
                  <div key={index} className="relative pl-8">
                    {/* Timeline connector */}
                    {index !== searchResult.ownershipHistory.length - 1 && (
                      <div className="absolute top-8 bottom-0 left-4 w-0.5 bg-white/10"></div>
                    )}
                    
                    {/* Event marker */}
                    <div className={`absolute top-2 left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-white/10'
                    }`}>
                      {index === 0 ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <User className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                        <div className="flex items-center mb-2 sm:mb-0">
                          <span className="font-medium text-white">{formatAddress(record.address)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 p-1 h-auto text-blue-400 hover:text-blue-300"
                          >
                            <ArrowUpRight className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(record.timestamp)} at {formatTime(record.timestamp)}
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Transaction</span>
                          <span className="text-blue-400 font-mono text-xs truncate max-w-xs">{record.txHash}</span>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-gray-400">Event</span>
                          <span className="text-white">
                            {index === 0 ? "Current Owner" : index === searchResult.ownershipHistory.length - 1 ? "Initial Minting" : "Transfer"}
                          </span>
                        </div>
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
            
            {/* Footer */}
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
      {showOwnedNFTsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-0 max-w-5xl w-full shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">My NFT Collection</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full hover:bg-white/10"
                onClick={() => setShowOwnedNFTsModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Filters & Search */}
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search your collection..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <Button
                variant="outline"
                className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
            </div>
            
            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ownedNFTs.map((nft) => (
                  <div key={nft.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300">
                    <div className="relative h-48">
                      <Image 
                        src={nft.image} 
                        alt={nft.name}
                        layout="fill"
                        objectFit="cover"
                      />
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-xs font-medium py-1 px-2 rounded-full">
                        {nft.status}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-2">{nft.name}</h3>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-400 text-sm">#{nft.tokenId}</p>
                        <p className="text-purple-400 font-medium">{nft.price} ETH</p>
                      </div>
                      <Button
                        className="w-full mt-3 bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 text-white flex items-center justify-center"
                        variant="outline"
                      >
                        View Details <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex justify-end">
              <Button
                variant="outline"
                className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
                onClick={() => setShowOwnedNFTsModal(false)}
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