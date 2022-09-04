import {View, Text, Pressable, Alert, StyleSheet} from 'react-native';
import React, {useCallback} from 'react';
import axios, {type AxiosError} from 'axios';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';

import {RootState} from '../store/reducer';
import {useAppDispatch} from '../store/index';
import userSlice from '../slices/userSlice';

const Settings = () => {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const dispatch = useAppDispatch();
  const onLogout = useCallback(async () => {
    try {
      await axios.post(
        `${Config.API_URL_2}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      Alert.alert('알림', '로그아웃 되었습니다');
      dispatch(
        userSlice.actions.setUser({
          name: '',
          email: '',
          accessToken: '',
        }),
      );
      await EncryptedStorage.removeItem('refreshToken');
    } catch (err) {
      const errorResponse = (err as AxiosError).response;
      console.error(errorResponse);
    }
  }, [accessToken, dispatch]);
  return (
    <View>
      <Pressable
        style={[styles.loginButton, styles.loginButtonActive]}
        onPress={onLogout}>
        <Text style={styles.loginButtonText}>로그아웃</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: 'blue',
  },
  loginButtonText: {
    color: 'white',
  },
});

export default Settings;
