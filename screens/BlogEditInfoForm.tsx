import React from "react";
import Screen from "../components/Screen";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { View } from "react-native";
import { Text, Input } from "react-native-elements";
import { User } from "../model/Auth";
import { Canvas } from "./BlogEditTextForm";

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

  type BlogEntry = RootState["blog"]["edit"];
  const entry = useSelector<RootState, BlogEntry>((state) => state.blog.edit!);
  const post = entry.document;

  return (
    <Screen backgroundImage={require("../assets/images/handwriting-1.png")}>
      <Canvas>
        <Label title="Title" />
        <Input value={"Test " + post?.title} />
        <Label title="Date" />
        <Input value={"Test " + post?.date.toDateString()} />
        <Label title="Author" />
        <Input value={"Test " + post?.author} />
        <Label title="Email (can't be changed)" />
        <Input disabled={true} value={"Test " + user?.email} />
      </Canvas>
    </Screen>
  );
}

export default BlogEditInfoForm;
