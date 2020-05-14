import React, { useState } from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";
import { Button, Image } from "react-native-elements";
import Screen from "../components/Screen";
import * as ImageTool from "../src/ImageTool";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { updateLocale } from "moment";
import { UploadForm } from "./UploadForm";

export function BlogEditImageForm() {
  type BlogEntry = RootState["blog"]["edit"];
  const entry = useSelector<RootState, BlogEntry>((state) => state.blog.edit!);
  const post = entry.document;
  
  const testFile = "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540ezander%252FYouBlog/ImagePicker/27e527a0-5433-434f-96df-72e5399b5a66.jpg"

  const [localUri, setLocalUri] = useState<string | undefined>(testFile);
  
  function handleImageSelect(imageUri: string) {
    console.log("Image selected: ", imageUri);
    setLocalUri(imageUri);
  }

  async function takeOrPickImage(take: boolean) {
    ImageTool.takeOrPickImage(take, handleImageSelect);
  }
  const isWorking = false;
  return (
    <Screen backgroundImage={require("../assets/images/handwriting-3.png")}>
      <UploadForm localUri={localUri} onDismiss={() => setLocalUri(undefined)} />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {post?.image_url && (
          <Image
            source={{ uri: post?.image_url }}
            containerStyle={{ borderWidth: 2 }}
            PlaceholderContent={<ActivityIndicator />}
            style={{ width: Dimensions.get("window").width - 40, height: 200 }}
          />
        )}
        <View
          style={{
            flexDirection: "row",
            alignSelf: "stretch",
            justifyContent: "space-around",
          }}
        >
          <Button title="Take picture" onPress={() => takeOrPickImage(true)} />
          <Button title="Pick image" onPress={() => {takeOrPickImage(false)}} />
          {/* <Button title="Pick image" onPress={() => {setLocalUri(testFile)}}/> */}
        </View>
      </View>
    </Screen>
  );
  // return <TextScreen text={"This is the blog edit screen for Image"} />;
}

export default BlogEditImageForm;
