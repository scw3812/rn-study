import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';

import {RootStackParamList} from '../../App';
import DismissKeyboardView from '../components/DismissKeyboardView';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const SignUp = ({navigation}: SignUpScreenProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const onChangeEmail = useCallback(
    (text: string) => setEmail(text.trim()),
    [],
  );
  const onChangeName = useCallback((text: string) => setName(text.trim()), []);
  const onChangePassword = useCallback(
    (text: string) => setPassword(text.trim()),
    [],
  );
  const canGoNext = email && name && password && !loading;

  const onSubmit = useCallback(async () => {
    if (!canGoNext) {
      return Alert.alert('이메일/이름/비밀번호를 입력해주세요');
    }
    try {
      setLoading(true);
      const response = await axios.post(`${Config.API_URL}user`, {
        email,
        name,
        password,
      });
      console.log(response);
    } catch (err) {
      const errorResponse = (err as AxiosError).response;
      console.error(errorResponse);
      if (errorResponse) {
        Alert.alert('알림', (errorResponse.data as any).message ?? '');
      }
    } finally {
      setLoading(false);
    }
  }, [canGoNext, email, name, password]);

  return (
    <DismissKeyboardView>
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
          onSubmitEditing={() => nameRef.current?.focus()}
          blurOnSubmit={false}
          ref={emailRef}
          clearButtonMode="while-editing"
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.textInput}
          placeholder="이름을 입력해주세요"
          value={name}
          onChangeText={onChangeName}
          importantForAutofill="yes"
          autoComplete="name"
          textContentType="name"
          ref={nameRef}
          onSubmitEditing={() => passwordRef.current?.focus()}
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
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.loginButtonText}>회원가입</Text>
          )}
        </Pressable>
      </View>
    </DismissKeyboardView>
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

export default SignUp;
