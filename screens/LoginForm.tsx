import React, { useRef, useState } from "react";
import { View, Alert } from "react-native";
import {
  Button,
  Icon,
  Input,
  Text,
  InputProps,
  TextProps,
} from "react-native-elements";
import { ThemeMerger, useTheme } from "../components/ThemeMerger";
import { loginTheme, SCREEN_WIDTH, Colors } from "../config/Theming";
import validate from "validate.js";
import { useLinkProps } from "@react-navigation/native";
import chroma from "chroma-js";
import { appLogger } from "../src/Logging";

type ErrorProps = TextProps & {
  error: undefined | Array<string>;
};

function Error({ error, ...props }: ErrorProps) {
  return !!error && error.length > 0 ? (
    <View
      style={{
        width: SCREEN_WIDTH - 60,
        height: 20,
        marginLeft: 20,
        marginTop: -5,
      }}
    >
      <Text
        style={{
          color: chroma("red").darken().hex(),
          textAlign: "left",
          fontSize: 14,
        }}
        {...props}
      >
        {error[0]}
      </Text>
    </View>
  ) : (
    <></>
  );
}

export interface SignUpProps {
  isSignUp: true;
  onSignUp: (
    email: string,
    password: string,
    username: string,
  ) => Promise<void>;
}
export interface LoginProps {
  isSignUp: false;
  onLogin: (email: string, password: string) => Promise<void>;
}
type LoginFormProps = (SignUpProps | LoginProps) & {
  showTitle?: boolean;
};

export function LoginForm({ showTitle, ...rest }: LoginFormProps) {
  const isSignUp = rest.isSignUp;
  const usernameRef = useRef<Input>(null);
  const emailRef = useRef<Input>(null);
  const passwordRef = useRef<Input>(null);
  const confirmPwdRef = useRef<Input>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("cc@testmail.com");
  const [password, setPassword] = useState("test1234");
  const [confirmPwd, setConfirmPwd] = useState("");

  const noErrors = {
    email: [],
    username: [],
    password: [],
    confirmPwd: [],
  };
  const [errors, setErrors] = useState(noErrors);

  const theme = useTheme() as any;

  function validateForm() {
    const constraints = {
      username: {
        presence: isSignUp ? { allowEmpty: false } : false,
        length: {
          minimum: isSignUp ? 2 : 0,
          message: "must be at least 2 characters long.",
        },
      },
      email: {
        presence: { allowEmpty: false },
        email: {
          message: '^"%{value}" is not a valid email.',
        },
      },
      password: {
        presence: true,
        length: {
          minimum: isSignUp ? 6 : 0,
          message: "must have at least 6 characters",
        },
      },
      confirmPwd: {
        presence: isSignUp,
        ...(isSignUp
          ? {
              equality: {
                attribute: "password",
                message: "^Passwords must match.",
              },
            }
          : {}),
      },
    };
    const result = validate(
      { username, email, password, confirmPwd },
      constraints
    );
    if (result) {
      appLogger.info("Validation error: ", result);
      setErrors(result);
      return false;
    } else {
      setErrors(noErrors);
      return true;
    }
  }

  function handleSubmit() {
    if (validateForm()) {
      appLogger.info("Login form was ok...");
      if (rest.isSignUp) {
        rest.onSignUp(email, password, username);
      } else {
        rest.onLogin(email, password);
      }
    } else {
      appLogger.info("Login form error");
    }
  }

  return (
    <ThemeMerger theme={loginTheme}>
      <View style={theme.Extra.View}>
        {showTitle && (
          <Text style={theme.Extra.Text}>{isSignUp ? "Sign up" : "Login"}</Text>
        )}
        {isSignUp && (
          <>
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
                emailRef.current?.focus();
              }}
            />
            <Error error={errors?.username} />
          </>
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
        <Error error={errors?.email} />
        <Input
          leftIcon={<Icon name="lock" type="simple-line-icon" />}
          rightIcon={<Icon name="md-eye-off" type="ionicon" />}
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
        <Error error={errors?.password} />
        {isSignUp && (
          <>
            <Input
              leftIcon={<Icon name="lock" type="simple-line-icon" />}
              rightIcon={<Icon name="md-eye" type="ionicon" />}
              containerStyle={{paddingRight: 10}}
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
            <Error error={errors?.confirmPwd} />
          </>
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
