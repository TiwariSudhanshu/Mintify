"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { connectWallet, disconnectWallet } from "@/store/walletSlice";
import { setRole } from "@/store/userRoleSlice";
import type { RootState } from "@/store/store";
import { toast } from "sonner";
import RegisterPopup from "./RegisterPopup";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { setUserMetaData } from "@/store/userMetaDataSlice";

// Add type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
      selectedAddress?: string;
    };
  }
}

interface WalletConnectPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletConnectPopup({
  isOpen,
  onClose,
}: WalletConnectPopupProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletExists, setWalletExists] = useState(false);
  const [data, setData] = useState({ name: "", email: "", role: "" });
  // Get wallet state from Redux
  const { address, isConnected } = useAppSelector(
    (state: RootState) => state.wallet
  );
  const dispatch = useAppDispatch();

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const handleConnect = async () => {
    setIsConnecting(true);

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== "undefined") {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const walletAddress = accounts[0];
        console.log("Connected account:", walletAddress);

        // Store the connected account and role in Redux
        dispatch(connectWallet({ address: walletAddress }));
        toast.success("Wallet connected successfully!");

        // Check if the wallet address exists in the database
        const response = await fetch("/api/check-wallet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: walletAddress }),
        });

        const data = await response.json();
        const existingUser = data.existingUser;
        console.log("Existing user data:", existingUser);
        if (response.ok) {
          if (data.exists) {
            toast.success(`Welcome back, ${existingUser.name}!`);
            setWalletExists(true);
            setData({ name: existingUser.name, email: existingUser.email, role: existingUser.userRole });
            // Proceed with login logic
          } else {
            toast.info("Wallet not registered. Please complete registration.");
            // Trigger registration popup logic
            setWalletExists(false);
          }
        } else {
          toast.error("Failed to verify wallet. Please try again.");
        }
      } else {
        toast.error("Please install MetaMask to connect your wallet");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    dispatch(disconnectWallet());
  };
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);

  const handleRegistration = async () => {
    setShowRegisterPopup(true);
  };

  const router = useRouter();
  const handleLogin = () => {
    // dispatch({ type: "userRole/setRole", payload: data.role });
    console.log("User role:", data.role);
    dispatch(setRole({role: data.role}));

    // dispatch({
    //   type: "userMeta/setMeta",
    //   payload: { name: data.name, email: data.email },
    // });


    dispatch(setUserMetaData({ name: data.name, email: data.email }));

    router.push("/dashboard");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-900 border-gray-700 sm:max-w-md rounded-lg shadow-lg">
          <DialogHeader className="bg-gray-800 rounded-t-lg p-6">
            <DialogTitle className="text-2xl font-bold text-white">
              Connect Your Wallet
            </DialogTitle>
          </DialogHeader>

          <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Wallet className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-medium text-white">
                Ethereum Wallet
              </h3>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Connect your Ethereum wallet to interact with the blockchain and
              manage your NFTs.
            </p>

            {isConnected ? (
              <div className="flex flex-col items-center p-3 bg-gray-700 rounded-md">
                <p className="text-sm text-gray-300 mb-2">Connected Wallet</p>
                <p className="font-mono text-white">
                  {formatWalletAddress(address)}
                </p>
                <Button
                  className="mt-3 bg-gray-600 hover:bg-gray-500 text-white"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>

          <DialogFooter>
            {isConnected && walletExists ? (
              <Button
                onClick={handleLogin}
                className="bg-gray-600 text-gray-200 hover:bg-gray-500"
              >
                Login
              </Button>
            ) : isConnected && !walletExists ? (
              <Button
                onClick={handleRegistration}
                className="bg-gray-600 text-gray-200 hover:bg-gray-500"
              >
                Register Wallet
              </Button>
            ) : null}

            <Button
              onClick={onClose}
              className="border-gray-600 bg-gray-700 text-gray-200"
            >
              {isConnected ? "Done" : "Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {showRegisterPopup && (
        <RegisterPopup
          isOpen={showRegisterPopup}
          onClose={() => setShowRegisterPopup(false)}
          address={address}
        />
      )}
    </>
  );
}
