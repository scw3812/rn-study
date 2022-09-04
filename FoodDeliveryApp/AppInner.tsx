import React, {useEffect, useCallback} from 'react';
import {Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {type AxiosError} from 'axios';

import Orders from './src/pages/Orders';
import Settings from './src/pages/Settings';
import Delivery from './src/pages/Delivery';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import type {RootState} from './src/store/reducer';
import userSlice from './src/slices/userSlice';
import {useAppDispatch} from './src/store';
import useSocket from './src/hooks/useSocket';
import Config from 'react-native-config';
import orderSlice from './src/slices/orderSlice';

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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
  const dispatch = useAppDispatch();
  const [socket, disconnect] = useSocket();

  useEffect(() => {
    const callback = (data: any) => dispatch(orderSlice.actions.addOrder(data));
    if (socket && isLoggedIn) {
      socket.emit('acceptOrder', 'hello');
      socket.on('order', callback);
    }

    return () => {
      if (socket) {
        socket.off('order', callback);
      }
    };
  }, [isLoggedIn, socket, dispatch]);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('isLoggedIn', isLoggedIn);
      disconnect();
    }
  }, [isLoggedIn, disconnect]);

  const autoLogin = useCallback(async () => {
    try {
      const refreshToken = await EncryptedStorage.getItem('refreshToken');
      if (!refreshToken) {
        return;
      }
      const response = await axios.post(
        `${Config.API_URL_2}/refreshToken`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );
      dispatch(
        userSlice.actions.setUser({
          name: response.data.data.name,
          email: response.data.data.email,
          accessToken: response.data.data.accessToken,
        }),
      );
    } catch (error) {
      console.error(error);
      const response = (error as AxiosError).response;
      const data = response?.data as any;
      if (data.code === 'expired') {
        Alert.alert('알림', '다시 로그인 해주세요');
      }
    }
  }, [dispatch]);

  useEffect(() => {
    autoLogin();
  }, [autoLogin]);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen name="Orders" component={Orders} />
          <Tab.Screen
            name="Delivery"
            component={Delivery}
            options={{headerShown: false}}
          />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
