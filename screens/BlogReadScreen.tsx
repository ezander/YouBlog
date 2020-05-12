import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import moment from "moment";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  Share,
  StyleSheet,
  View,
} from "react-native";
import { Image, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { Item } from "react-navigation-header-buttons";
import { RootStackParamList } from "../App";
import { withErrorBoundary } from "../components/AppErrorBoundary";
import {
  useAuthItem,
  useAuthState,
  useIsLoggedIn,
} from "../components/AuthItem";
import ErrorScreen from "../components/ErrorScreen";
import LoadingScreen from "../components/LoadingScreen";
import Markdown from "../components/Markdown";
import Screen from "../components/Screen";
import { BlogFontSizes, BlogTheme, GeneralTheme } from "../config/Theming";
import { BlogEntryWithId, fetchBlogEntry } from "../model/Blog";
import { useAsyncAction } from "../src/AsyncTools";

// @ts -ignore
interface BlogReadScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "BlogRead">;
  route: RouteProp<RootStackParamList, "BlogRead">;
}
export interface BlogReadParams {
  id: string;
  extra?: {
    id: string;
    author: string;
    author_id: string;
    title: string;
    date_str: string;
    image_url: string;
  };
}

function MyActivityIndicator() {
  return (
    <View style={styles.blogContainer}>
      <ActivityIndicator />
    </View>
  );
}
function BlogReadScreen({ navigation, route }: BlogReadScreenProps) {
  const params = route.params;
  const id = params.id;
  const from_params = params.extra?.id === id;
  const extra_params = from_params && params.extra ? params.extra : undefined;

  const authItem = useAuthItem();
  const isLoggedIn = useIsLoggedIn();
  const authState = useAuthState();

  const fetchThisBlogEntry = useCallback(fetchBlogEntry.bind(null, id), [id]);
  const { hasRun, isWorking, error, result, doRefresh } = useAsyncAction<
    BlogEntryWithId
  >(fetchThisBlogEntry);

  if (error) {
    const text = "An error occurred loading blog entry";
    return <ErrorScreen text={text} error={error} onRetry={doRefresh} />;
  }

  const entry = result as BlogEntryWithId;
  const doc = entry?.document;
  const text = doc?.text;
  const title = from_params ? extra_params?.title : doc?.title;
  const author = from_params ? extra_params?.author : doc?.author;
  const author_id = from_params ? extra_params?.author_id : doc?.author_id;
  const image_url = from_params ? extra_params?.image_url : doc?.image_url;
  const date = from_params ? new Date(extra_params?.date_str!) : doc?.date;

  const handleEdit = () => {
    navigation.navigate("BlogEdit", {
      id,
      extra: { id, title, author, image_url },
    });
  };

  const editAllowed = isLoggedIn && authState.user.localId === author_id; // check whether logged in and owner of entry
  // const editAllowed = true || author_id || isLoggedIn; // todo: remove

  const handleShare = () => {
    const path = `post/${id}`;
    const url = "https://expo.io/@ezander/YouBlog/" + path;
    const message = `Read this! \n "${url}"`;
    Share.share({
      title: "Share this blog post",
      message,
      url,
    });
  };

  navigation.setOptions({
    title: title,
    // @ts-ignore
    extraHeaderItems: [
      editAllowed && (
        <Item key="edit" title="Edit" iconName="edit" onPress={handleEdit} style={{paddingRight: 5}}/>
      ),
      <Item key="share" title="Share" iconName="share" onPress={handleShare} style={{paddingRight: 5}} />,
      authItem,
    ],
  });

  const { fontScale, ...blogMarkdownStyle } = BlogTheme;
  // @ts-ignore
  blogMarkdownStyle.fontSize = BlogFontSizes[BlogTheme.fontScale];
  const fontSize = BlogFontSizes[BlogTheme.fontScale];

  const fdate = moment(date).format("LLL");
  const header = `\n # ${title} \n _${author}_ | _${fdate}_ \n`;

  return (
    <Screen backgroundImage={require("../assets/handwriting-1362879_1280.jpg")}>
      <View style={styles.blogContainer}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={!hasRun || isWorking}
              onRefresh={doRefresh}
            />
          }
        >
          {title && <Markdown {...blogMarkdownStyle}>{header}</Markdown>}
          {image_url && (
            <Image
              resizeMethod="auto"
              resizeMode="cover"
              source={{ uri: image_url }}
              style={{ width: "100%", height: 200 }}
              PlaceholderContent={<ActivityIndicator size="large" />}
            />
          )}
          {!hasRun || isWorking ? (
            <Screen style={{ backgroundColor: BlogTheme.backgroundColor }}>
              <Text></Text>
              <Text style={{ ...GeneralTheme.headingStyle, fontSize: 24 }}>
                {"Loading blog entry..."}{" "}
              </Text>
              <Text></Text>
              <ActivityIndicator size="large" />
            </Screen>
          ) : (
            <Markdown {...blogMarkdownStyle}>{text}</Markdown>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}

export default withErrorBoundary(BlogReadScreen);

const styles = StyleSheet.create({
  blogContainer: {
    // paddingHorizontal: 10,
    margin: 15,
    padding: 10,
    backgroundColor: BlogTheme.backgroundColor,
  },
});
