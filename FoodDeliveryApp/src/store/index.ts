import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import rootReducer from './reducer';

const store = configureStore({
  reducer: rootReducer,
  // flipper setting
  // middleware: getDefaultMiddleware => {
  //   // if (__DEV__) {
  //   //   const createDebuuger = require('redux-flipper').default;
  //   //   return getDefaultMiddleware().concat(createDebuuger());
  //   // }
  //   return getDefaultMiddleware();
  // },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
