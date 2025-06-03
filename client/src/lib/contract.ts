import { ethers } from 'ethers';
import contractData from './MintNFT.json'; 
import escrowContractData from './PaymentEscrow.json';

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
export const escrowContractAddress = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS!;
const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID!);

export const contract_ABI = contractData.abi;
export const escrowContract_ABI = escrowContractData.abi;

// Function to get provider and signer
export const getProviderAndSigner = async () => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('This function can only be called in a browser environment');
    }

    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error('Please install MetaMask to use this feature');
    }

    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please connect your wallet.');
    }

    // Create provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Check if we're on the correct network
    const network = await provider.getNetwork();
    if (network.chainId !== BigInt(chainId)) {
      throw new Error(`Please switch to Arbitrum Sepolia network. Current network: ${network.name}`);
    }

    return { provider, signer };
  } catch (error: any) {
    console.error('Error getting provider and signer:', error);
    if (error.code === 4001) {
      // User rejected the connection
      throw new Error('Please connect your wallet to continue');
    } else if (error.code === -32002) {
      // Request already pending
      throw new Error('Please check your MetaMask wallet for pending connection requests');
    }
    throw error;
  }
};

// Function to get contract instances
export const getContracts = async () => {
  const { signer } = await getProviderAndSigner();
  
  const contract = new ethers.Contract(contractAddress, contract_ABI, signer);
  const escrowContract = new ethers.Contract(escrowContractAddress, escrowContract_ABI, signer);
  
  return { contract, escrowContract };
};
