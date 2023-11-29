import {AnyAction, combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import themeReducer from "@/app/store/theme/themeSlice"
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
// import { persistReducer } from 'redux-persist';


const reducer = combineReducers({
    theme: themeReducer,
});

// const persistConfig = {
//     key: 'redux',
//     storage,
//     // 黑名单 不缓存的
//     blacklist: ["message", "settingModal"]
// };

// const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({
        serializableCheck: false
    })]
})



export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
