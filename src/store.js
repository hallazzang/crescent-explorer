import { configureStore } from '@reduxjs/toolkit';

import blockchainReducer from './features/blockchain/blockchainSlice';

export default configureStore({
  reducer: {
    blockchain: blockchainReducer,
  },
});
