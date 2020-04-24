import React, { useState, useCallback } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import Screen from './components/Screen';
import BlogListScreen from './screens/BlogListScreen';
import LoadingScreen from './components/LoadingScreen';
import { useAsyncAction, executeDelayed } from './src/AsyncTools';

function StartScreen() {
  return (<Screen>
    <Text>This is the start screen</Text>
  </Screen>)
}

const Stack = createStackNavigator()


let counter = 0
export default function App() {

  //console.clear()
  const foo1 = useCallback(async () => {
    await executeDelayed(1000)
    return "foo1"
  }, [])
  const { hasRun, isWorking, error, result } = useAsyncAction(foo1)

  ++counter
  console.log({ counter, hasRun, isWorking, error, result })

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {
          !hasRun || isWorking ?
            <Stack.Screen name="Start">{() => <LoadingScreen text="Loading blog entries..." />}</Stack.Screen> :
            <Stack.Screen name="Blog entries" component={BlogListScreen} />
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}
