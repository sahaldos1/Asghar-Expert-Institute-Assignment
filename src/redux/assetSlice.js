import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action to fetch assets
export const fetchAssets = createAsyncThunk('assets/fetchAssets', async () => {
  const response = await axios.get('https://api.coincap.io/v2/assets');
  return response.data.data;
});

const assetSlice = createSlice({
  name: 'assets',
  initialState: {
    assets: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assets = action.payload;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default assetSlice.reducer;
