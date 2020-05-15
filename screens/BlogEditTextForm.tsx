import React, { useState, useCallback } from "react";
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

  // const [text, setText] = useState("" + post?.text);
  const text = post?.text
  const setText = useCallback(
    (text) => { dispatch(doUpdatePost({ document: { text } }))}, [])


  function storeChanges() {
    // dispatch(doUpdatePost({ document: { text } }));
    setText(text)
  }

  return (
    <Screen backgroundImage={require("../assets/images/handwriting-2.png")}>
      <Canvas>
        <Label title="Blog text" />
        <Input
          value={text}
          multiline={true}
          numberOfLines={20}
          placeholder={"Enter your blog post in markdown syntax here..."}
          inputStyle={{
            borderColor: "black",
            color: "black",
          }}
          containerStyle={{
            marginVertical: 0,
            width: "100%",
            flex: 1
          }}
          inputContainerStyle={{
            flex: 1
          }}
          onBlur={storeChanges}
          onEndEditing={storeChanges}
          onSubmitEditing={storeChanges}
          onChangeText={setText}
        />
      </Canvas>
    </Screen>
  );
}

export default BlogEditTextForm;
