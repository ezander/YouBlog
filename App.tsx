import { createStackNavigator, StackHeaderProps } from '@react-navigation/stack';
import { Linking } from 'expo';
import React from 'react';
import { Text } from 'react-native-elements';
import ErrorBoundary from 'react-native-error-boundary';
import NavHeader from './components/NavHeader';
import { LinkingNavigationContainer } from './LinkingNavigationContainer';
import BlogEditScreen from './screens/BlogEditScreen';
import BlogListScreen from './screens/BlogListScreen';
import BlogReadScreen from './screens/BlogReadScreen';
import LoginScreen from './screens/LoginScreen';

import { createStore, combineReducers, applyMiddleware, Middleware } from 'redux'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import ReduxLogger from 'redux-logger'
import { authReducer } from './store/AuthReducer'


const rootReducer = combineReducers({
  auth: authReducer,
  // blog: blogReducer,
  // edit: editReducer
})
const middleware = [ReduxThunk, ReduxLogger]
const store = createStore(rootReducer, applyMiddleware(...middleware))


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
      <Provider store={store}>
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
            <Stack.Screen
              name="BlogEdit"
              component={BlogEditScreen}
              options={{ title: "Edit Blog Entry" }} />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: "Log in or Sign up" }} />
          </Stack.Navigator>
        </LinkingNavigationContainer>
      </Provider>
    </ErrorBoundary >
  );

}
