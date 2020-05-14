import React, { useState, useRef } from "react";
import Screen from "../components/Screen";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { View } from "react-native";
import { Text, Input } from "react-native-elements";
import { User } from "../model/Auth";
import { Canvas } from "./BlogEditTextForm";
import { doUpdatePost } from "../store/BlogActions";

export function Label({ title }: { title: string }) {
  return (
    <Text style={{ marginLeft: 10, marginBottom: -5, marginTop: 5 }}>
      {title}
    </Text>
  );
}
export function BlogEditInfoForm() {
  const user = useSelector<RootState, Readonly<User>>(
    (state) => state.auth.user!
  );

  const dispatch = useDispatch();
  type BlogEntry = RootState["blog"]["edit"];
  const entry = useSelector<RootState, BlogEntry>((state) => state.blog.edit!);
  const post = entry.document;

  const [title, setTitle] = useState("" + post?.title);
  const [author, setAuthor] = useState("" + post?.author);

  function storeChanges() {
    dispatch(doUpdatePost({ document: { title, author } }));
  }

  const titleRef = useRef<Input>(null);
  const authorRef = useRef<Input>(null);

  return (
    <Screen backgroundImage={require("../assets/images/handwriting-1.png")}>
      <Canvas>
        <Label title="Title" />
        <Input
          value={title}
          placeholder="Catchy title goes here..."
          multiline={true}
          numberOfLines={2}
          inputContainerStyle={{height: 80}}
          onChangeText={setTitle}
          ref={titleRef}
          onBlur={storeChanges}
          onEndEditing={storeChanges}
          onSubmitEditing={() => authorRef.current?.focus()}
        />
        <Label title="Author (change to your pseudonym...)" />
        <Input
          value={author}
          onChangeText={setAuthor}
          ref={authorRef}
          onBlur={storeChanges}
          onEndEditing={storeChanges}
          onSubmitEditing={() => authorRef.current?.focus()}
        />
        <Label title="Date (will be updated automatically)" />
        <Input value={"" + post?.date.toLocaleString()} disabled={true} />
        <Label title="Email (can't be changed)" />
        <Input value={"" + user?.email} disabled={true} />
      </Canvas>
    </Screen>
  );
}

export default BlogEditInfoForm;
