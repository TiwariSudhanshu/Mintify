import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the wallet state interface
interface WalletState {
  address: string;
  // role: string;
  isConnected: boolean;
}

// Get initial state from sessionStorage if available
const getInitialState = (): WalletState => {
  if (typeof window !== 'undefined') {
    const savedState = sessionStorage.getItem('walletState');
    if (savedState) {
      return JSON.parse(savedState);
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
    connectWallet: (state, action: PayloadAction<{ address: string;  }>) => {
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
  },
});

// Export actions and reducer
export const { connectWallet, disconnectWallet } = walletSlice.actions;
export default walletSlice.reducer; 