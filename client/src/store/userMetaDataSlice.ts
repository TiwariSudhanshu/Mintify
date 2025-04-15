import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserMetaData {
  name: string;
  email: string;
}

// Get initial state from sessionStorage
const getInitialUserMetaData = (): UserMetaData => {
  if (typeof window !== 'undefined') {
    const savedState = sessionStorage.getItem('userMetaData');
    if (savedState) {
      return JSON.parse(savedState);
    }
  }
  return {
    name: '',
    email: '',
  };
};

const userMetaDataSlice = createSlice({
  name: 'userMetaData',
  initialState: getInitialUserMetaData(),
  reducers: {
    setUserMetaData(state, action: PayloadAction<UserMetaData>) {
      state.name = action.payload.name;
      state.email = action.payload.email;

      // Save to sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('userMetaData', JSON.stringify(state));
      }
    },
    clearUserMetaData(state) {
      state.name = '';
      state.email = '';

      // Remove from sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('userMetaData');
      }
    },
  },
});

export const { setUserMetaData, clearUserMetaData } = userMetaDataSlice.actions;

export default userMetaDataSlice.reducer;
