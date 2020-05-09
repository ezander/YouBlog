import React, { useRef } from "react";
import {
  Button,
  Text,
  Input,
  ThemeProvider,
  Icon,
} from "react-native-elements";
import { useDispatch } from "react-redux";
import Screen from "../components/Screen";
import * as AuthActions from "../store/AuthActions";
import { useIsLoggedIn, useAuthState } from "../components/AuthItem";
import { View, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const SCREEN_WIDTH = Dimensions.get("window").width;

// @ts-ignore
export default function LoginScreen({ navigation }) {
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
  // function handleSignUp() {
  //     dispatch(AuthActions.doSignUp(email, password))
  // }

  const usernameInput = useRef(null);
  const email2Input = useRef(null);
  const password2Input = useRef(null);
  const confirmPassword2Input = useRef(null);

  return (
    <Screen>
      <ScrollView>
        {authState.error && <Text>{JSON.stringify(authState.error)}</Text>}
        <Input
          placeholder="email@address.com"
          label="Your Email Address"
          leftIcon={{ name: "chevron-left" }}
        />

        <View>
          <ThemeProvider
            theme={{
              Input: {
                containerStyle: {
                  width: SCREEN_WIDTH - 50,
                },
                inputContainerStyle: {
                  borderRadius: 40,
                  borderWidth: 1,
                  borderColor: "rgba(110, 120, 170, 1)",
                  height: 50,
                  marginVertical: 10,
                },
                placeholderTextColor: "rgba(110, 120, 170, 1)",
                inputStyle: {
                  marginLeft: 10,
                  color: "white",
                },
                keyboardAppearance: "light",
                blurOnSubmit: false,
              },
              Icon: {
                color: "rgba(110, 120, 170, 1)",
                size: 25,
              },
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(46, 50, 72, 1)",
                width: SCREEN_WIDTH - 10,
                alignItems: "center",
                paddingBottom: 30,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 30,
                  marginVertical: 10,
                  fontWeight: "300",
                }}
              >
                Sign up
              </Text>
              <Input
                leftIcon={<Icon name="user" type="simple-line-icon" />}
                placeholder="Username"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                ref={usernameInput}
                onSubmitEditing={() => {
                  email2Input.current.focus();
                }}
              />
              <Input
                leftIcon={
                  <Icon name="email-outline" type="material-community" />
                }
                placeholder="Email"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                ref={email2Input}
                onSubmitEditing={() => {
                  password2Input.current.focus();
                }}
              />
              <Input
                leftIcon={<Icon name="lock" type="simple-line-icon" />}
                placeholder="Password"
                autoCapitalize="none"
                secureTextEntry={true}
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="next"
                ref={password2Input}
                onSubmitEditing={() => {
                  confirmPassword2Input.current.focus();
                }}
              />
              <Input
                leftIcon={<Icon name="lock" type="simple-line-icon" />}
                placeholder="Confirm Password"
                autoCapitalize="none"
                keyboardAppearance="light"
                secureTextEntry={true}
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="done"
                ref={confirmPassword2Input}
                blurOnSubmit
              />
            </View>
          </ThemeProvider>
        </View>
        <Text />
        <Button title="Login AA" onPress={handleLoginAA} />
        <Text />
        <Button title="Login (w. Error)" onPress={handleLoginErr} />
        <Text />
        <Button title="Login CC" onPress={handleLoginCC} />
      </ScrollView>
    </Screen>
  );
}
