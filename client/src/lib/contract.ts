import { ethers } from 'ethers';
import contractData from './MintNFT.json'; 
import escrowContractData from './PaymentEscrow.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL!;
const privateKey = process.env.CONTRACT_PRIVATE_KEY!; 
const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID!);
const escrowContractAddress = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS!;

const contract_ABI = contractData.abi;
const escrowContract_ABI = escrowContractData.abi;

const provider = new ethers.JsonRpcProvider(rpcUrl, {
  name: 'arbitrum-sepolia',
  chainId,
});

const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, contract_ABI, wallet);
const escrowContract = new ethers.Contract(escrowContractAddress, escrowContract_ABI, wallet);

export { contract, provider, wallet, escrowContract };
