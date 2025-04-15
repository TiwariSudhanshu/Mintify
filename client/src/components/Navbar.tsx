'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Network, Menu, X, Wallet } from "lucide-react"
import WalletConnectPopup from "./WalletConnectPopup"
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";

export default function Navbar() {
    const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Get wallet state from Redux
    const { address, isConnected } = useAppSelector((state: RootState) => state.wallet);

    // Format wallet address for display
    const formatWalletAddress = (address: string) => {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    // Add scroll event listener to change navbar style on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10 ${isScrolled ? 'bg-black/80' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center">
                                <Network className="h-6 w-6 text-purple-400 mr-2" />
                                <span className="text-xl font-bold gradient-text">Mintify</span>
                            </Link>
                        </div>
                        <div className="hidden md:flex md:items-center md:space-x-8">
                           
                            {isConnected ? (
                                <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700">
                                    <Wallet className="h-4 w-4 text-purple-400" />
                                    <span className="font-mono text-sm text-white">{formatWalletAddress(address)}</span>
                                </div>
                            ) : (
                                <Button 
                                    className="border-white/20 hover:bg-white/10 text-white"
                                    onClick={() => setIsWalletPopupOpen(true)}
                                >
                                    Connect Wallet
                                </Button>
                            )}
                            
                        </div>
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-300 hover:text-white focus:outline-none"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden bg-black/90 backdrop-blur-md border-b border-white/10">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                           
                            <div className="pt-4 pb-3 border-t border-white/10">
                                {isConnected ? (
                                    <div className="flex items-center space-x-2 px-3 py-2">
                                        <Wallet className="h-4 w-4 text-purple-400" />
                                        <span className="font-mono text-sm text-white">{formatWalletAddress(address)}</span>
                                    </div>
                                ) : (
                                    <button 
                                        className="w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors"
                                        onClick={() => {
                                            setIsWalletPopupOpen(true);
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        Connect Wallet
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <WalletConnectPopup
                isOpen={isWalletPopupOpen}
                onClose={() => setIsWalletPopupOpen(false)}
            />
        </>
    )
} 