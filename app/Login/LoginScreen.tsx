import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {use, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import InputField from '../Components/InputField';
import LinearGradient from 'react-native-linear-gradient';
import {loginUser} from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useNavigation,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../Navigation/types';
import {AxiosError} from 'axios';

const LoginScreen = () => {
  type LoginScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'NoteList'
  >;

  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [userNameOrEmail, setUserNameOrEmail] = useState('VishalBhimpor');
  const [password, setPassword] = useState('vishal123');
  const passwordRef = useRef<TextInput>(null);
  const [errors, setErrors] = useState({emailOrUsername: '', password: ''});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    let isValid = true;
    const newErrors = {emailOrUsername: '', password: ''};

    if (!userNameOrEmail.trim()) {
      newErrors.emailOrUsername = 'Email or Username is required';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    let loginPayload;

    if (/\S+@\S+\.\S+/.test(userNameOrEmail)) {
      loginPayload = {
        email: userNameOrEmail,
        password: password,
      };
    } else {
      loginPayload = {
        userName: userNameOrEmail,
        password: password,
      };
    }
    console.log('login payload : ', loginPayload);
    try {
      setIsLoading(true);
      const response = await loginUser(loginPayload);
      const accessToken = response.headers['accesstoken'];
      AsyncStorage.setItem('accessToken', accessToken);
      AsyncStorage.setItem('user', JSON.stringify(response.data.data));
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        console.log('login response : ', user);
        console.log(
          'login response headers : ',
          await AsyncStorage.getItem('accessToken'),
        );
        navigation.reset({index: 0, routes: [{name: 'NoteList'}]});
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const newErrors = {emailOrUsername: '', password: axiosError.message};
      setErrors(newErrors);
      console.error('Login error : ', axiosError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <LinearGradient
        style={styles.fullScreen}
        colors={['rgb(85, 0, 255)', 'rgb(44, 14, 105)']}>
        <Text style={styles.title}>Welcome Back 👋</Text>

        <View style={styles.loginContainer}>
          <Text style={styles.loginHeader}>Login</Text>

          <InputField
            placeHolder="Username or Email"
            text={userNameOrEmail}
            onChangeText={setUserNameOrEmail}
            textColor="#000"
            inputType="email-address"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          {errors.emailOrUsername ? (
            <Text style={{color: 'rgb(255, 0, 0)'}}>
              {errors.emailOrUsername}
            </Text>
          ) : null}

          <InputField
            inputRef={passwordRef}
            placeHolder="Password"
            text={password}
            onChangeText={setPassword}
            textColor="#000"
            secureTextEntry={true}
            keyboardSubmit="done"
            onSubmitEditing={() => console.log('Login')}
          />
          {errors.password ? (
            <Text style={{color: 'rgb(255, 0, 0)'}}>{errors.password}</Text>
          ) : null}

          <TouchableOpacity
            disabled={isLoading}
            style={styles.loginButton}
            onPress={() => handleLogin()}>
            {isLoading ? (
              <ActivityIndicator size="small" color="rgb(255, 0, 0)" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotText}>Register</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 16,
  },
  loginContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  loginHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: 'rgb(85, 0, 255)',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  forgotText: {
    color: '#555',
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});
