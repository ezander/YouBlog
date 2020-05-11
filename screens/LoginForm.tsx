import React, { useRef, useState } from "react";
import { View } from "react-native";
import { Button, Icon, Input, Text } from "react-native-elements";
import { ThemeMerger, useTheme } from "../components/ThemeMerger";
import { loginTheme } from "../config/Theming";

interface LoginFormProps {
  isSignUp: boolean;
  showTitle?: boolean;
}

export function LoginForm({ isSignUp, showTitle }: LoginFormProps) {
  // @ts-ignore
  // const ThemedInput = withTheme(Input, "LoginInput");

  // function ThemedInput(props) {
  //   return <Input theme {...props}/>
  // }
  // const ThemedInput = FormInput
  // @ts-ignore
  // const ThemedButton = withTheme(Button, "LoginButton");

  const usernameRef = useRef(null);
  const emailRef = useRef<Input>(null);
  const passwordRef = useRef<Input>(null);
  const confirmPwdRef = useRef<Input>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const theme = useTheme() as any;

  function handleSubmit() {
    if (isSignUp)
      alert(
        `Trying to sign up...\n${username}\n${email}\n${password}\n${confirmPwd}`
      );
    else alert(`Trying to login...\n${email}\n${password}`);
  }

  return (
    <ThemeMerger theme={loginTheme}>
      <View style={theme.Extra.View}>
        {showTitle && (
          <Text style={theme.Extra.Text}>{isSignUp ? "Sign up" : "Login"}</Text>
        )}
        {isSignUp && (
          <Input
            leftIcon={<Icon name="user" type="simple-line-icon" />}
            placeholder="Username"
            autoCapitalize="words"
            autoCorrect={false}
            keyboardType="default"
            returnKeyType="next"
            value={username}
            onChangeText={setUsername}
            ref={usernameRef}
            onSubmitEditing={() => {
              console.log(emailRef);
              emailRef.current?.focus();
            }}
          />
        )}
        <Input
          leftIcon={<Icon name="email-outline" type="material-community" />}
          placeholder="Email"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          value={email}
          onChangeText={setEmail}
          ref={emailRef}
          onSubmitEditing={() => {
            passwordRef.current?.focus();
          }}
        />
        <Input
          leftIcon={<Icon name="lock" type="simple-line-icon" />}
          placeholder="Password"
          autoCapitalize="none"
          secureTextEntry={true}
          autoCorrect={false}
          keyboardType="default"
          returnKeyType={isSignUp ? "next" : "done"}
          value={password}
          onChangeText={setPassword}
          ref={passwordRef}
          onSubmitEditing={() => {
            isSignUp ? confirmPwdRef.current?.focus() : handleSubmit();
          }}
        />
        {isSignUp && (
          <Input
            leftIcon={<Icon name="lock" type="simple-line-icon" />}
            placeholder="Confirm Password"
            autoCapitalize="none"
            secureTextEntry={true}
            autoCorrect={false}
            keyboardType="default"
            returnKeyType="done"
            value={confirmPwd}
            onChangeText={setConfirmPwd}
            ref={confirmPwdRef}
            onSubmitEditing={() => {
              handleSubmit();
            }}
            blurOnSubmit
          />
        )}
        <Button
          title={isSignUp ? "Sign up" : "Login"}
          containerStyle={{ marginTop: 15 }}
          onPress={handleSubmit}
        />
      </View>
    </ThemeMerger>
  );
}

export default LoginForm;
