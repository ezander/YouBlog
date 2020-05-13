import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Alert } from "react-native";
import { Item } from "react-navigation-header-buttons";
import { useDispatch } from "react-redux";
import { useAuthState } from "../store";
import { doLogout } from "../store/AuthActions";

export function useAuthItem() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const auth = useAuthState();

  function handleLogin() {
    navigation.navigate("Login");
  }

  function handleLogout() {
    Alert.alert(
      `Hey ${auth.user?.displayName}!`,
      "Are you sure? Really log out?",
      [
        {
          text: "Sure as hell!",
          onPress: () => dispatch(doLogout()),
        },
        {
          text: "No, keep me logged in!",
        },
      ],
      { cancelable: true }
    );
  }

  if (auth.user) {
    return (
      <Item
        key="logout"
        title="Logout"
        iconName="log_out"
        onPress={handleLogout}
      />
    );
  } else {
    return (
      <Item key="login" title="Login" iconName="log_in" onPress={handleLogin} />
    );
  }
}
