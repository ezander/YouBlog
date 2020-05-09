import { createStackNavigator, StackHeaderProps } from '@react-navigation/stack';
import { Linking, AppLoading } from 'expo';
import React, { useState } from 'react';
import { Text } from 'react-native-elements';
import ErrorBoundary from 'react-native-error-boundary';
import NavHeader from './components/NavHeader';
import { LinkingNavigationContainer } from './components/LinkingNavigationContainer';
import BlogEditScreen from './screens/BlogEditScreen';
import BlogListScreen from './screens/BlogListScreen';
import BlogReadScreen from './screens/BlogReadScreen';
import LoginScreen from './screens/LoginScreen';

import { createStore, combineReducers, applyMiddleware, Middleware } from 'redux'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import ReduxLogger from 'redux-logger'
import { authReducer } from './store/AuthReducer'


import Warnings from './src/Warnings'
import { useAsyncAction, delay } from './src/AsyncTools';
Warnings.ignore('Setting a timer')

const rootReducer = combineReducers({
  auth: authReducer,
  // blog: blogReducer,
  // edit: editReducer
})
const middleware = [ReduxThunk, ReduxLogger]
const store = createStore(rootReducer, applyMiddleware(...middleware))


export type RootStackParamList = {
  BlogList: undefined,
  BlogRead: { id: string, title: string },
  BlogEdit: undefined,
  Login: undefined,
}

const DummyStack = createStackNavigator()
const Stack = createStackNavigator<RootStackParamList>()

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
  // initialRouteName: 'BlogList',
  config: {
    "Foo": {
      initialRouteName: "BlogList",
      screens: {
        "BlogList": {
          path: "list"
        },
        "BlogRead": {
          path: 'post/:id'
        }
      }
    }
  }
}


function RootStackNavigator() {
  return <Stack.Navigator {...navigatorOptions}>
    <Stack.Screen
      name="BlogList"
      component={BlogListScreen}
      options={{ title: "All Blog Entries" }} />
    <Stack.Screen
      name="BlogRead"
      component={BlogReadScreen}
      options={{ title: "Single Blog Entry" }}
      initialParams={{ title: "Foobar" }}
    />

    <Stack.Screen
      name="BlogEdit"
      component={BlogEditScreen}
      options={{ title: "Edit Blog Entry" }} />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ title: "Log in or Sign up" }} />
  </Stack.Navigator>
}

async function performStartupStuff() {
  await delay(100)
}
export default function App() {

  const [startUpFinished, setStartUpFinished] = useState(false)

  if (!startUpFinished) {
    return (
      <AppLoading
        startAsync={performStartupStuff}
        onFinish={() => setStartUpFinished(true)}
        onError={console.warn}
      // autoHideconsoconsole.log(Splash={false}
      />
    );
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <LinkingNavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
          <DummyStack.Navigator screenOptions={{headerShown: false}}>
            <DummyStack.Screen
              name="Foo"
              component={RootStackNavigator} />
          </DummyStack.Navigator>
        </LinkingNavigationContainer>
      </Provider>
    </ErrorBoundary >
  );

}
