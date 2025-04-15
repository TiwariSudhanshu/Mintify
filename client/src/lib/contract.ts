
import fs from 'fs';
import { ethers } from 'ethers';

const contractPath: string = process.env.NEXT_PUBLIC_CONTRACT_PATH!;
const contractAddress: string = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const rpcUrl: string = process.env.NEXT_PUBLIC_RPC_URL!;
const privateKey: string = process.env.NEXT_PUBLIC_PRIVATE_KEY!;

const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const contract_ABI = contractData.abi;

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, contract_ABI, wallet);

export { contract, provider, wallet };
