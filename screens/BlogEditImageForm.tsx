import React, { useState } from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";
import { Button, Image } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import Screen from "../components/Screen";
import { ImageInfo, TakeOrPick, takeOrPickImage } from "../src/ImageTool";
import { RootState } from "../store";
import { UploadForm } from "./UploadForm";
import { doUpdatePost } from "../store/BlogActions";

export function BlogEditImageForm() {
  type BlogEntry = RootState["blog"]["edit"];
  const entry = useSelector<RootState, BlogEntry>((state) => state.blog.edit!);
  const post = entry.document;

  const dispatch = useDispatch();
  const [newImage, setNewImage] = useState<ImageInfo | undefined>();

  async function handleGetImage(take: TakeOrPick) {
    const imageUri = await takeOrPickImage(take);
    console.log("Image selected: ", imageUri);
    setNewImage(imageUri);
  }

  function handleDismiss() {
    setNewImage(undefined);
  }
  function handleUpload(newUrl: string) {
    // @ts-ignore Need to make attributes recursively partial
    dispatch(doUpdatePost({ document: { image_url: newUrl } }));
    setNewImage(undefined);
  }

  const isWorking = false;
  return (
    <Screen backgroundImage={require("../assets/images/handwriting-3.png")}>
      <UploadForm
        imageInfo={newImage}
        onDismiss={handleDismiss}
        onUpload={handleUpload}
      />
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
          <Button
            title="Take picture"
            onPress={() => {
              handleGetImage("take");
            }}
          />
          <Button
            title="Pick image"
            onPress={() => {
              handleGetImage("pick");
            }}
          />
        </View>
      </View>
    </Screen>
  );
}

export default BlogEditImageForm;
