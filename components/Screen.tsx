import React from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageBackground,
  ImageSourcePropType,
  ImageBackgroundProps,
} from "react-native";

export interface ScreenProps {
  style?: ViewStyle;
  children?: Array<JSX.Element> | JSX.Element;
  backgroundImage?: ImageSourcePropType;
  backgroundImageStyle?: ViewStyle;
  rest?: any;
}

function Screen({
  style,
  children,
  backgroundImage,
  backgroundImageStyle,
  ...rest
}: ScreenProps) {
  if (backgroundImage) {
    return (
      <View style={{ ...styles.screen, ...style }} {...rest}>
        <ImageBackground
          source={backgroundImage}
          style={{ ...styles.screen, width: "100%", height: "100%", ...backgroundImageStyle }}
        >
          {children}
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={{ ...styles.screen, ...style }} {...rest}>
      {children}
    </View>
  );
}

export default Screen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
