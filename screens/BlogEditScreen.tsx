//import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";
import { Button, Image, Icon, Text } from "react-native-elements";
import { RootStackParamList } from "../App";
import TextScreen from "../components/TextScreen";
import * as ImageTool from "../model/ImageTool";
import Screen from "../components/Screen";

export interface BlogEditParams {
  id: string;
  extra: {
    id: string;
    author: string;
    author_id: string;
    title: string;
    date_str: string;
    image_url: string;
    text: string;
  };
}

const Tab = createMaterialTopTabNavigator();
// const Tab = createBottomTabNavigator();
// const Tab = createMaterialBottomTabNavigator();

function EditPropsForm() {
  return (
    <Screen backgroundImage={require("../assets/handwriting-1.png")}>
      {/* <TextScreen text={"This is the blog edit screen for Props"} /> */}
    </Screen>
  );
}

function EditTextForm() {
  return (
    <Screen backgroundImage={require("../assets/handwriting-2.png")}>
      {/* <TextScreen text={"This is the blog edit screen for Text"} /> */}
    </Screen>
  );
}

function EditImageForm({ imageUri }: { imageUri: string | undefined }) {
  const [newImageUri, setImageUri] = useState<string | undefined>(imageUri);
  // useEffect(() => {ImagePicker.getCameraPermissionsAsync()}, [])
  // useEffect(() => {ImagePicker.getCameraRollPermissionsAsync()}, [])

  function handleImageSelect(image_uri: string) {
    console.log("Image selected: ", image_uri);
    setImageUri(image_uri);
  }
  async function takeOrPickImage(take: boolean) {
    ImageTool.takeOrPickImage(take, handleImageSelect);
  }

  return (
    <Screen backgroundImage={require("../assets/handwriting-3.png")}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          title="Take a picture with mobile camera"
          onPress={() => takeOrPickImage(true)}
        />
        <Button
          title="Pick an image from camera roll"
          onPress={() => takeOrPickImage(false)}
        />
        {newImageUri && (
          <Image
            source={{ uri: newImageUri }}
            containerStyle={{ borderWidth: 2 }}
            PlaceholderContent={<ActivityIndicator />}
            style={{ width: Dimensions.get("window").width, height: 300 }}
          />
        )}
      </View>
    </Screen>
  );
  // return <TextScreen text={"This is the blog edit screen for Image"} />;
}

// @ts -ignore
interface BlogReadScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "BlogEdit">;
  route: RouteProp<RootStackParamList, "BlogEdit">;
}

export function BlogEditScreen({
  navigation,
  route,
  ...props
}: BlogReadScreenProps) {
  // <TextScreen text={"This is the blog edit screen for:\n" + route.params.id}/>

  const params = route.params;
  const image_url = params.extra.image_url;

  const LocalImageView = useCallback(
    () => <EditImageForm imageUri={image_url} />,
    [image_url]
  );

  // { focused: boolean, color: string, size: number }
  return (
    <Tab.Navigator
      initialRouteName="Image"
      tabBarPosition="bottom"
      tabBarOptions={{
        activeTintColor: "#e91e63",
      }}
    >
      <Tab.Screen
        name="Props"
        component={EditPropsForm}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon name="dialpad" type="material" size={25} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Text"
        component={EditTextForm}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon name="dialpad" type="material" size={25} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Image"
        component={LocalImageView}
        initialParams={{ imageUri: image_url }}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon name="dialpad" type="material" size={25} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BlogEditScreen;
