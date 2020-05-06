import { createStackNavigator, StackHeaderProps } from '@react-navigation/stack';
import { Linking } from 'expo';
import React from 'react';
import { Text } from 'react-native-elements';
import ErrorBoundary from 'react-native-error-boundary';
import NavHeader from './components/NavHeader';
import { LinkingNavigationContainer } from './LinkingNavigationContainer';
import BlogListScreen from './screens/BlogListScreen';
import BlogReadScreen from './screens/BlogReadScreen';
const Stack = createStackNavigator()

const navigatorOptions = {
  screenOptions: {
    header: (headerProps: StackHeaderProps) => <NavHeader headerProps={headerProps} />
  }
}

const linking = {
  prefixes: [
    Linking.makeUrl('/'),
    'https://expo.io/@ezander/YouBlog',
    'https://zandere.de/youblog'
  ],
  config: {
    "BlogList": "list",
    "BlogEntry": {
      path: 'post/:urlId'
    }
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <LinkingNavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <Stack.Navigator {...navigatorOptions}>
          <Stack.Screen
            name="BlogList"
            component={BlogListScreen}
            options={{ title: "All Blog Entries" }} />
          <Stack.Screen
            name="BlogEntry"
            component={BlogReadScreen}
            options={{ title: "Single Blog Entry" }} />
        </Stack.Navigator>
      </LinkingNavigationContainer>
    </ErrorBoundary >
  );

}
