import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import LoginScreen from './Login/LoginScreen';
import NoteListScreen from './Home/NoteListScreen';
import {RootStackParamList} from './Navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import NoteAddScreen from './Home/NoteAddScreen';

function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setInitialRoute('NoteList');
        } else {
          setInitialRoute('Login');
        }
      } catch (error) {
        setInitialRoute('Login');
      } finally {
        setIsLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (isLoading || !initialRoute) {
    return (
      <LinearGradient
        style={styles.loaderContainer}
        colors={['rgb(85, 0, 255)', 'rgb(44, 14, 105)']}>
        <ActivityIndicator size="large" color="rgb(255, 0, 0)" />
      </LinearGradient>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="NoteList"
          component={NoteListScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="NoteAdd"
          component={NoteAddScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
