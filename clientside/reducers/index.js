import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authenticationReducer from './auth';

const rootReducer = combineReducers({
    authenticationReducer,
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelists: ['authenticationReducer'],
};

const persistorReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistorReducer);

export const persistor = persistStore(store);
