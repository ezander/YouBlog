import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { Button, Overlay, Text } from "react-native-elements";
import { useDispatch } from "react-redux";
import { RootStackParamList } from "../App";
import Screen from "../components/Screen";
import TabView from "../components/TabView";
import { Colors, defaultBackgroundImage, loginTheme } from "../config/Theming";
import { delay } from "../src/AsyncTools";
import { authLogger } from "../config/Logging";
import { useAuthState } from "../store";
import * as AuthActions from "../store/AuthActions";
import LoginForm from "./LoginForm";

interface LoginScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "Login">;
}

export default function LoginScreen({
  navigation,
}: LoginScreenProps) {
  const authState = useAuthState();
  const dispatch = useDispatch();

  const [isWorking, setIsWorking] = useState(false);
  const [workingOn, setWorkingOn] = useState("");
  const [authError, setAuthError] = useState<any>();

  function handleCatChange(category: number, title: string) {
    navigation.setOptions({ title });
  }

  async function handleAuthAction(action: any, mode: string) {
    setIsWorking(true);
    try {
      await delay(1);
      await dispatch(action);
      setAuthError(false);
      navigation.goBack();
    } catch (error) {
      authLogger.info(`Authentication error: "${error?.message}"`);
      authLogger.debug(`Detaild auth error: "${JSON.stringify(error)}"`);
      setAuthError(error);
    } finally {
      setIsWorking(false);
    }
  }

  async function handleLogin(email: string, password: string) {
    setWorkingOn("Logging you in...");
    handleAuthAction(AuthActions.doLogin(email, password), "Login");
  }

  async function handleSignUp(
    email: string,
    password: string,
    username: string
  ) {
    setWorkingOn("Signing you up...");
    handleAuthAction(
      AuthActions.doSignUp(email, password, username),
      "Sign up"
    );
  }

  if (authError) {
    Alert.alert("Authentication Error", authError.message);
    setAuthError(undefined);
  }

  return (
    <Screen backgroundImage={defaultBackgroundImage}>
      <Overlay
        isVisible={isWorking}
        overlayStyle={{
          backgroundColor: Colors.paperColor,
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <View>
          <Text {...loginTheme.Working}>{workingOn}</Text>
          <Text></Text>
          <ActivityIndicator size="large" />
        </View>
      </Overlay>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {authState.error && <Text>{JSON.stringify(authState.error)}</Text>}
        <TabView
          disabled={false}
          titles={["Login", "Sign up"]}
          onChangeCat={handleCatChange}
        >
          <LoginForm isSignUp={false} onLogin={handleLogin} />
          <LoginForm isSignUp={true} onSignUp={handleSignUp} />
        </TabView>

      </View>
    </Screen>
  );
}
