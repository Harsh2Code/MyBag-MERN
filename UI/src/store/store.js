import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import authReducer from './authSlice/authSlice';
import adminProductsSlice from './admin/product-slice/productSlice';
import shoppingProductsSlice from './Shop/Product-Slice/ProductSlice';
import shopCartSlice from './cart-slice/cart-Slice';
import adminOrdersReducer from './admin/order-slice/orderSlice';
import shoppingOrderReducer from './Shop/Order-Slice/OrderSlice';
import addressReducer from './Shop/Address-Slice/Address-Slice';
import userProfileReducer from './authSlice/userProfileSlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated', 'authChecked', 'role'],
};

const shoppingOrderPersistConfig = {
  key: 'shoppingOrder',
  storage,
  whitelist: ['orderList', 'orderDetails'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedShoppingOrderReducer = persistReducer(shoppingOrderPersistConfig, shoppingOrderReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    adminProducts: adminProductsSlice,
    shopProducts: shoppingProductsSlice,
    shopCart: shopCartSlice,
    adminOrders: adminOrdersReducer,
    shoppingOrder: persistedShoppingOrderReducer,
    shopAddress: addressReducer,
    userProfile: userProfileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
});

export const persistor = persistStore(store);
