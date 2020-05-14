import React, { useState } from "react";
import { Input } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import Screen from "../components/Screen";
import { RootState } from "../store";
import { doUpdatePost } from "../store/BlogActions";
import { Label, Canvas } from "./BlogEditInfoForm";

export function BlogEditTextForm() {
  const dispatch = useDispatch();
  type BlogEntry = RootState["blog"]["edit"];
  const entry = useSelector<RootState, BlogEntry>((state) => state.blog.edit!);
  const post = entry.document;

  const [text, setText] = useState("" + post?.text);

  function storeChanges() {
    dispatch(doUpdatePost({ document: { text } }));
  }

  return (
    <Screen backgroundImage={require("../assets/images/handwriting-2.png")}>
      <Canvas>
        <Label title="Blog text" />
        <Input
          value={post?.text}
          multiline={true}
          numberOfLines={20}
          placeholder={"Enter your blog post in markdown syntax here..."}
          inputStyle={{
            // width: 200,
            // height: 100,
            borderColor: "black",
            color: "black",
            borderWidth: 1,
            borderTopColor: "red",
            borderBottomColor: "red",
          }}
          containerStyle={{
            marginVertical: 0,
            // width: "90%",
            // height: "100%",
            borderColor: "blue",
            borderWidth: 2,
          }}
          inputContainerStyle={{
            height: 300,
          }}
          onBlur={storeChanges}
          onEndEditing={storeChanges}
          onSubmitEditing={storeChanges}
        />
      </Canvas>
    </Screen>
  );
}

export default BlogEditTextForm;
