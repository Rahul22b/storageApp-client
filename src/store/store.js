// Example: src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { directoryApi } from '../api/directoryApi'; // Import your RTK Query slice

export const store = configureStore({
  reducer: {
    // Add the RTK Query API reducer here
    [directoryApi.reducerPath]: directoryApi.reducer,
  },
  // Add the RTK Query middleware for caching, invalidation, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(directoryApi.middleware),
});