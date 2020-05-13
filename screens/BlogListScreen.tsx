import moment from "moment";
import React, { Dispatch } from "react";
import { FlatList, View } from "react-native";
import { ListItem, Text } from "react-native-elements";
import { Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import {
  ErrorScreen,
  Screen,
  useAuthItem,
  withErrorBoundary,
} from "../components";
import { defaultBackgroundImage, GeneralTheme } from "../config/Theming";
import { BlogEntryWithId, BlogList, fetchBlogEntries } from "../model/Blog";
import { shareDeeplink } from "../model/Sharing";
import { delay, useAsyncAction } from "../src/AsyncTools";
import { appLogger } from "../src/Logging";
import { RootState } from "../store";
import { doSetList, doSetPost } from "../store/BlogActions";

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
    dispatch(doSetPost(entry, true));
    navigation.navigate("BlogRead", { id: entry.id });
  }

  function handleShareList() {
    shareDeeplink(
      "Share this blogging app",
      `list`,
      "Check out this cool blogging app!"
    );
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
        text="An error occurred loading blog entries."
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
