import { PayloadAction, configureStore } from '@reduxjs/toolkit';
import persistStore from 'redux-persist/es/persistStore';
import { combinedReducer } from './reducers';
// ...

const rootReducer = (state: any, action: PayloadAction) => {
	if (action.type === 'user/logoutAction') {
		// check for action type
		state = undefined;
	}
	return combinedReducer(state, action);
};

const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
			immutableCheck: false,
		}),
	devTools: true
});

export default store;

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
