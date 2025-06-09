"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RegisterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

const RegisterPopup: React.FC<RegisterPopupProps> = ({ isOpen, onClose, address }) => {
  const [formData, setFormData] = useState({
    name: '',
    userRole: '',
    email: '',
  });

  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkWalletStatus = async () => {
    try {
      const response = await fetch("/api/check-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();
      if (response.ok && data.exists) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking wallet:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, walletAddress: address }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        dispatch({ type: 'userRole/setRole', payload: formData.userRole });
        dispatch({ type: 'userMeta/setMeta', payload: { name: formData.name, email: formData.email } });
        
        // Check wallet status immediately after registration
        const walletExists = await checkWalletStatus();
        if (walletExists) {
          // Update parent component's state through the onClose callback
          onClose();
          router.push("/dashboard");
        }
      } else {
        toast.error(data.message || "Error registering wallet");
      }
    } catch (error) {
      console.error("Error in registerWallet API: ", error);
      toast.error("Internal server error");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 sm:max-w-md rounded-lg shadow-lg">
        <DialogHeader className="bg-gray-800 rounded-t-lg p-6">
          <DialogTitle className="text-2xl font-bold text-white">Register Your Wallet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <select
            name="userRole"
            value={formData.userRole}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Role</option>
            <option value="Brand">Brand</option>
            <option value="Consumer">Consumer</option>
          </select>

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <DialogFooter>
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-gray-200 hover:bg-gray-500"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Register
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterPopup;
