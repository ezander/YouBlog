import React, { useRef, useState, useCallback } from "react";
import { View, ViewProps } from "react-native";
import { Input, Text } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import Screen from "../components/Screen";
import { Colors, SCREEN_WIDTH } from "../config/Theming";
import { User } from "../model/Auth";
import { RootState } from "../store";
import { doUpdatePost } from "../store/BlogActions";
import { Route } from "react-native-tab-view";
import { RouteProp } from "@react-navigation/native";

export function Label({ title }: { title: string }) {
  return (
    <Text style={{ marginLeft: 10, marginBottom: -5, marginTop: 5 }}>
      {title}
    </Text>
  );
}

export interface CanvasProps extends ViewProps {
  children?: Array<JSX.Element> | JSX.Element;
}
export function Canvas({ ...props }: CanvasProps) {
  return (
    <View
      style={{
        height: "100%",
        width: SCREEN_WIDTH - 30,
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

export function BlogEditInfoForm() {
  const user = useSelector<RootState, Readonly<User>>(
    (state) => state.auth.user!
  );


  const dispatch = useDispatch();
  type BlogEntry = RootState["blog"]["edit"];
  const entry = useSelector<RootState, BlogEntry>((state) => state.blog.edit!);
  const post = entry.document;

  // const [title, setTitle] = useState("" + post?.title);
  // const [author, setAuthor] = useState("" + post?.author);

  const title = post?.title
  const setTitle = useCallback(
    (title) => { dispatch(doUpdatePost({ document: { title } }))}, [])
  const author = post?.author
  const setAuthor = useCallback(
    (author) => { dispatch(doUpdatePost({ document: { author } }))}, [])
  
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
          inputContainerStyle={{ height: 80 }}
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
        <Input value={"" + post?.date?.toLocaleString()} disabled={true} />
        <Label title="Email (can't be changed)" />
        <Input value={"" + user?.email} disabled={true} />
      </Canvas>
    </Screen>
  );
}

export default BlogEditInfoForm;
