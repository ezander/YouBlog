import chroma from "chroma-js";
import React, { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Button, Image, Overlay } from "react-native-elements";
import { Colors, SCREEN_WIDTH, FontFaces } from "../config/Theming";
import { User } from "../model/Auth";
import { ImageInfo, transferImage } from "../src/ImageTool";
import { networkLogger } from "../src/Logging";
import { useAuthState } from "../store";
import { ProgressBar } from "react-native-paper";

export interface UploadFormProps {
  imageInfo?: ImageInfo;
  onDismiss: () => any;
  onUpload: (uploadUrl: string) => any;
}

export function UploadForm({
  imageInfo,
  onDismiss,
  onUpload,
}: UploadFormProps) {
  const user: User = useAuthState().user!;

  const [uploadState, setUploadState] = useState({
    fraction: 0,
    bytes: 0,
    size: 0,
    dest: "",
    working: false,
  });

  async function handleUpload() {
    if (!imageInfo) return; // should not happen, should assert here...
    const uploadUrl = await transferImage(
      imageInfo,
      ["public", user.localId],
      (bytes: number, size: number, dest: string, working: boolean) => {
        networkLogger.info(
          working ? `Uploaded ${bytes} of ${size} bytes` : "Upload finished"
        );
        setUploadState({
          bytes,
          size,
          fraction: size == 0 ? 1 : bytes / size,
          dest,
          working,
        });
      }
    );
    onUpload(uploadUrl);
    setUploadState({bytes: 0,size: 0,fraction:0,dest: "",working: false});
}

  return (
    <Overlay
      isVisible={!!imageInfo}
      overlayStyle={{
        backgroundColor: chroma(Colors.paperColor).alpha(0.7).hex(),
        alignItems: "center",
        justifyContent: "space-evenly",
        paddingVertical: 100,
      }}
      fullScreen={true}
      onDismiss={onDismiss}
    >
      <View>
        <View style={{}}>
          {uploadState.working ? (
            <>
              <Text
                style={{ textAlign: "right", fontFamily: FontFaces.monospace }}
              >
                {uploadState.bytes.toFixed(0)}/{uploadState.size.toFixed(0)}
                (={(uploadState.fraction * 100).toFixed(0)}%)
              </Text>
              <ProgressBar
                progress={uploadState.fraction}
                color={Colors.primaryColor}
                style={{ height: 10 }}
              />
            </>
          ) : undefined}
          {/* <Button title="Upload" onPress={handleUpload} /> */}
        </View>

        <Image
          source={{ uri: imageInfo?.uri }}
          containerStyle={{ borderWidth: 2 }}
          PlaceholderContent={<ActivityIndicator />}
          style={{
            width: SCREEN_WIDTH - 40,
            height: "auto",
            aspectRatio: 16 / 9,
          }}
        />
        <Text></Text>
        <Button title="Upload this image" onPress={handleUpload} />
        <Button title="Forget about it" onPress={onDismiss} />
      </View>
    </Overlay>
  );
}

export default UploadForm;
