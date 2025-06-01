import { useState } from 'react';
import { ethers } from 'ethers';
import { getProviderAndSigner, contract_ABI, escrowContract_ABI, contractAddress, escrowContractAddress } from '@/lib/contract';
import { toast } from 'sonner';

export const useContract = () => {
  const [isLoading, setIsLoading] = useState(false);

  const mintNFT = async (recipient: string, productInfo: string) => {
    try {
      setIsLoading(true);
      const { signer } = await getProviderAndSigner();
      const contract = new ethers.Contract(contractAddress, contract_ABI, signer);
      
      const tx = await contract.mintProductNFT(recipient, productInfo);
      toast.success("Transaction submitted! Waiting for confirmation...");
      return tx;
    } catch (error: any) {
      console.error('Error minting NFT:', error);
      toast.error(error.message || 'Failed to mint NFT');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const initiatePayment = async (productId: string, seller: string, amountInEth: string) => {
    try {
      setIsLoading(true);
      const { signer } = await getProviderAndSigner();
      const escrowContract = new ethers.Contract(escrowContractAddress, escrowContract_ABI, signer);
      
      const tx = await escrowContract.initiatePayment(productId, seller, {
        value: ethers.parseEther(amountInEth)
      });
      await tx.wait();

      // Save payment info to database
      const response = await fetch('/api/initiatePayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amountInEth,
          address: seller,
          productId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save payment info');
      }

      toast.success('Payment initiated successfully!');
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      toast.error(error.message || 'Failed to initiate payment');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const approvePayment = async (productId: string) => {
    try {
      setIsLoading(true);
      const { signer } = await getProviderAndSigner();
      const escrowContract = new ethers.Contract(escrowContractAddress, escrowContract_ABI, signer);
      
      const tx = await escrowContract.approvePayment(productId);
      await tx.wait();

      // Update payment status in database
      const response = await fetch('/api/approvePayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      toast.success('Payment approved successfully!');
    } catch (error: any) {
      console.error('Error approving payment:', error);
      toast.error(error.message || 'Failed to approve payment');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectPayment = async (productId: string) => {
    try {
      setIsLoading(true);
      const { signer } = await getProviderAndSigner();
      const escrowContract = new ethers.Contract(escrowContractAddress, escrowContract_ABI, signer);
      
      const tx = await escrowContract.rejectPayment(productId);
      await tx.wait();

      // Update payment status in database
      const response = await fetch('/api/rejectPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      toast.success('Payment rejected successfully!');
    } catch (error: any) {
      console.error('Error rejecting payment:', error);
      toast.error(error.message || 'Failed to reject payment');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const transferNFT = async (tokenId: string, to: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/transferNFT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenId, newOwner: to }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to transfer NFT');
      }

      const data = await response.json();
      toast.success('NFT transferred successfully!');
      return data;
    } catch (error: any) {
      console.error('Error transferring NFT:', error);
      toast.error(error.message || 'Failed to transfer NFT');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    mintNFT,
    initiatePayment,
    approvePayment,
    rejectPayment,
    transferNFT
  };
}; 