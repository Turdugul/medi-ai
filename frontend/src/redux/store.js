import { configureStore } from '@reduxjs/toolkit';
import audioReducer from './slices/audioSlice';

export const store = configureStore({
  reducer: {
    audio: audioReducer,
  },
});
