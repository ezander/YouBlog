import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackHeaderProps } from '@react-navigation/stack';
import React from 'react';
import NavHeader from './components/NavHeader';
import BlogListScreen from './screens/BlogListScreen';
import BlogReadScreen from './screens/BlogReadScreen';
import ErrorBoundary from './components/ErrorBoundary';

const Stack = createStackNavigator()

const navigatorOptions = {
  screenOptions: {
    header: (headerProps: StackHeaderProps) => <NavHeader headerProps={headerProps} />
  }
}

export default function App() {

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <Stack.Navigator {...navigatorOptions}>
          <Stack.Screen name="BlogList" component={BlogListScreen} options={{ title: "All Blog Entries" }} />
          <Stack.Screen name="BlogEntry" component={BlogReadScreen} options={{ title: "Single Blog Entry" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );

}
