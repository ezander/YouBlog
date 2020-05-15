import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-elements";
import { ProgressBar } from "react-native-paper";
import { Screen } from "../components";
import { Colors, FontFaces } from "../config/Theming";
import { takeOrPickImage, transferImage } from "../src/ImageTool";
import { networkLogger } from "../config/Logging";
import { useAuthState } from "../store";

function TestScreen() {
  const user = useAuthState().user

  const [uploadState, setUploadState] = useState({
    fraction: 0,
    bytes: 0,
    size: 0,
    dest: "",
    working: false,
  });

  // const token = user?.idToken
  // const token = "ya29.a0AfH6SMB4M-I-ISjuQdukZEYhHj-cCWzkXrPVtSKtVivZXmWmq7WQQJqoP56z9FUXWa9n6wkMkxdgVYSsMGrqO-_z0zlwhA_MEFgpj9Pg22Nw3RxDqbZ4jSpbMz3LA6e2AYsyY4LoipXgdqGeOvSjESv3Q-90NZBQAAI"
  const token = undefined

  async function handleUpload() {
    const result = await takeOrPickImage("pick");
    if (result) {
      console.log(result.uri);

      transferImage(
        result,
        ["public", user!.localId],
        (bytes: number, size: number, dest: string, working: boolean) => {
          networkLogger.info(working ? `Uploaded ${bytes} of ${size} bytes` : "Upload finished");
          setUploadState({ bytes, size, fraction: (size==0) ? 1 : bytes / size, dest, working });
        },
        token
      );
    }
  }

  return (
    <Screen>
      <View style={{width: 300}}>
        {uploadState.working ? (
          <>
            <Text style={{textAlign: "right", fontFamily: FontFaces.monospace}}>{uploadState.bytes.toFixed(0)}/{uploadState.size.toFixed(0)}
            (={(uploadState.fraction * 100).toFixed(0)}%)
            </Text>
            <ProgressBar
              progress={uploadState.fraction}
              color={Colors.primaryColor}
              style={{height: 10}}
            />
          </>
        ) : undefined}
        <Button title="Upload" onPress={handleUpload} />
      </View>
    </Screen>
  );
}

export default TestScreen;
