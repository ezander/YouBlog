import moment from "moment";
import React, { Dispatch, useCallback } from "react";
import { FlatList, Share, View } from "react-native";
import { ListItem, Text } from "react-native-elements";
import { Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { withErrorBoundary } from "../components/AppErrorBoundary";
import { useAuthItem } from "../components/AuthItem";
import ErrorScreen from "../components/ErrorScreen";
import Screen from "../components/Screen";
import { GeneralTheme, defaultBackgroundImage } from "../config/Theming";
import {
  BlogEntry,
  BlogEntryWithId,
  BlogList,
  fetchBlogEntries,
} from "../model/Blog";
import { useAsyncAction, delay } from "../src/AsyncTools";
import { appLogger } from "../src/Logging";
import { RootState } from "../store";
import { doSetList } from "../store/BlogActions";

interface BlogListEntryProps {
  entry: BlogEntryWithId;
  onSelect: () => void;
}

function BlogListEntry({ entry, onSelect }: BlogListEntryProps) {
  const post = entry.document;
  return (
    <ListItem
      title={post.title}
      subtitle={post.author + " | " + moment(post.date).fromNow()}
      onPress={onSelect}
      bottomDivider
      chevron={{ size: 40, color: "darkgray" }}
      containerStyle={GeneralTheme.screen}
      titleStyle={GeneralTheme.listItems.title}
      subtitleStyle={GeneralTheme.listItems.subtitle}
    />
  );
}

async function handleFetchList(dispatch: Dispatch<any>) {
  try {
    const list = await fetchBlogEntries();
    await delay(1);
    appLogger.info(`Fetched ${list.length} blog posts.`);
    return dispatch(doSetList(list));
  } catch (error) {
    appLogger.error(`Error fetching blog posts: ${error.message}.`);
    throw error;
  }
}

function BlogListScreen({ navigation }: { navigation: any }) {
  const authItem = useAuthItem();
  const dispatch = useDispatch();

  const blogList = useSelector<RootState, Readonly<BlogList>>(
    (state) => state.blog.list
  );

  const { isWorking, error, doRefresh } = useAsyncAction(
    handleFetchList,
    undefined,
    dispatch
  );
  // console.log(isWorking);

  function handleSelectedBlogPost(entry: BlogEntryWithId) {
    const blog = entry.document;
    navigation.navigate("BlogRead", {
      id: entry.id,
      extra: {
        id: entry.id,
        title: blog.title,
        date_str: blog.date.toISOString(),
        author: blog.author,
        author_id: blog.author_id,
        image_url: blog.image_url,
      } as Partial<BlogEntry>,
    });
  }

  function handleShareList() {
    const path = `list`;
    const url = "https://expo.io/@ezander/YouBlog/" + path;
    const message = `Check out this cool blogging app! \n "${url}"`;
    Share.share({
      title: "Share this blogging app",
      message,
      url,
    });
  }

  navigation.setOptions({
    title: "YouBlog",
    // @ts-ignore
    extraHeaderItems: [
      <Item
        key="share"
        title="Share"
        iconName="share"
        onPress={handleShareList}
        style={{ paddingRight: 5 }}
      />,
      authItem,
    ],
  });

  if (error) {
    return (
      <ErrorScreen
        text="An error occurred loading blog entries"
        error={error}
        onRetry={doRefresh}
      />
    );
  }

  return (
    <Screen backgroundImage={defaultBackgroundImage}>
      <View style={{ paddingTop: 10 }}>
        <Text style={GeneralTheme.headingStyle}>Latest Blog Entries</Text>
      </View>
      <View style={{ width: "100%", padding: 10, flex: 1 }}>
        <FlatList<BlogEntryWithId>
          data={blogList}
          renderItem={({ item }) => (
            <BlogListEntry
              entry={item}
              onSelect={() => handleSelectedBlogPost(item)}
            />
          )}
          refreshing={isWorking}
          onRefresh={doRefresh}
          style={GeneralTheme.screen}
        />
      </View>
    </Screen>
  );
}

export default withErrorBoundary(BlogListScreen);
