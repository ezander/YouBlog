import React, { useState, useCallback } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import Screen from '../components/Screen';
import BlogListScreen from '../screens/BlogListScreen';
import LoadingScreen from '../components/LoadingScreen';
import { useAsyncAction, delay } from '../src/AsyncTools';

import firebaseConfig from '../firebaseConfig.json'
import TextScreen from '../components/TextScreen';
import { signUpUser } from '../src/FirebaseAuthTools';


const Stack = createStackNavigator()


let counter = 0
export default function App() {

  console.log(firebaseConfig)
  
  const email = "elmar.zander5@googlemail.com"
  const password = "29347"
  const signUpUserFunc = useCallback(
    () => signUpUser({ email, password }, firebaseConfig),
    [email, password, firebaseConfig])

  const { hasRun, isWorking, error, result } = useAsyncAction(signUpUserFunc)

  ++counter
  console.log({ counter, hasRun, isWorking, error, result })


  return (
      <Stack.Navigator>
        {
          !hasRun || isWorking ?
            <Stack.Screen name="Start">{() => <LoadingScreen text="Loading blog entries..." />}</Stack.Screen> :
            !!error ?
              <Stack.Screen name="Start">{() => <TextScreen text={`An error occurred: ${error}`} />}</Stack.Screen> :
              <Stack.Screen name="Blog entries" component={BlogListScreen} />
        }
      </Stack.Navigator>
  );
}
