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
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const isLoggedIn = useIsLoggedIn();
  if (isLoggedIn) {
    navigation.goBack();
  }

  const authState = useAuthState();

  const dispatch = useDispatch();

  function handleLoginAA() {
    const email = "aa@testmail.com";
    const password = "test1234";

    dispatch(AuthActions.doLogin(email, password));
  }
  function handleLoginCC() {
    const email = "cc@testmail.com";
    const password = "test1234";

    dispatch(AuthActions.doLogin(email, password));
  }
  function handleLoginErr() {
    const email = "cc@testmail.com";
    const password = "test1235";

    dispatch(AuthActions.doLogin(email, password));
  }

  function handleCatChange(category: number, catTitle: string) {
    navigation.setOptions({ title: catTitle });
  }

  // function handleSignUp() {
  //     dispatch(AuthActions.doSignUp(email, password))
  // }
  const showDebugButtons = !true;

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
