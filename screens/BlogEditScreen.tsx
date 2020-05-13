import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Alert } from "react-native";
import { Icon } from "react-native-elements";
import { Item } from "react-navigation-header-buttons";
import { RootStackParamList } from "../App";
import { ThemeMerger } from "../components/ThemeMerger";
import { editTheme } from "../config/Theming";
import BlogEditImageForm from "./BlogEditImageForm";
import BlogEditInfoForm from "./BlogEditInfoForm";
import BlogEditTextForm from "./BlogEditTextForm";

export interface BlogEditParams {
  id: string;
}

const Tab = createMaterialTopTabNavigator();

interface BlogReadScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "BlogEdit">;
  route: RouteProp<RootStackParamList, "BlogEdit">;
}

export function BlogEditScreen({ navigation, route }: BlogReadScreenProps) {
  const params = route.params;
  const image_url = params?.extra?.image_url;

  function saveAndGoBack() {
    console.log("Save and go back")
    // save this stuff
    navigation.goBack()
  }
  function discardAndGoBack() {
    console.log("Discard changed and go back")
    navigation.goBack()
  }
  function keepEditing() {
    console.log("Keep editing")
  }
  
  function handleGoBack() {
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
    // title: title,
    // @ts-ignore
    extraHeaderItems: [
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
    onGoBack: handleGoBack
  });

  // { focused: boolean, color: string, size: number }
  return (
    <ThemeMerger theme={editTheme}>
      <Tab.Navigator
        initialRouteName="Image"
        tabBarPosition="bottom"
        tabBarOptions={{
          activeTintColor: "#e91e63",
        }}
      >
        <Tab.Screen
          name="Info"
          component={BlogEditInfoForm}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Icon name="dialpad" type="material" size={25} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Text"
          component={BlogEditTextForm}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Icon name="dialpad" type="material" size={25} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Image"
          component={BlogEditImageForm}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Icon name="dialpad" type="material" size={25} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </ThemeMerger>
  );
}

export default BlogEditScreen;
