import { configureStore, createSlice } from '@reduxjs/toolkit';

// Dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    selectedDateRange: 'last7days',
    selectedDomain: 'all',
    refreshInterval: 30000,
    autoRefresh: true,
  },
  reducers: {
    setDateRange: (state, action) => {
      state.selectedDateRange = action.payload;
    },
    setSelectedDomain: (state, action) => {
      state.selectedDomain = action.payload;
    },
    setRefreshInterval: (state, action) => {
      state.refreshInterval = action.payload;
    },
    setAutoRefresh: (state, action) => {
      state.autoRefresh = action.payload;
    },
  },
});

export const { setDateRange, setSelectedDomain, setRefreshInterval, setAutoRefresh } = dashboardSlice.actions;

// Create and export the store
export const store = configureStore({
  reducer: {
    dashboard: dashboardSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
