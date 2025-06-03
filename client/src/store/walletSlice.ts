import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the wallet state interface
interface WalletState {
  address: string;
  // role: string;
  isConnected: boolean;
}

// Add type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
      selectedAddress?: string;
    };
  }
}

// Get initial state from sessionStorage if available
const getInitialState = (): WalletState => {
  if (typeof window !== 'undefined') {
    const savedState = sessionStorage.getItem('walletState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Verify if MetaMask is still connected
      if (window.ethereum && window.ethereum.selectedAddress === parsedState.address) {
        return parsedState;
      }
    }
  }
  return {
    address: '',
    // role: '',
    isConnected: false,
  };
};

// Create the wallet slice
const walletSlice = createSlice({
  name: 'wallet',
  initialState: getInitialState(),
  reducers: {
    connectWallet: (state, action: PayloadAction<{ address: string }>) => {
      state.address = action.payload.address;
      // state.role = action.payload.role;
      state.isConnected = true;
      
      // Save to sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('walletState', JSON.stringify(state));
      }
    },
    disconnectWallet: (state) => {
      state.address = '';
      // state.role = '';
      state.isConnected = false;
      
      // Remove from sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('walletState');
      }
    },
    updateWalletAddress: (state, action: PayloadAction<{ address: string }>) => {
      state.address = action.payload.address;
      state.isConnected = true;
      
      // Update sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('walletState', JSON.stringify(state));
      }
    }
  },
});

// Export actions and reducer
export const { connectWallet, disconnectWallet, updateWalletAddress } = walletSlice.actions;
export default walletSlice.reducer; 