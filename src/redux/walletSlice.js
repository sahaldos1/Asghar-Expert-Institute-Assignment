import { createSlice } from '@reduxjs/toolkit';

const loadWalletFromStorage = () => {
  const storedWallet = localStorage.getItem('wallet');
  return storedWallet ? JSON.parse(storedWallet) : {};
};

const saveWalletToStorage = (wallet) => {
  localStorage.setItem('wallet', JSON.stringify(wallet));
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    assets: loadWalletFromStorage(),
  },
  reducers: {
    addAsset: (state, action) => {
      const { id, name, symbol, priceUsd, amount } = action.payload;
      if (state.assets[id]) {
        state.assets[id].amount += amount;
      } else {
        state.assets[id] = { id, name, symbol, priceUsd, amount };
      }
      saveWalletToStorage(state.assets);
    },
    removeAsset: (state, action) => {
      const { id, amount } = action.payload;
      if (state.assets[id]) {
        state.assets[id].amount -= amount;
        if (state.assets[id].amount <= 0) {
          delete state.assets[id];
        }
        saveWalletToStorage(state.assets);
      }
    },
  },
});

export const { addAsset, removeAsset } = walletSlice.actions;
export default walletSlice.reducer;
