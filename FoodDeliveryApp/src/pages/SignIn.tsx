import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';

import {RootStackParamList} from '../../App';
import userSlice from '../slices/userSlice';
import {useAppDispatch} from '../store';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const SignIn = ({navigation}: SignInScreenProps) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const onChangeEmail = useCallback((text: string) => setEmail(text), []);
  const onChangePassword = useCallback((text: string) => setPassword(text), []);
  const canGoNext = email && password;

  const onSubmit = useCallback(async () => {
    if (!canGoNext) {
      return Alert.alert('이메일/비밀번호를 입력해주세요');
    }
    try {
      const response = await axios.post(`${Config.API_URL_2}login`, {
        email,
        password,
      });
      const data = response.data.data;
      dispatch(
        userSlice.actions.setUser({
          name: data.name,
          email: data.email,
          accessToken: data.accessToken,
        }),
      );

      await EncryptedStorage.setItem('refreshToken', data.refreshToken);
    } catch (err) {
      console.log(err);
    }
  }, [canGoNext, email, password, dispatch]);

  const toSignUp = useCallback(
    () => navigation.navigate('SignUp'),
    [navigation],
  );

  return (
    <View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.textInput}
          placeholder="이메일을 입력해주세요"
          value={email}
          onChangeText={onChangeEmail}
          importantForAutofill="yes"
          autoComplete="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false}
          ref={emailRef}
          clearButtonMode="while-editing"
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.textInput}
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChangeText={onChangePassword}
          secureTextEntry
          importantForAutofill="yes"
          autoComplete="password"
          textContentType="password"
          ref={passwordRef}
          onSubmitEditing={onSubmit}
          clearButtonMode="while-editing"
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={
            !canGoNext
              ? styles.logdinButton
              : [styles.logdinButton, styles.loginButtonActive]
          }
          onPress={onSubmit}
          disabled={!canGoNext}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </Pressable>
        <Pressable onPress={toSignUp}>
          <Text>회원가입하기</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    padding: 20,
  },
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  logdinButton: {
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
  buttonZone: {
    alignItems: 'center',
  },
});

export default SignIn;
