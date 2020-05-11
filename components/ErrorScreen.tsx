import React, { useState } from "react";
import Screen from "./Screen";
import { Text } from "react-native-elements";
import JSONTree from "react-native-json-tree";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Overlay } from "react-native-elements";
import { View } from "react-native";

interface ErrorScreenProps {
  text: string;
  error: any;
  onRetry?: any;
}

interface ErrorComponentProps {
  error: any;
  initialShow?: boolean;
}

function ErrorComponent({ error, initialShow }: ErrorComponentProps) {
  const [showDetails, setShowDetails] = useState(!!initialShow);

  const show = () => setShowDetails(true);
  const hide = () => setShowDetails(false);

  return (
    <React.Fragment>
      <Button title="Show details" onPress={show} />
      <Overlay isVisible={showDetails} onBackdropPress={hide}>
        <ScrollView>
          <Button title="Hide" onPress={hide} />
          <JSONTree data={error} />
          <Button title="Hide" onPress={hide} />
        </ScrollView>
      </Overlay>
    </React.Fragment>
  );
}

function ErrorScreen({ text, error, onRetry }: ErrorScreenProps) {
  return (
    <Screen>
      <Text h3={true} style={{ textAlign: "center" }}>
        {text}
      </Text>
      <Text />
      <View style={{ flexDirection: "row" }}>
        <ErrorComponent error={error} />
        {onRetry && <Button title="Retry" onPress={onRetry} />}
      </View>
    </Screen>
  );
}

export default ErrorScreen;
