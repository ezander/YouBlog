import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { Button, Text, Overlay } from "react-native-elements";
import { useDispatch } from "react-redux";
import { RootStackParamList } from "../App";
import { useAuthState, useIsLoggedIn } from "../components/AuthItem";
import Screen from "../components/Screen";
import * as AuthActions from "../store/AuthActions";
import LoginForm from "./LoginForm";
import TabView from "../components/TabView";
import { delay } from "../src/AsyncTools";
import { Colors, loginTheme } from "../config/Theming";

interface LoginScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "Login">;
  showDebugButtons?: boolean;
}

export default function LoginScreen({
  navigation,
  showDebugButtons,
}: LoginScreenProps) {
  const isLoggedIn = useIsLoggedIn();
  const authState = useAuthState();
  const dispatch = useDispatch();

  const [isWorking, setIsWorking] = useState(false);
  const [workingOn, setWorkingOn] = useState("");
  const [authError, setAuthError] = useState<any>();

  const handleLoginAA = () =>
    dispatch(AuthActions.doLogin("aa@testmail.com", "test1234"));
  const handleLoginCC = () =>
    dispatch(AuthActions.doLogin("cc@testmail.com", "test1234"));
  const handleLoginErr = () =>
    dispatch(AuthActions.doLogin("cc@testmail.com", "test1235"));

  function handleCatChange(category: number, title: string) {
    navigation.setOptions({ title });
  }

  async function handleAuthAction(action: any, mode: string) {
    setIsWorking(true);
    try {
      await delay(200);
      await dispatch(action);
      setAuthError(false);
      navigation.goBack();
    } catch (error) {
      console.log(JSON.stringify(error.message))
      console.log(JSON.stringify(error))
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

  if( authError ) {
    Alert.alert("Authentication Error", authError.message)
    setAuthError(undefined)
  }

  return (
    <Screen backgroundImage={require("../assets/handwriting-1362879_1280.jpg")}>
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

        {showDebugButtons && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignSelf: "stretch",
            }}
          >
            <Button title="AA" onPress={handleLoginAA} />
            <Button title="CC" onPress={handleLoginCC} />
            <Button title="Error" onPress={handleLoginErr} />
          </View>
        )}
      </View>
    </Screen>
  );
}
