import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Alert, View, ViewProps } from "react-native";
import { Icon } from "react-native-elements";
import { Item } from "react-navigation-header-buttons";
import { RootStackParamList } from "../App";
import { ThemeMerger } from "../components/ThemeMerger";
import { editTheme, Colors, SCREEN_WIDTH, FontFaces } from "../config/Theming";
import BlogEditImageForm from "./BlogEditImageForm";
import BlogEditInfoForm from "./BlogEditInfoForm";
import BlogEditTextForm from "./BlogEditTextForm";
import { useSelector, useDispatch } from "react-redux";
import { RootState, useAuthState } from "../store";
import { doStorePost } from "../store/BlogActions";
import { BlogEntryWithId } from "../model/Blog";
import { appLogger } from "../config/Logging";

export interface BlogEditParams {
  id: string;
}

const Tab = createMaterialTopTabNavigator();

interface BlogReadScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "BlogEdit">;
  route: RouteProp<RootStackParamList, "BlogEdit">;
}

export function BlogEditScreen({ navigation, route }: BlogReadScreenProps) {
  const id = route.params.id;

  const user = useAuthState().user;

  const dispatch = useDispatch();
  type BlogEntry = RootState["blog"]["edit"];
  const entry = useSelector<RootState, BlogEntry>((state) => state.blog.edit!);
  // console.log(entry)
  const hasChanged = entry.changed;


  async function saveAndGoBack() {
    // save this stuff
    try {
      await dispatch(doStorePost(entry as BlogEntryWithId, user?.idToken!));
    } catch (error) {
      Alert.alert(
        "Database Error",
        "There was an error storing the blog post:\n" + error.message
      );
      return;
    }
    appLogger.info(`Saved changes to blog post: ${entry.id}`);
    navigation.goBack();
  }

  function discardAndGoBack() {
    console.log("Discard changed and go back");
    navigation.goBack();
  }

  function keepEditing() {
    console.log("Keep editing");
  }

  function handleGoBack() {
    if (!hasChanged) {
      discardAndGoBack();
      return;
    }
    Alert.alert(
      "Leave page",
      "What do you want to do?",
      [
        {
          text: "Save changes",
          onPress: saveAndGoBack,
        },
        {
          text: "Discard my changes",
          onPress: discardAndGoBack,
          style: "destructive",
        },
        {
          text: "Let me keep editing",
          onPress: keepEditing,
          style: "cancel",
        },
      ],
      { cancelable: true, onDismiss: () => {} }
    );
  }

  function handleDone() {
    Alert.alert(
      "Save?",
      "Save this blog post?",
      [
        {
          text: "Sure, ready to publish...",
          onPress: saveAndGoBack,
        },
        {
          text: "No, I'm not quite finished...",
          onPress: keepEditing,
          style: "cancel",
        },
      ],
      { cancelable: true, onDismiss: () => {} }
    );
  }

  function handleCancel() {
    Alert.alert(
      "Really cancel?",
      "Throw away all edits?",
      [
        {
          text: "Yep! Throw away this junk...",
          onPress: discardAndGoBack,
        },
        {
          text: "No, I'll polish it up...",
          onPress: keepEditing,
          style: "cancel",
        },
      ],
      { cancelable: true, onDismiss: () => {} }
    );
  }

  navigation.setOptions({
    title: id ? "Edit blog post" : "New blog post",
    // @ts-ignore
    extraHeaderItems: !hasChanged ? [] : [
      <Item
        key="done"
        title="Done"
        iconName="done"
        onPress={handleDone}
        style={{ paddingRight: 5 }}
      />,
      <Item
        key="cancel"
        title="Cancel"
        iconName="cancel"
        onPress={handleCancel}
        style={{ paddingRight: 5 }}
      />,
    ],
    onGoBack: handleGoBack,
  });

  // { focused: boolean, color: string, size: number }
  const showIcon = true;
  return (
    <ThemeMerger theme={editTheme}>
      <Tab.Navigator
        initialRouteName="Info" //"Image"
        tabBarPosition="bottom"
        tabBarOptions={{
          contentContainerStyle: {
            backgroundColor: Colors.primaryColor,
          },
          activeTintColor: Colors.paperLight,
          labelStyle: {
            fontFamily: FontFaces.typewriter, // decorative,
            fontSize: 18,
            textTransform: "none",
            margin: 0,
          },

          showIcon: showIcon,
          showLabel: !showIcon,
        }}
      >
        <Tab.Screen
          name="Info"
          component={BlogEditInfoForm}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Icon
                name="information"
                type="material-community"
                size={25}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Text"
          component={BlogEditTextForm}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Icon
                name="text"
                type="material-community"
                size={25}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Image"
          component={BlogEditImageForm}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Icon
                name="image"
                type="material-community"
                size={25}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </ThemeMerger>
  );
}

export default BlogEditScreen;
