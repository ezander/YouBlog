import React, { useState } from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";
import { Button, Image } from "react-native-elements";
import Screen from "../components/Screen";
import * as ImageTool from "../model/ImageTool"

export function BlogEditImageForm({
  imageUri,
}: {
  imageUri: string | undefined;
}) {
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
    <Screen backgroundImage={require("../assets/images/handwriting-3.png")}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button title="Take picture" onPress={() => takeOrPickImage(true)} />
        <Button title="Pick image" onPress={() => takeOrPickImage(false)} />
        {newImageUri && (
          <Image
            source={{ uri: newImageUri }}
            containerStyle={{ borderWidth: 2 }}
            PlaceholderContent={<ActivityIndicator />}
            style={{ width: Dimensions.get("window").width - 40, height: 200 }}
          />
        )}
      </View>
    </Screen>
  );
  // return <TextScreen text={"This is the blog edit screen for Image"} />;
}

export default BlogEditImageForm
