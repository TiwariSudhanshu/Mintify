import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getProviderAndSigner, contract_ABI, escrowContract_ABI, contractAddress, escrowContractAddress } from '@/lib/contract';
import { toast } from 'sonner';

export const useContract = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const mintNFT = async (recipient: string, productInfo: string) => {
    if (!isClient) return;
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
    if (!isClient) return;
    try {
      setIsLoading(true);
      const { signer } = await getProviderAndSigner();
      console.log('Initiating payment for productId:', productId, 'to seller:', seller, 'amount:', amountInEth);
      console.log('Using escrow contract address:', escrowContractAddress);
      const escrowContract = new ethers.Contract(escrowContractAddress, escrowContract_ABI, signer);
      console.log('Escrow contract instance:', escrowContract);
      console.log("Value being sent:", ethers.parseEther(amountInEth).toString());
      const tx = await escrowContract.initiatePayment(productId, seller, {
        value: ethers.parseEther(amountInEth)
      });
      await tx.wait();
      console.log('Payment transaction successful:', tx);
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
    if (!isClient) return;
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
    if (!isClient) return;
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
    if (!isClient) {
      throw new Error('Please wait for the page to load completely');
    }

    try {
      setIsLoading(true);
      
      // Get provider and signer (this will handle MetaMask connection)
      const { signer } = await getProviderAndSigner();
      
      // Create contract instance
      const contract = new ethers.Contract(contractAddress, contract_ABI, signer);
      
      // Call the transfer function directly on the contract
      const tx = await contract.transferFrom(await signer.getAddress(), to, tokenId);
      
      // Wait for transaction to be mined
      await tx.wait();

      toast.success('NFT transferred successfully!');
      return tx;
    } catch (error: any) {
      console.error('Error transferring NFT:', error);
      let errorMessage = 'Failed to transfer NFT';

      if (error.message?.includes('user rejected')) {
        errorMessage = 'Transaction was rejected';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for gas';
      } else if (error.message?.includes('execution reverted')) {
        errorMessage = 'Transfer failed: Contract execution reverted';
      }

      toast.error(errorMessage);
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