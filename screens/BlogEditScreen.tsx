import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import { Dimensions, View } from "react-native";
import { Button, Image } from "react-native-elements";
import TextScreen from "../components/TextScreen";
import * as ImageTool from "../model/ImageTool";


const Tab = createBottomTabNavigator();

function EditPropsView() {
  return <TextScreen text={"This is the blog edit screen for Props"} />;
}

function EditTextView() {
  return <TextScreen text={"This is the blog edit screen for Text"} />;
}

function EditImageView() {
  const [imageUri, setImageUri] = useState<string | false>(false);
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
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        title="Take a picture with mobile camera"
        onPress={() => takeOrPickImage(true)}
      />
      <Button
        title="Pick an image from camera roll"
        onPress={() => takeOrPickImage(false)}
      />
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          containerStyle={{ borderWidth: 2 }}
          style={{ width: Dimensions.get("window").width, height: 300 }}
        />
      )}
    </View>
  );
  // return <TextScreen text={"This is the blog edit screen for Image"} />;
}

export function BlogEditScreen({ navigation, route, ...props }) {
  // <TextScreen text={"This is the blog edit screen for:\n" + route.params.id}/>

  return (
    <Tab.Navigator
      initialRouteName="Image"
      tabBarOptions={{
        activeTintColor: "#e91e63",
      }}
    >
      <Tab.Screen name="Props" component={EditPropsView} />
      <Tab.Screen name="Text" component={EditTextView} />
      <Tab.Screen name="Image" component={EditImageView} />
    </Tab.Navigator>
  );
}

export default BlogEditScreen;
