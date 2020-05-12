import "react-native-gesture-handler";
import React, { useState } from "react";

import {
  createStackNavigator,
  StackHeaderProps,
} from "@react-navigation/stack";
import { AppLoading, Linking } from "expo";
import { Text, ThemeProvider } from "react-native-elements";
import ErrorBoundary from "react-native-error-boundary";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import ReduxThunk from "redux-thunk";
import { LinkingNavigationContainer } from "./components/LinkingNavigationContainer";
import NavHeader from "./components/NavHeader";
import BlogEditScreen, { BlogEditParams } from "./screens/BlogEditScreen";
import BlogListScreen from "./screens/BlogListScreen";
import BlogReadScreen, { BlogReadParams } from "./screens/BlogReadScreen";
import LoginScreen from "./screens/LoginScreen";
import { delay } from "./src/AsyncTools";
import Warnings from "./src/Warnings";
import { doRestoreLogin } from "./store/AuthActions";
import { authReducer } from "./store/AuthReducer";
import { loadFonts, defaultTheme } from "./config/Theming";
import LoginForm from "./screens/LoginForm";


Warnings.ignore("Setting a timer");

const rootReducer = combineReducers({
  auth: authReducer,
  // blog: blogReducer,
  // edit: editReducer
});
const middleware = [ReduxThunk]; //, ReduxLogger]
const store = createStore(rootReducer, applyMiddleware(...middleware));

export type RootStackParamList = {
  BlogList: undefined;
  BlogRead: BlogReadParams;
  BlogEdit: BlogEditParams;
  Login: undefined;
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
  prefixes: [
    Linking.makeUrl("/"),
    "https://expo.io/@ezander/YouBlog",
    "https://zandere.de/youblog",
  ],
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
  const TestLoginScreen = (props) => <LoginScreen showDebugButtons={true} {...props}/>
  return (
    <Stack.Navigator {...navigatorOptions}>
      <Stack.Screen
        name="LoginTest"
        component={TestLoginScreen}
        options={{ title: "Log in or Sign up" }}
      />
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
    store.dispatch(doRestoreLogin()),
    delay(100),
    loadFonts(),
  ]);
  return// results;
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
