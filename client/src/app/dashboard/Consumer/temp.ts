// {showOwnedNFTsModal && (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
//       <div className="bg-gray-900 border border-white/10 rounded-2xl p-0 max-w-5xl w-full shadow-2xl">
//         {/* Header */}
//         <div className="p-6 border-b border-white/10 flex justify-between items-center">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
//               <ShoppingBag className="h-5 w-5" />
//             </div>
//             <h2 className="text-xl font-bold">My NFT Collection</h2>
//           </div>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="rounded-full hover:bg-white/10"
//             onClick={() => setShowOwnedNFTsModal(false)}
//           >
//             <X className="h-5 w-5" />
//           </Button>
//         </div>
        
//         {/* Filters & Search */}
//         <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between">
//           <div className="relative flex-grow">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-4 w-4 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search your collection..."
//               className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             />
//           </div>
//           <Button
//             variant="outline"
//             className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 flex items-center"
//           >
//             <Filter className="h-4 w-4 mr-2" /> Filter
//           </Button>
//         </div>
        
//         {/* Content */}
//         <div className="p-6 max-h-96 overflow-y-auto">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {ownedNFTs.map((nft) => (
//               <div key={nft.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300">
//                 <div className="relative h-48">
//                   <Image 
//                     src={nft.image} 
//                     alt={nft.name}
//                     layout="fill"
//                     objectFit="cover"
//                   />
//                   <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-xs font-medium py-1 px-2 rounded-full">
//                     {nft.status}
//                   </div>
//                 </div>
//                 <div className="p-4">
//                   <h3 className="font-medium text-lg mb-2">{nft.name}</h3>
//                   <div className="flex justify-between items-center">
//                     <p className="text-gray-400 text-sm">#{nft.tokenId}</p>
//                     <p className="text-purple-400 font-medium">{nft.price} ETH</p>
//                   </div>
//                   <Button
//                     className="w-full mt-3 bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 text-white flex items-center justify-center"
//                     variant="outline"
//                   >
//                     View Details <ChevronRight className="h-4 w-4 ml-1" />
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Footer */}
//         <div className="p-4 border-t border-white/10 flex justify-end">
//           <Button
//             variant="outline"
//             className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
//             onClick={() => setShowOwnedNFTsModal(false)}
//           >
//             Close
//           </Button>
//         </div>
//       </div>
//     </div>
//   )}



//   {showHistoryModal && searchResult && searchResult.ownershipHistory && (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
//       <div className="bg-gray-900 border border-white/10 rounded-2xl p-0 max-w-2xl w-full shadow-2xl">
//         {/* Header */}
//         <div className="p-6 border-b border-white/10 flex justify-between items-center">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
//               <History className="h-5 w-5" />
//             </div>
//             <h2 className="text-xl font-bold">Ownership History</h2>
//           </div>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="rounded-full hover:bg-white/10"
//             onClick={() => setShowHistoryModal(false)}
//           >
//             <X className="h-5 w-5" />
//           </Button>
//         </div>
        
//         {/* Search */}
//         <div className="p-6 border-b border-white/10">
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-4 w-4 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search transactions or addresses..."
//               className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//         </div>
        
//         {/* Content */}
//         <div className="p-6 max-h-96 overflow-y-auto">
//           <div className="space-y-6">
//             {searchResult.ownershipHistory.map((record, index) => (
//               <div key={index} className="relative pl-8">
//                 {/* Timeline connector */}
//                 {index !== searchResult.ownershipHistory.length - 1 && (
//                   <div className="absolute top-8 bottom-0 left-4 w-0.5 bg-white/10"></div>
//                 )}
                
//                 {/* Event marker */}
//                 <div className={`absolute top-2 left-0 w-8 h-8 rounded-full flex items-center justify-center ${
//                   index === 0 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-white/10'
//                 }`}>
//                   {index === 0 ? (
//                     <CheckCircle className="h-4 w-4 text-white" />
//                   ) : (
//                     <User className="h-4 w-4 text-gray-400" />
//                   )}
//                 </div>
                
//                 {/* Content */}
//                 <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
//                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
//                     <div className="flex items-center mb-2 sm:mb-0">
//                       <span className="font-medium text-white">{formatAddress(record.address)}</span>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="ml-1 p-1 h-auto text-blue-400 hover:text-blue-300"
//                       >
//                         <ArrowUpRight className="h-3 w-3" />
//                       </Button>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-400">
//                       <Calendar className="h-3 w-3 mr-1" />
//                       {formatDate(record.timestamp)} at {formatTime(record.timestamp)}
//                     </div>
//                   </div>
                  
//                   <div className="text-sm">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-400">Transaction</span>
//                       <span className="text-blue-400 font-mono text-xs truncate max-w-xs">{record.txHash}</span>
//                     </div>
//                     <div className="mt-2 flex justify-between items-center">
//                       <span className="text-gray-400">Event</span>
//                       <span className="text-white">
//                         {index === 0 ? "Current Owner" : index === searchResult.ownershipHistory.length - 1 ? "Initial Minting" : "Transfer"}
//                       </span>
//                     </div>
//                   </div>
                  
//                   {index === 0 && (
//                     <div className="mt-2 text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-md inline-block">
//                       Current Owner
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Footer */}
//         <div className="p-4 border-t border-white/10 flex justify-end">
//           <Button
//             variant="outline"
//             className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
//             onClick={() => setShowHistoryModal(false)}
//           >
//             Close
//           </Button>
//         </div>
//       </div>
//     </div>
//   )}


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