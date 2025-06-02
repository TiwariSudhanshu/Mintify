"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import {
  Heart,
  Share2,
  History,
  ShoppingCart,
  CheckCircle,
  X,
  User,
  CreditCard,
  ExternalLink,
  Clock,
  SendHorizonal,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useContract } from "@/hooks/useContract"
import { ethers } from "ethers"
import { getProviderAndSigner, contract_ABI, contractAddress } from "@/lib/contract"

// Define TypeScript interfaces
interface NFT {
  id?: number
  _id?: string
  name: string
  description: string
  image: string
  price?: string
  priceInEth?: number
  category: string
  status?: string
  tokenId?: string
  contractAddress?: string
  creator?: string
  owner: string
  quantity?: number
  createdAt?: string
  attributes: ProductAttribute[]
  ownershipHistory?: ProductOwnershipRecord[]
  Payment?: {
    priceInEth: number
    tokenId: string
    from: string
  }
}

interface ProductAttribute {
  trait_type: string
  value: string
}

interface ProductOwnershipRecord {
  address: string
  timestamp: string
  txHash: string
}

interface OwnershipHistoryEntry {
  address: string
  timestamp: string
  txHash: string
}

export default function NFTDetailPage() {
  const params = useParams()
  const tokenId = params.id as string

  const [nft, setNft] = useState<NFT | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false)
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false)
  const [showApprovePaymentModal, setShowApprovePaymentModal] = useState<boolean>(false)
  const [transferAddress, setTransferAddress] = useState<string>("")
  const [isTransferring, setIsTransferring] = useState<boolean>(false)
  const [history, setHistory] = useState<OwnershipHistoryEntry[]>([])
  const [requestAddress, setRequestAddress] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showRejectPaymentModal, setShowRejectPaymentModal] = useState(false)
  const { approvePayment, rejectPayment, transferNFT, isLoading: isContractLoading } = useContract()
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [userAddress, setUserAddress] = useState<string>("")
  const [showBuyModal, setShowBuyModal] = useState<boolean>(false)

  // Format address for display
  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Process API response to match our NFT interface
  const processAPIResponse = (data: any): NFT => {
    return {
      _id: data._id || "",
      name: data.name || "",
      description: data.description || "",
      image: data.image || "",
      priceInEth: data.priceInEth || 0,
      category: data.category || "unknown",
      owner: data.owner || "",
      attributes: data.attributes || [],
      // Add default values for UI elements that expect them
      Payment: {
        priceInEth: data.Payment?.priceInEth || 0,
        tokenId: data.Payment?.tokenId || "",
        from: data.Payment?.from || "",
      },
      status: "Available",
      createdAt: new Date().toISOString(),
      ownershipHistory: [
        {
          address: data.owner || "",
          timestamp: new Date().toISOString(),
          txHash: "0x" + Math.random().toString(16).substring(2, 34),
        },
      ],
    }
  }

  const handleGetOwnershipHistory = async (id: string) => {
    try {
      const { signer } = await getProviderAndSigner()
      const contract = new ethers.Contract(contractAddress, contract_ABI, signer)

      // Get ownership history from contract
      const history = await contract.getOwnershipHistory(id)
      console.log("Contract ownership history:", history)

      // Format the history data for display
      const formattedHistory = history.map((address: string) => ({
        address: address.toLowerCase(),
        timestamp: new Date().toISOString(), // Contract doesn't provide timestamps
        txHash: "0x" + Math.random().toString(16).substring(2, 34), // Contract doesn't provide tx hashes
      }))

      setHistory(formattedHistory)
    } catch (error) {
      console.error("Error fetching ownership history:", error)
      toast.error("Failed to fetch ownership history")
    }
  }

  const handleTransferNFT = async () => {
    if (!transferAddress || !transferAddress.startsWith("0x") || transferAddress.length !== 42) {
      toast.error("Please enter a valid wallet address")
      return
    }

    setIsTransferring(true)
    try {
      toast.loading("Transferring NFT...", { id: "transfer" })
      await transferNFT(tokenId, transferAddress)

      // Update the NFT data with new owner
      if (nft) {
        setNft({
          ...nft,
          owner: transferAddress,
        })
      }
      // Close the modal
      setShowTransferModal(false)
      // Refresh ownership history
      handleGetOwnershipHistory(tokenId)
      toast.success("NFT transferred successfully!", { id: "transfer" })
    } catch (error: any) {
      console.error("Error transferring NFT:", error)
      let errorMessage = "Failed to transfer NFT"

      if (error.message?.includes("user rejected")) {
        errorMessage = "Transaction was rejected"
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas"
      } else if (error.message?.includes("execution reverted")) {
        errorMessage = "Transfer failed: Contract execution reverted"
      }

      toast.error(errorMessage, { id: "transfer" })
    } finally {
      setIsTransferring(false)
    }
  }

  const handleApprovePayment = async () => {
    try {
      await approvePayment(tokenId)
      setShowApprovePaymentModal(false)
    } catch (error) {
      console.error("Error approving payment:", error)
    }
  }

  const handleRejectPayment = async () => {
    try {
      await rejectPayment(tokenId)
      setShowRejectPaymentModal(false)
    } catch (error) {
      console.error("Error rejecting payment:", error)
    }
  }

  // Check if current user is the owner
  const checkOwnership = async () => {
    try {
      const { signer } = await getProviderAndSigner()
      const contract = new ethers.Contract(contractAddress, contract_ABI, signer)
      const currentOwner = await contract.ownerOf(tokenId)
      const userAddr = await signer.getAddress()
      setUserAddress(userAddr)
      setIsOwner(currentOwner.toLowerCase() === userAddr.toLowerCase())
    } catch (error) {
      console.error("Error checking ownership:", error)
      setIsOwner(false)
    }
  }

  // Fetch NFT data when component mounts
  useEffect(() => {
    const fetchNFTData = async () => {
      console.log("Fetching NFT data for tokenId: ", tokenId)
      setLoading(true)
      try {
        // Fetch from database
        const response = await fetch("/api/searchNFT", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tokenId }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch NFT data")
        }

        const data = await response.json()
        console.log("NFT Data from DB: ", data)
        const productInfo = data.ProductInfo

        // Get current owner from contract
        const { signer } = await getProviderAndSigner()
        const contract = new ethers.Contract(contractAddress, contract_ABI, signer)
        const currentOwner = await contract.ownerOf(tokenId)

        // Process the API response to match our NFT interface
        const processedData = {
          _id: productInfo._id || tokenId,
          name: productInfo.name || "",
          description: productInfo.description || "",
          image: productInfo.image || "",
          priceInEth: productInfo.priceInEth || 0,
          category: productInfo.category || "unknown",
          owner: currentOwner.toLowerCase(), // Use owner from contract
          attributes: productInfo.attributes || [],
          Payment: {
            priceInEth: productInfo.Payment?.priceInEth || 0,
            tokenId: productInfo.Payment?.tokenId || tokenId,
            from: productInfo.Payment?.from || "",
          },
          status: productInfo.status || "Available",
          createdAt: productInfo.createdAt || new Date().toISOString(),
        }

        console.log("Processed NFT Data: ", processedData)
        setNft(processedData)

        // Check ownership
        await checkOwnership()

        // Fetch ownership history
        handleGetOwnershipHistory(tokenId)
      } catch (error) {
        console.error("Error fetching NFT data:", error)
        setError("Failed to load NFT data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchNFTData()
  }, [tokenId])

  if (loading) {
    return (
      <div className="min-h-screen pt-30 bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-white/20 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading NFT details...</p>
        </div>
      </div>
    )
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
    )
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
                  src={nft.image || "/placeholder.svg"}
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
                <Button
                  variant="outline"
                  className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
                >
                  <Heart className="h-5 w-5 mr-1" /> Favorite
                </Button>
                <Button
                  variant="outline"
                  className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
                >
                  <Share2 className="h-5 w-5 mr-1" /> Share
                </Button>
              </div>
              <Button
                variant="outline"
                className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
              >
                <ExternalLink className="h-5 w-5 mr-1" /> View on Chain
              </Button>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                {nft.name}
              </h1>
              <div className="flex items-center mt-2 text-gray-400 text-sm">
                <span className="border border-purple-500/30 bg-purple-500/10 text-purple-400 rounded-full px-2 py-0.5 text-xs font-medium">
                  NFT #{nft._id ? nft._id.substring(0, 8) : ""}
                </span>
                <span className="mx-2">•</span>
                <span>{nft?.category?.charAt(0).toUpperCase() + nft.category.slice(1)}</span>
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4 mr-1" /> {formatDate(nft.createdAt || "")}
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
                  onClick={() => (isOwner ? setShowTransferModal(true) : setShowBuyModal(true))}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isOwner ? "Transfer NFT" : "Buy NFT"}
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
              <h2 className="text-lg font-semibold mb-3">Authentication Details</h2>

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
                    {isOwner && <span className="text-xs text-green-400 mt-1">(You)</span>}
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mt-4 shadow-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  Payment Details
                </h3>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1">
                  <span className="text-xs text-gray-300">
                    Status: <span className="text-blue-400">Pending</span>
                  </span>
                </div>
              </div>

              {nft.Payment && Object.keys(nft.Payment).filter((key) => key !== "_id").length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(nft.Payment).map(
                    ([key, value], index) =>
                      key !== "_id" && (
                        <div
                          key={index}
                          className="flex justify-between text-sm text-gray-300 border-b border-white/10 pb-2"
                        >
                          <span className="capitalize text-gray-400">{key.replace(/([A-Z])/g, " $1")}</span>
                          <span className="text-white">{String(value)}</span>
                        </div>
                      ),
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-400">No Payment Found</div>
              )}

              <div className="flex items-center justify-between pt-4 mt-2">
                <Button
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
                  // onClick={() => handleRejectRequest()}
                  onClick={() => {
                    setShowRejectPaymentModal(true)
                    setRequestAddress(nft.Payment?.from || "")
                  }}
                >
                  <X className="mr-2 h-4 w-4" /> Reject Request
                </Button>

                <Button
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
                  // onClick={() => handleAcceptPayment()}
                  onClick={() => {
                    setShowApprovePaymentModal(true)
                    setRequestAddress(nft.Payment?.from || "")
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Accept Payment
                </Button>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-80px] w-[500px] h-[500px] bg-blue-500/10 rounded-full filter blur-3xl" />
      </div>

      {showApprovePaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-0 max-w-md w-full shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Approve Payment</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full hover:bg-white/10"
                onClick={() => setShowApprovePaymentModal(false)}
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
                    {nft._id ? `#${nft._id.substring(0, 8)}` : ""}
                  </span>
                </div>

                <div className="flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden mr-3">
                    <Image src={nft.image || "/placeholder.svg"} alt={nft.name} layout="fill" objectFit="cover" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{nft.name}</p>
                    <p className="text-sm text-gray-400">{nft.priceInEth || nft.price} ETH</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="requestAddress" className="block text-sm text-gray-400 mb-2">
                  Requester's Wallet Address
                </label>
                <div className="relative">
                  <input
                    id="requestAddress"
                    type="text"
                    value={requestAddress}
                    disabled
                    className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent opacity-80 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">Approving will transfer the NFT to this address</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Current Owner</span>
                  <span className="text-white">{formatAddress(nft.owner)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Payment Amount</span>
                  <span className="text-white">{nft.priceInEth || nft.price} ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Network Fee</span>
                  <span className="text-white">0.001 ETH</span>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Payment Verification</p>
                    <p className="text-xs text-gray-300 mt-1">
                      You are confirming that payment for this NFT has been received and verified. Upon approval,
                      ownership will be transferred to the requester.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex justify-between">
              <Button
                variant="outline"
                className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
                onClick={() => setShowApprovePaymentModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 rounded-lg shadow-lg flex items-center"
                // onClick={handleApprovePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" /> Accept Payment and Transfer NFT
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Payment Modal */}
      {showRejectPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-0 max-w-md w-full shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                  <X className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Reject Payment Request</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full hover:bg-white/10"
                onClick={() => setShowRejectPaymentModal(false)}
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
                    {nft._id ? `#${nft._id.substring(0, 8)}` : ""}
                  </span>
                </div>

                <div className="flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden mr-3">
                    <Image src={nft.image || "/placeholder.svg"} alt={nft.name} layout="fill" objectFit="cover" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{nft.name}</p>
                    <p className="text-sm text-gray-400">{nft.priceInEth || nft.price} ETH</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="requestAddress" className="block text-sm text-gray-400 mb-2">
                  Requester's Wallet Address
                </label>
                <div className="relative">
                  <input
                    id="requestAddress"
                    type="text"
                    value={requestAddress}
                    disabled
                    className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent opacity-80 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">Payment request from this address will be rejected</p>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Confirmation</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Are you sure you want to reject this payment request? The NFT will remain in your ownership and
                      the requester will be notified.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex justify-between">
              <Button
                variant="outline"
                className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
                onClick={() => setShowRejectPaymentModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 rounded-lg shadow-lg flex items-center"
                // onClick={handleRejectPayment}
                disabled={isRejecting}
              >
                {isRejecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" /> Reject Payment
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
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
                disabled={isTransferring}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isTransferring ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-12 h-12 border-4 border-t-purple-500 border-white/20 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-300 text-center">Transferring NFT...</p>
                  <p className="text-sm text-gray-400 text-center mt-2">
                    Please confirm the transaction in your wallet
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm text-gray-400">NFT</h3>
                      <span className="text-xs bg-purple-500/20 text-purple-400 py-1 px-2 rounded-full">
                        {nft._id ? `#${nft._id.substring(0, 8)}` : ""}
                      </span>
                    </div>

                    <div className="flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden mr-3">
                        <Image src={nft.image || "/placeholder.svg"} alt={nft.name} layout="fill" objectFit="cover" />
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
                        disabled={isTransferring}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Enter the recipient's full wallet address</p>
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
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex justify-between">
              <Button
                variant="outline"
                className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
                onClick={() => setShowTransferModal(false)}
                disabled={isTransferring}
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
                    Transferring...
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

      {/* Buy NFT Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-0 max-w-4xl w-full max-h-[80vh] shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Buy NFT</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full hover:bg-white/10"
                onClick={() => setShowBuyModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content - Horizontal Layout */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - NFT Info */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm text-gray-400">NFT Details</h3>
                      <span className="text-xs bg-purple-500/20 text-purple-400 py-1 px-2 rounded-full">
                        {nft._id ? `#${nft._id.substring(0, 8)}` : ""}
                      </span>
                    </div>

                    <div className="flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden mr-4">
                        <Image src={nft.image || "/placeholder.svg"} alt={nft.name} layout="fill" objectFit="cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white text-lg">{nft.name}</p>
                        <p className="text-sm text-gray-400">{nft.priceInEth || nft.price} ETH</p>
                        <p className="text-xs text-gray-500 mt-1">{nft.category}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Current Owner</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formatAddress(nft.owner)}
                        disabled
                        className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none opacity-80 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">You will send a purchase request to this owner</p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <CheckCircle className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Purchase Process</p>
                        <p className="text-xs text-gray-300 mt-1">
                          Your payment will be held in escrow until the owner approves the transfer. If rejected, funds
                          will be returned to your wallet.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Payment Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm text-gray-400 mb-3">Payment Breakdown</h3>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-400">NFT Price</span>
                        <span className="text-white">{nft.priceInEth || nft.price} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-400">Platform Fee (2.5%)</span>
                        <span className="text-white">{((nft.priceInEth || 0) * 0.025).toFixed(4)} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-400">Gas Fee (Est.)</span>
                        <span className="text-white">0.003 ETH</span>
                      </div>
                      <div className="border-t border-white/10 pt-3 mt-3">
                        <div className="flex justify-between text-lg font-semibold">
                          <span className="text-gray-300">Total</span>
                          <span className="text-white">{((nft.priceInEth || 0) * 1.025 + 0.003).toFixed(4)} ETH</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Your Wallet Balance</label>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium text-lg">2.45 ETH</span>
                        <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                          Sufficient Balance
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
                      onClick={() => setShowBuyModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow-lg flex items-center justify-center"
                      onClick={() => {
                        // Handle buy NFT logic here
                        toast.success("Purchase request sent to owner!")
                        setShowBuyModal(false)
                      }}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Send Purchase Request
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Ownership History Modal */}
      {showHistoryModal && (
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
            <div className="p-6">
              <div className="space-y-6">
                {history && history.length > 1 ? (
                  [...history.slice(1)].reverse().map((entry, index, arr) => (
                    <div key={index} className="relative pl-8">
                      {/* Event marker */}
                      <div
                        className={`absolute top-2 left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-white/10"
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
                            {formatAddress(entry.address)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-auto text-blue-400 hover:text-blue-300"
                            onClick={() => navigator.clipboard.writeText(entry.address)}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Tags */}
                        {index === 0 && (
                          <div className="mt-2 text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-md inline-block">
                            Current Owner
                          </div>
                        )}
                        {index === arr.length - 1 && (
                          <div className="mt-2 text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md inline-block">
                            Creator
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No ownership history available</p>
                  </div>
                )}
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
  )
}
