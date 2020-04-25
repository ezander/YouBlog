import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import BlogListScreen from './screens/BlogListScreen';
import BlogReadScreen from './screens/BlogReadScreen';

const Stack = createStackNavigator()

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="BlogList" component={BlogListScreen} options={{title: "All Blog Entries"}}/>
      <Stack.Screen name="BlogEntry" component={BlogReadScreen} options={{title: "Single Blog Entry"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );

}
