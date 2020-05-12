import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-elements";
import { useDispatch } from "react-redux";
import { RootStackParamList } from "../App";
import { useAuthState, useIsLoggedIn } from "../components/AuthItem";
import Screen from "../components/Screen";
import * as AuthActions from "../store/AuthActions";
import LoginForm from "./LoginForm";
import TabView from "./TabView";

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

  // if (isLoggedIn) {
  //   navigation.goBack();
  // }

  const handleLoginAA = () =>
    dispatch(AuthActions.doLogin("aa@testmail.com", "test1234"));
  const handleLoginCC = () =>
    dispatch(AuthActions.doLogin("cc@testmail.com", "test1234"));
  const handleLoginErr = () =>
    dispatch(AuthActions.doLogin("cc@testmail.com", "test1235"));

  function handleCatChange(category: number, title: string) {
    navigation.setOptions({ title });
  }

  // function handleSignUp() {
  //     dispatch(AuthActions.doSignUp(email, password))
  // }

  return (
    <Screen backgroundImage={require("../assets/handwriting-1362879_1280.jpg")}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {authState.error && <Text>{JSON.stringify(authState.error)}</Text>}
        <TabView
          disabled={false}
          titles={["Login", "Sign up"]}
          onChangeCat={handleCatChange}
        >
          <LoginForm isSignUp={false} />
          <LoginForm isSignUp={true} />
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
