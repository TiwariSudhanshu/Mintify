"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { 
  Heart, 
  Share2, 
  History, 
  ShoppingCart, 
  CheckCircle, 
  X,
  User,
  ExternalLink,
  Clock,
  SendHorizonal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

export default function NFTDetailPage() {
  const params = useParams();
  const tokenId = params.id as string;
  
  const [nft, setNft] = useState<NFT | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const [transferAddress, setTransferAddress] = useState<string>("");
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);

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

  const handleGetOwnershipHistory = async (id: string) => {
    try {
      const response = await fetch("/api/getHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tokenId: id })
      });
      
      const data = await response.json();
      console.log("Ownership History Data: ", data.history);
      setHistory(data.history);
    }
    catch (error) {
      console.error("Error fetching ownership history:", error);
    }
  };

  const handleTransferNFT = async () => {
    if (!transferAddress || !transferAddress.startsWith('0x') || transferAddress.length !== 42) {
      toast.error("Please enter a valid wallet address");
      return;
    }
    
    setIsTransferring(true);
    try {
      const response = await fetch("/api/transferNFT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          tokenId: tokenId,
          newOwner: transferAddress 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("NFT transferred successfully");
        // Update the NFT data with new owner
        if (nft) {
          setNft({
            ...nft,
            owner: transferAddress
          });
        }
        // Close the modal
        setShowTransferModal(false);
        // Refresh ownership history
        handleGetOwnershipHistory(tokenId);
      } else {
        toast.error(data.message || "Failed to transfer NFT");
      }
    } catch (error) {
      console.error("Error transferring NFT:", error);
      toast.error("Failed to transfer NFT. Please try again.");
    } finally {
      setIsTransferring(false);
    }
  };

  // Fetch NFT data when component mounts
  useEffect(() => {
    const fetchNFTData = async () => {
      // if (!tokenId) return;
      console.log("Fetching NFT data for tokenId: ", tokenId);
      setLoading(true);
      try {
        const response = await fetch("/api/searchNFT", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ tokenId })
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch NFT data");
        }
        
        const data = await response.json();
        console.log("NFT Data: ", data);
        const productInfo = data.ProductInfo;
        // Process the API response to match our NFT interface
        const processedData = processAPIResponse(productInfo);
        setNft(processedData);
        
        // Fetch ownership history
        handleGetOwnershipHistory(tokenId);
      }
      catch (error) {
        console.error("Error fetching NFT data:", error);
        setError("Failed to load NFT data. Please try again later.");
      }
      finally {
        setLoading(false);
      }
    };

    fetchNFTData();
  }, [tokenId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-30 bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-white/20 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading NFT details...</p>
        </div>
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="min-h-screen pt-30 bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
          <X className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">NFT Not Found</h2>
          <p className="text-gray-300">{error || "This NFT does not exist or could not be loaded."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-30 bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            NFT Marketplace
          </h1>
          <p className="text-gray-400">Discover, collect, and authenticate luxury items</p>
        </div>
      </header>

      {/* NFT Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column - Product Image */}
          <div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 overflow-hidden">
              <div className="relative aspect-square">
                <Image 
                  src={nft.image} 
                  alt={nft.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-xs font-medium py-1 px-2 rounded-full">
                  {nft.status}
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
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{nft.name}</h1>
              <div className="flex items-center mt-2 text-gray-400 text-sm">
                <span className="border border-purple-500/30 bg-purple-500/10 text-purple-400 rounded-full px-2 py-0.5 text-xs font-medium">
                  NFT #{nft._id ? nft._id.substring(0, 8) : ''}
                </span>
                <span className="mx-2">•</span>
                <span>{nft?.category?.charAt(0).toUpperCase() + nft.category.slice(1)}</span>
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4 mr-1" /> {formatDate(nft.createdAt || '')}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-white">{nft.priceInEth || nft.price} ETH</span>
                  </div>
                </div>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg shadow-lg flex items-center"
                  onClick={() => setShowTransferModal(true)}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> Transfer NFT
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-300">{nft.description}</p>
            </div>

            {nft.attributes && nft.attributes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Attributes</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {nft.attributes.map((attr, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
                      <p className="text-xs text-gray-400">{attr.trait_type}</p>
                      <p className="text-sm font-medium text-white mt-1">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {nft.quantity && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
                <p className="text-xs text-gray-400">Quantity</p>
                <p className="text-sm font-medium text-white mt-1">{nft.quantity}</p>
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
                {nft.creator && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-teal-500 mr-3 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Creator</p>
                      <p className="text-white font-medium">{formatAddress(nft.creator)}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 mr-3 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Current Owner</p>
                    <p className="text-white font-medium">{formatAddress(nft.owner)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-80px] w-[500px] h-[500px] bg-blue-500/10 rounded-full filter blur-3xl" />
      </div>

      {/* Transfer NFT Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-0 max-w-md w-full shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                  <SendHorizonal className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Transfer NFT</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full hover:bg-white/10"
                onClick={() => setShowTransferModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-400">NFT</h3>
                  <span className="text-xs bg-purple-500/20 text-purple-400 py-1 px-2 rounded-full">
                    {nft._id ? `#${nft._id.substring(0, 8)}` : ''}
                  </span>
                </div>
                
                <div className="flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden mr-3">
                    <Image 
                      src={nft.image} 
                      alt={nft.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-white">{nft.name}</p>
                    <p className="text-sm text-gray-400">{nft.priceInEth || nft.price} ETH</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="recipientAddress" className="block text-sm text-gray-400 mb-2">
                  Transfer to (Wallet Address)
                </label>
                <div className="relative">
                  <input
                    id="recipientAddress"
                    type="text"
                    placeholder="0x..."
                    value={transferAddress}
                    onChange={(e) => setTransferAddress(e.target.value)}
                    className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Enter the recipient's full wallet address
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Current Owner</span>
                  <span className="text-white">{formatAddress(nft.owner)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Network Fee</span>
                  <span className="text-white">0.001 ETH</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex justify-between">
              <Button
                variant="outline"
                className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
                onClick={() => setShowTransferModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 rounded-lg shadow-lg flex items-center"
                onClick={handleTransferNFT}
                disabled={isTransferring || !transferAddress}
              >
                {isTransferring ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <SendHorizonal className="mr-2 h-4 w-4" /> Transfer
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Ownership History Modal */}
      {showHistoryModal && history && history.length > 0 && (
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

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-6">
                {history 
                .slice()
                .slice(1) 
                .reverse()
                .map((entry, index) => (
                  <div key={index} className="relative pl-8">
                    {/* Event marker */}
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

                    {/* Content */}
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
                          <ExternalLink className="h-3 w-3" />
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
    </div>
  );
}