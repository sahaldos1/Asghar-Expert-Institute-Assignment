import { configureStore } from '@reduxjs/toolkit';
import assetReducer from './assetSlice';
import walletReducer from './walletSlice';

const store = configureStore({
  reducer: {
    assets: assetReducer,
    wallet: walletReducer,
  },
});

export default store;
