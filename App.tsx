import { createStackNavigator, StackHeaderProps } from "@react-navigation/stack";
import { AppLoading } from "expo";
import React, { useState } from "react";
import { Text, ThemeProvider } from "react-native-elements";
import ErrorBoundary from "react-native-error-boundary";
import "react-native-gesture-handler"; // must be the first import
import { Provider } from "react-redux";
import { LinkingNavigationContainer } from "./components/LinkingNavigationContainer";
import NavHeader from "./components/NavHeader";
import { defaultTheme, loadFonts } from "./config/Theming";
import { urlPrefixes } from "./model/Sharing";
import BlogEditScreen, { BlogEditParams } from "./screens/BlogEditScreen";
import BlogListScreen from "./screens/BlogListScreen";
import BlogReadScreen, { BlogReadParams } from "./screens/BlogReadScreen";
import LoginScreen from "./screens/LoginScreen";
import { delay } from "./src/AsyncTools";
import Warnings from "./src/Warnings";
import { doRestoreLogin } from "./store/AuthActions";
import { store } from "./store/index";


Warnings.ignore("Setting a timer");

export type RootStackParamList = {
  BlogList: undefined;
  BlogRead: BlogReadParams;
  BlogEdit: BlogEditParams;
  Login: undefined;
  DebugScreen: undefined;
};

const DummyStack = createStackNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const navigatorOptions = {
  screenOptions: {
    header: (headerProps: StackHeaderProps) => (
      <NavHeader headerProps={headerProps} />
    ),
  },
};

const linking = {
  prefixes: urlPrefixes,
  config: {
    Dummy: {
      initialRouteName: "BlogList",
      screens: {
        BlogList: {
          path: "list",
        },
        BlogRead: {
          path: "post/:id",
        },
      },
    },
  },
};

function RootStackNavigator() {
  // const DebugScreen = (props: any) => <LoginScreen showDebugButtons={true} {...props}/>
  const DebugScreen = (props: any) => <TestScreen {...props}/>
  const testing = !true
   
  return (
    <Stack.Navigator {...navigatorOptions}>
      {testing && <Stack.Screen
        name="DebugScreen"
        component={DebugScreen}
        options={{ title: "Testing" }}
      />}
      <Stack.Screen
        name="BlogList"
        component={BlogListScreen}
        options={{ title: "All Blog Entries" }}
      />
      <Stack.Screen
        name="BlogRead"
        component={BlogReadScreen}
        options={{ title: "Single Blog Entry" }}
      />
      <Stack.Screen
        name="BlogEdit"
        component={BlogEditScreen}
        options={{ title: "Edit Blog Entry" }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Log in or Sign up" }}
      />
    </Stack.Navigator>
  );
}

async function performStartupStuff() {
  // this is all kind of silly, but that's only
  // because firebase initialization is slow and stupid...
  const results = await Promise.all([
    store.dispatch<any>(doRestoreLogin()),
    delay(100),
    loadFonts(),
  ]);
  return; // results;
  // await store.dispatch(doRestoreLogin());
  // await delay(100);
  // await store.dispatch(doRestoreLogin());
}

export default function App() {
  const [startUpFinished, setStartUpFinished] = useState(false);

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
      <ThemeProvider theme={defaultTheme}>
        <Provider store={store}>
          <LinkingNavigationContainer
            linking={linking}
            fallback={<Text>Loading...</Text>}
          >
            <DummyStack.Navigator screenOptions={{ headerShown: false }}>
              <DummyStack.Screen name="Dummy" component={RootStackNavigator} />
            </DummyStack.Navigator>
          </LinkingNavigationContainer>
        </Provider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
