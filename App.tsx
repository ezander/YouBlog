import { NavigationContainer, useLinking, NavigationContainerRef, NavigationState, NavigationContainerProps } from '@react-navigation/native';
import { createStackNavigator, StackHeaderProps } from '@react-navigation/stack';
import React, { useEffect, useCallback, useRef } from 'react';
import NavHeader from './components/NavHeader';
import BlogListScreen from './screens/BlogListScreen';
import BlogReadScreen from './screens/BlogReadScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { Linking } from 'expo';
import { Text } from 'react-native-elements';
import { LinkingOptions } from '@react-navigation/native/lib/typescript/src/types';
import {getStateFromPath} from '@react-navigation/native'
const Stack = createStackNavigator()

const navigatorOptions = {
  screenOptions: {
    header: (headerProps: StackHeaderProps) => <NavHeader headerProps={headerProps} />
  }
}

const prefix = Linking.makeUrl('/')


type LinkingNavigationContainerProps = NavigationContainerProps & {
  linking: LinkingOptions,
  fallback?: JSX.Element
}

function LinkingNavigationContainer<Props>(
  { linking, fallback, ...props }: LinkingNavigationContainerProps
) {
  const ref = useRef<NavigationContainerRef>(null)
  const { getInitialState } = useLinking(ref, linking)
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<NavigationState>();

  React.useEffect(() => {
    getInitialState()
      .catch(() => { })
      .then(state => {
        if (state !== undefined) {
          // @ts- ignore
          setInitialState(state);
        }

        setIsReady(true);
      });
  }, [getInitialState]);

  if (!isReady) {
    return fallback;
  }
  return <NavigationContainer initialState={initialState} ref={ref} {...props} />
}

export default function App() {

  const linking = {
    prefixes: [prefix],
    config: {
      "BlogList": "list",
      "BlogEntry": {
        path: 'post/:urlId'
      }
    },
    getStateFromPath: (path, options) => {
      // Return a state object here
      // You can also reuse the default logic by importing `getStateFromPath` from `@react-navigation/native`
      console.log("getStateFromPath: ", path, options)

      const state = getStateFromPath(path, options)
      console.log("State: ", state)
      return state
    },
  }


  return (
    <ErrorBoundary>
      <LinkingNavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <Stack.Navigator {...navigatorOptions}>
          <Stack.Screen name="BlogList" component={BlogListScreen} options={{ title: "All Blog Entries" }} />
          <Stack.Screen name="BlogEntry" component={BlogReadScreen} options={{ title: "Single Blog Entry" }} />
        </Stack.Navigator>
      </LinkingNavigationContainer>
    </ErrorBoundary >
  );

}
