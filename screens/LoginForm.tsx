import React, { useRef } from "react";
import { View } from "react-native";
import { Button, Icon, Text, Input } from "react-native-elements";
import { useTheme } from "../config/Theming";
import { withTheme } from "react-native-elements";

interface LoginFormProps {
  isSignUp: boolean;
  showTitle?: boolean;
}

export function LoginForm({ isSignUp, showTitle }: LoginFormProps) {
  // @ts-ignore
  const ThemedInput = withTheme(Input, "LoginInput");

  // function ThemedInput(props) {
  //   return <Input theme {...props}/>
  // }
  // const ThemedInput = FormInput
  // @ts-ignore
  const ThemedButton = withTheme(Button, "LoginButton");

  const usernameRef = useRef(null);
  const emailRef = useRef<Input>(null);
  const passwordRef = useRef<Input>(null);
  const confirmPwdRef = useRef<Input>(null);
  const theme = useTheme();

  function handleSubmit() {
    console.log(usernameRef.current)
    const username = usernameRef?.current?.value
    const email = emailRef?.current?.email
    // if( isSignUp )
      alert(`Trying to sign up...\n${username}\n${email}\n${1}}`);

  }

  return (
    <View style={theme.Extra.View}>
      {showTitle && (
        <Text style={theme.Extra.Text}>{isSignUp ? "Sign up" : "Login"}</Text>
      )}
      {isSignUp && (
        <ThemedInput
          leftIcon={<Icon name="user" type="simple-line-icon" />}
          placeholder="Username"
          autoCapitalize="words"
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="next"
          // ref={usernameRef}
          forwardedRef={usernameRef}
          onSubmitEditing={() => {
            console.log(emailRef)
            emailRef.current?.focus();
          }}
        />
      )}
      <ThemedInput
        leftIcon={<Icon name="email-outline" type="material-community" />}
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        returnKeyType="next"
        forwardedRef={emailRef}
        onSubmitEditing={() => {
          passwordRef.current?.focus();
        }}
      />
      <ThemedInput
        leftIcon={<Icon name="lock" type="simple-line-icon" />}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry={true}
        autoCorrect={false}
        keyboardType="default"
        returnKeyType={isSignUp ? "next" : "done"}
        ref={passwordRef}
        onSubmitEditing={() => {
          isSignUp ? confirmPwdRef.current?.focus() : handleSubmit();
        }}
      />
      {isSignUp && (
        <ThemedInput
          leftIcon={<Icon name="lock" type="simple-line-icon" />}
          placeholder="Confirm Password"
          autoCapitalize="none"
          secureTextEntry={true}
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="done"
          ref={confirmPwdRef}
          onSubmitEditing={() => {
            handleSubmit();
          }}
          blurOnSubmit
        />
      )}
      <ThemedButton
        title={isSignUp ? "Sign up" : "Login"}
        containerStyle={{ marginTop: 15 }}
      />
    </View>
  );
}

export default LoginForm;
