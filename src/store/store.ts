import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PURGE, PERSIST, REGISTER, REHYDRATE, persistStore } from 'redux-persist';

import rootReducer from './root-reducer';

// ----------------------------------------------------------------------

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// ----------------------------------------------------------------------

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
