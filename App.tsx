import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Screen from './components/Screen';



export default function App() {
  return (
    <NavigationContainer>
      <Screen>
        <Text>This is the start screen</Text>
      </Screen>
    </NavigationContainer>
  );
}
