import React from 'react';
import {Provider} from 'react-redux';

import store from './src/store';
import AppInner from './AppInner';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderedIn: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const App = () => {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
};

export default App;
