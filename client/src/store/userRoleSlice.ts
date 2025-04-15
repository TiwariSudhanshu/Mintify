import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state interface
interface UserRoleState {
  role: string | null;
}

// Function to get the initial state from sessionStorage
const getInitialUserRoleState = (): UserRoleState => {
  if (typeof window !== 'undefined') {
    const savedState = sessionStorage.getItem('userRoleState');
    if (savedState) {
      return JSON.parse(savedState);
    }
  }
  return {
    role: null,
  };
};

// Create slice
const userRoleSlice = createSlice({
  name: 'userRole',
  initialState: getInitialUserRoleState(),
  reducers: {
    setRole(state, action: PayloadAction<{ role: string }>) {
      state.role = action.payload.role;

      // Save to sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('userRoleState', JSON.stringify(state));
      }
    },
    clearRole(state) {
      state.role = null;

      // Remove from sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('userRoleState');
      }
    },
  },
});

// Export actions and reducer
export const { setRole, clearRole } = userRoleSlice.actions;
export default userRoleSlice.reducer;
