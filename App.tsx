import { NavigationContainer, useLinking, NavigationContainerRef, NavigationState } from '@react-navigation/native';
import { createStackNavigator, StackHeaderProps } from '@react-navigation/stack';
import React, { useEffect, useCallback, useRef } from 'react';
import NavHeader from './components/NavHeader';
import BlogListScreen from './screens/BlogListScreen';
import BlogReadScreen from './screens/BlogReadScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { Linking } from 'expo';
import { Text } from 'react-native-elements';
import { LinkingOptions } from '@react-navigation/native/lib/typescript/src/types';

const Stack = createStackNavigator()

const navigatorOptions = {
  screenOptions: {
    header: (headerProps: StackHeaderProps) => <NavHeader headerProps={headerProps} />
  }
}

const prefix = Linking.makeUrl('/')


type LinkingNavigationContainerProps<Props> = Props & {
  linking: LinkingOptions,
  fallback?: JSX.Element,
}

function LinkingNavigationContainer<Props>(
  { linking, fallback, ...props }: LinkingNavigationContainerProps<Props>
) {
  const ref = useRef()
  // @ts-ignore
  const { getInitialState } = useLinking(ref, linking)
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<NavigationState>();

  React.useEffect(() => {
    getInitialState()
      .catch(() => { })
      .then(state => {
        if (state !== undefined) {
          // @ts-ignore
          setInitialState(state);
        }

        setIsReady(true);
      });
  }, [getInitialState]);

  if (!isReady) {
    return fallback;
  }
  // @ts-ignore
  return <NavigationContainer initialState={initialState} ref={ref} {...props} />
}

export default function App() {

  function handleUrl(url: string, initial: boolean = false) {
    // this.setState({ url });
    let { path, queryParams } = Linking.parse(url);
    // if( !path ) return
    // alert(`Linked to app with path: ${path} and data: ${JSON.stringify(queryParams)} (${initial})`);
    console.log(`Linked to app with path: ${path} and data: ${JSON.stringify(queryParams)} (${initial})`);
  };


  const linking = {
    prefixes: [prefix],
    config: {
      "BlogList": "/",
      "BlogEntry": {
        path: 'post/:id',
        param: {
          image_url: undefined
        }
        // parse: {
        //   title: ()=>undefined,
        //   image_url: ()=>undefined
        // }
      }
    }
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
