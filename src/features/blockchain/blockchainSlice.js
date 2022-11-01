import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../api';

export const fetchLatestBlocks = createAsyncThunk(
  'blockchain/fetchLatestBlocks',
  async () => {
    const resp = await fetch(
      `https://mainnet.crescent.network:26657/blockchain`
    );
    const data = await resp.json();
    return data.result;
  }
);

export const fetchBlockResult = createAsyncThunk(
  'blockchain/fetchBlockResult',
  async height => {
    const { userOrderMatchedEvents } = await api.fetchBlockResult(height);
    return { height, data: { userOrderMatchedEvents } };
  }
);

const initialState = {
  autoRefresh: false,
  latestBlockHeight: null,
  blocks: {},
  blockHeights: [],
};

export const blockchainSlice = createSlice({
  name: 'blockchain',
  initialState,
  reducers: {
    setAutoRefresh: (state, action) => {
      state.autoRefresh = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchLatestBlocks.fulfilled, (state, action) => {
      state.latestBlockHeight = parseInt(action.payload.last_height);
      const newHeights = action.payload.block_metas.map(metadata =>
        parseInt(metadata.header.height)
      );
      const newHeightsSet = new Set(newHeights);
      for (let height in state.blocks) {
        height = parseInt(height);
        if (!newHeightsSet.has(height)) {
          delete state.blocks[height];
        }
      }
      action.payload.block_metas.forEach(metadata => {
        const height = metadata.header.height;
        if (!(height in state.blocks)) {
          state.blocks[height] = {
            height: parseInt(height),
            loaded: false,
            hash: metadata.block_id.hash,
            time: metadata.header.time,
            numTxs: parseInt(metadata.num_txs),
          };
        }
      });
      state.blockHeights = newHeights;
    });

    builder.addCase(fetchBlockResult.fulfilled, (state, action) => {
      const { height, data } = action.payload;
      Object.assign(state.blocks[height], {
        ...data,
        loaded: true,
      });
    });
  },
});

export const { setAutoRefresh } = blockchainSlice.actions;

export default blockchainSlice.reducer;
