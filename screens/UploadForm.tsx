import chroma from "chroma-js";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Button, Image, Overlay } from "react-native-elements";
import { Colors, SCREEN_WIDTH } from "../config/Theming";
import {getResourceAsStream} from "../src/Networking"
import { transferImage } from "../src/ImageTool";

export interface UploadFormProps {
  localUri: string;
  onDismiss: () => any;
}


export function UploadForm({ localUri, onDismiss }: UploadFormProps) {

  function handleUpload() {
    console.log("XXX Uploading...")
    // transferImage(localUri, "", (a,b)=>console.log(a/b));
  }
  

  return (
    <Overlay
      isVisible={!!localUri}
      overlayStyle={{
        backgroundColor: chroma(Colors.paperColor).alpha(0.5).hex(),
        alignItems: "center",
        justifyContent: "space-evenly",
        paddingVertical: 100,
      }}
      fullScreen={true}
      onDismiss={onDismiss}
    >
      <View>
        <Image
          source={{ uri: localUri }}
          containerStyle={{ borderWidth: 2 }}
          PlaceholderContent={<ActivityIndicator />}
          style={{
            width: SCREEN_WIDTH - 40,
            height: "auto",
            aspectRatio: 16 / 9,
          }}
        />
        <Text></Text>
        <Button
          title="Upload this image"
          onPress={handleUpload}
        />
        <Button title="Forget about it" onPress={onDismiss} />
      </View>
    </Overlay>
  );
}

export default UploadForm;
