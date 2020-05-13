import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import moment from "moment";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Image, Text } from "react-native-elements";
import { Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { RootStackParamList } from "../App";
import { withErrorBoundary } from "../components/AppErrorBoundary";
import { useAuthItem } from "../components/AuthItem";
import ErrorScreen from "../components/ErrorScreen";
import Markdown from "../components/Markdown";
import Screen from "../components/Screen";
import ZoomTool from "../components/ZoomTool";
import {
  BlogFontScales,
  BlogFontSizes,
  BlogTheme,
  defaultBackgroundImage,
  GeneralTheme,
} from "../config/Theming";
import { BlogEntryWithId, fetchBlogEntry } from "../model/Blog";
import { shareDeeplink } from "../model/Sharing";
import { useAsyncAction } from "../src/AsyncTools";
import { appLogger } from "../src/Logging";
import { RootState, useAuthState } from "../store";
import { doSetPost, doEditPost } from "../store/BlogActions";
import { doSetFontScale, Settings } from "../store/SettingsActions";

interface BlogReadScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "BlogRead">;
  route: RouteProp<RootStackParamList, "BlogRead">;
}
export interface BlogReadParams {
  id: string;
}

async function handleFetchPost(id: string, dispatch: Dispatch<any>) {
  try {
    const entry = await fetchBlogEntry(id);
    // await delay(1);
    appLogger.info(`Fetched blog post: "${id} ".`);
    return dispatch(doSetPost(entry));
  } catch (error) {
    appLogger.error(`Error fetching blog post: ${id}.`);
    throw error;
  }
}

function BlogReadScreen({ navigation, route }: BlogReadScreenProps) {
  const dispatch = useDispatch();

  // Auth state
  const authItem = useAuthItem();
  const authState = useAuthState();

  // Zooming in and out
  const settings = useSelector<RootState, Settings>((state) => state.settings);
  const fontScale = settings.blogFontScale;
  const zoomIn = useCallback(
    () => dispatch(doSetFontScale(BlogFontScales.zoomIn(fontScale))),
    [fontScale]
  );
  const zoomOut = useCallback(
    () => dispatch(doSetFontScale(BlogFontScales.zoomOut(fontScale))),
    [fontScale]
  );
  const canZoomIn = BlogFontScales.canZoomIn(fontScale);
  const canZoomOut = BlogFontScales.canZoomOut(fontScale);

  // Fetching and merging the blog post
  const id = route.params.id;
  type BlogMap = ReadonlyMap<string, Partial<BlogEntryWithId>>;
  const posts = useSelector<RootState, BlogMap>((state) => state.blog.posts);
  const entry = posts.get(id);

  const { isWorking, error, doRefresh } = useAsyncAction(
    handleFetchPost,
    undefined,
    id,
    dispatch
  );

  if (error) {
    const text = "An error occurred loading blog entry";
    return <ErrorScreen text={text} error={error} onRetry={doRefresh} />;
  }

  const post = entry?.document;
  const text = post?.text || "";
  const title = post?.title;
  const author = post?.author;
  const author_id = post?.author_id;
  const image_url = post?.image_url;
  const date = post?.date;

  function handleEdit() {
    if (post?.title) { // check that post is fully loaded
      dispatch(doEditPost(entry as BlogEntryWithId));
      navigation.navigate("BlogEdit", { id });
    }
  }

  const editAllowed = !!authState.user && authState.user.localId === author_id; // check whether logged in and owner of entry
  // const editAllowed = true || author_id || isLoggedIn; // todo: remove

  function handleShare() {
    shareDeeplink("Share this blog post", `post/${id}`, "Read this!");
  }

  navigation.setOptions({
    title: title,
    // @ts-ignore
    extraHeaderItems: [
      <Item
        key="share"
        title="Share"
        iconName="share"
        onPress={handleShare}
        style={{ paddingRight: 5 }}
      />,
      editAllowed && (
        <Item
          key="edit"
          title="Edit"
          iconName="edit"
          onPress={handleEdit}
          style={{ paddingRight: 5 }}
        />
      ),
      authItem,
    ],
  });

  const { ...blogMarkdownStyle } = BlogTheme;
  blogMarkdownStyle.fontSize = BlogFontSizes[fontScale];
  ["small", "normal", "large", "xlarge"];

  const fdate = moment(date).format("LLL");
  const header = `\n # ${title} \n _${author}_ | _${fdate}_ \n`;

  return (
    <Screen backgroundImage={defaultBackgroundImage}>
      <View style={styles.blogContainer}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isWorking} onRefresh={doRefresh} />
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
          {isWorking ? (
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
      <ZoomTool
        onZoomIn={canZoomIn ? zoomIn : undefined}
        onZoomOut={canZoomOut ? zoomOut : undefined}
      />
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
