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
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Please install MetaMask to use this feature');
  }

  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Create provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Check if we're on the correct network
    const network = await provider.getNetwork();
    if (network.chainId !== BigInt(chainId)) {
      throw new Error(`Please switch to Arbitrum Sepolia network. Current network: ${network.name}`);
    }

    return { provider, signer };
  } catch (error) {
    console.error('Error getting provider and signer:', error);
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
