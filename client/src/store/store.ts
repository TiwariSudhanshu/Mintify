"use client";

import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './walletSlice';
import userRoleReducer from './userRoleSlice';
import userMetaDataReducer from './userMetaDataSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    userRole: userRoleReducer,
    user: userMetaDataReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 