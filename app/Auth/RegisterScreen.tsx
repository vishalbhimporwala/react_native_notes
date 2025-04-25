import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import InputField from '../Components/InputField';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../Navigation/types';
import {useNavigation} from '@react-navigation/native';
import {Axios, AxiosError} from 'axios';
import {registerUser} from '../services/auth';
import {ErrorModel} from '../models/errorModel';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = () => {
  type ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<ScreenNavigationProp>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const lastNameRef = useRef<TextInput>(null);
  const userNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const isValidate = () => {
    let isValid = true;
    let newError = {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      confirmPassword: '',
    };
    setErrors(newError);
    if (!firstName.trim()) {
      newError.firstName = 'Please enter firstname';
      isValid = false;
    }

    if (!lastName.trim()) {
      newError.lastName = 'Please enter lastName';
      isValid = false;
    }

    if (!userName.trim()) {
      newError.userName = 'Please enter userName';
      isValid = false;
    }

    if (!userName.trim()) {
      newError.userName = 'Please enter userName';
      isValid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      newError.email = 'Please enter valid email';
      isValid = false;
    }

    if (!password || !confirmPassword) {
      newError.confirmPassword = 'Please enter valid password';
      isValid = false;
    }

    if (password != confirmPassword) {
      newError.confirmPassword = 'Please confirm password';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newError);
    }
    return isValid;
  };

  const handleRegister = async () => {
    if (!isValidate()) {
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
        password: confirmPassword,
      };
      const response = await registerUser(payload);
      console.log('register api response : ', JSON.stringify(response.data));
      const accessToken = response.headers['accesstoken'];
      AsyncStorage.setItem('accessToken', accessToken);
      AsyncStorage.setItem('user', JSON.stringify(response.data.data));
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        console.log('register response : ', user);
        console.log(
          'register response headers : ',
          await AsyncStorage.getItem('accessToken'),
        );
        navigation.replace('NoteList');
        // navigation.reset({index: 0, routes: [{name: 'NoteList'}]});
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        'reister api fail : ',
        JSON.stringify(axiosError.response?.data),
      );
      const errorModel = axiosError.response?.data as ErrorModel;
      setErrors({
        confirmPassword: errorModel.data.message,
        email: '',
        firstName: '',
        lastName: '',
        userName: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <LinearGradient
        style={styles.fullScreen}
        colors={['rgb(85, 0, 255)', 'rgb(44, 14, 105)']}>
        <ScrollView
          style={{width: '100%'}}
          contentContainerStyle={styles.scrollContainer}>
          <View style={styles.registerContainer}>
            <Text style={styles.registerHeader}>Register</Text>

            <InputField
              placeHolder="Enter first name"
              text={firstName}
              onChangeText={setFirstName}
              textColor="#000"
              inputType="default"
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />
            {errors.firstName ? (
              <Text style={{color: 'rgb(255, 0, 0)'}}>{errors.firstName}</Text>
            ) : null}

            <InputField
              inputRef={lastNameRef}
              placeHolder="Enter last name"
              text={lastName}
              onChangeText={setLastName}
              textColor="#000"
              inputType="default"
              onSubmitEditing={() => userNameRef.current?.focus()}
            />
            {errors.lastName ? (
              <Text style={{color: 'rgb(255, 0, 0)'}}>{errors.lastName}</Text>
            ) : null}

            <InputField
              inputRef={userNameRef}
              placeHolder="Enter username"
              text={userName}
              onChangeText={setUserName}
              textColor="#000"
              inputType="default"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
            {errors.userName ? (
              <Text style={{color: 'rgb(255, 0, 0)'}}>{errors.userName}</Text>
            ) : null}

            <InputField
              inputRef={emailRef}
              placeHolder="Enter email"
              text={email}
              onChangeText={setEmail}
              textColor="#000"
              inputType="email-address"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            {errors.email ? (
              <Text style={{color: 'rgb(255, 0, 0)'}}>{errors.email}</Text>
            ) : null}

            <InputField
              inputRef={passwordRef}
              placeHolder="Password"
              text={password}
              onChangeText={setPassword}
              textColor="#000"
              secureTextEntry={true}
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            />

            <InputField
              inputRef={confirmPasswordRef}
              placeHolder="Confirm Password"
              text={confirmPassword}
              onChangeText={setConfirmPassword}
              textColor="#000"
              secureTextEntry={true}
              keyboardSubmit="done"
              onSubmitEditing={() => handleRegister()}
            />
            {errors.confirmPassword ? (
              <Text style={{color: 'rgb(255, 0, 0)'}}>
                {errors.confirmPassword}
              </Text>
            ) : null}

            <TouchableOpacity
              disabled={isLoading}
              style={styles.registerButton}
              onPress={() => handleRegister()}>
              {isLoading ? (
                <ActivityIndicator size="small" color="rgb(255, 0, 0)" />
              ) : (
                <Text style={styles.registerButtonText}>Register</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default RegisterScreen;

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
  scrollContainer: {
    flexGrow: 1, // Ensures content stretches to fill the available space
    justifyContent: 'center', // Centers the content vertically
    alignItems: 'center', // Centers the content horizontally
  },
  registerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    alignSelf: 'center', // Ensures it's centered on the screen
  },
  registerHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: 'rgb(85, 0, 255)',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
    alignItems: 'center',
  },
  registerButtonText: {
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
