import React from "react";
import { Text } from "react-native";
import Screen from "./Screen";

interface TextScreenProps {
  text: string;
}

function TextScreen({ text }: TextScreenProps) {
  return (
    <Screen>
      <Text>{text}</Text>
    </Screen>
  );
}

export default TextScreen;
