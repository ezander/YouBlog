import React from "react";
import Screen from "../components/Screen";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { View } from "react-native";
import { Text, Input } from "react-native-elements";
import { Colors, SCREEN_WIDTH } from "../config/Theming";

export interface CanvasProps extends ViewProps {
  // style?: ViewStyle;
  children?: Array<JSX.Element> | JSX.Element;
  // backgroundImage?: ImageSourcePropType;
  // backgroundImageStyle?: ViewStyle;
  // rest?: any;
}
export function Canvas({ ...props }: CanvasProps) {
  return (
    <View
      style={{
        height: "100%",
        width: SCREEN_WIDTH-30,
        marginVertical: 10,
        marginHorizontal: 50,
        borderWidth: 3,
        backgroundColor: Colors.paperColor,
        flex: 1,
      }}
      {...props}
    />
  );
}


export function BlogEditTextForm() {
  type BlogEntry = RootState["blog"]["edit"];
  const entry = useSelector<RootState, BlogEntry>((state) => state.blog.edit!);
  const post = entry.document;

  return (
    <Screen backgroundImage={require("../assets/images/handwriting-2.png")}>
      <Canvas>
        <Input
          value={post?.text}
          multiline={true}
          label="Blog text"
          placeholder={"Enter your blog post in markdown syntax here..."}
          inputStyle={{
            width: 200,
            height: 300,
            borderColor: "black",
            color: "black",
            borderWidth: 1,
            borderTopColor: "red",
            borderBottomColor: "red",
          }}
          containerStyle={{
            marginVertical: 10,
            // width: "90%",
            // height: "100%",
            borderColor: "black",
            borderWidth: 2,
          }}
        />
      </Canvas>
    </Screen>
  );
}

export default BlogEditTextForm;
