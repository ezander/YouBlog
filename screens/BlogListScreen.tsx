import moment from "moment";
import React from "react";
import { FlatList, Share, View } from "react-native";
import { ListItem, Text } from "react-native-elements";
import { Item } from "react-navigation-header-buttons";
import { withErrorBoundary } from "../components/AppErrorBoundary";
import { useAuthItem } from "../components/AuthItem";
import ErrorScreen from "../components/ErrorScreen";
import Screen from "../components/Screen";
import {
  BlogEntry,
  BlogEntryWithId,
  BlogList,
  fetchBlogEntries,
} from "../model/Blog";
import { useAsyncAction } from "../src/AsyncTools";
import { GeneralTheme } from "../config/Theming";

function BlogListEntry({
  entry,
  onSelect,
}: {
  entry: BlogEntryWithId;
  onSelect: () => void;
}) {
  const blog = entry.document;
  return (
    <ListItem
      title={blog.title}
      subtitle={blog.author + " | " + moment(blog.date).fromNow()}
      onPress={onSelect}
      bottomDivider
      chevron={{size: 40, color: "darkgray"}}
      containerStyle={GeneralTheme.screen}
      titleStyle={GeneralTheme.listItems.title}
      subtitleStyle={GeneralTheme.listItems.subtitle}
    />
  );
}

function BlogListScreen({ navigation }: { navigation: any }) {
  const authItem = useAuthItem();

  const { hasRun, isWorking, error, result, doRefresh } = useAsyncAction<
    BlogList
  >(fetchBlogEntries);

  const entrySelected = (entry: BlogEntryWithId) => {
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
  };

  const handleShare = () => {
    const path = `list`;
    const url = "https://expo.io/@ezander/YouBlog/" + path;
    const message = `Check out this cool blogging app! \n "${url}"`;
    Share.share({
      title: "Share this blogging app",
      message,
      url,
    });
  };

  navigation.setOptions({
    title: "YouBlog",
    // @ts-ignore
    extraHeaderItems: [
      <Item key="share" title="Share" iconName="share" onPress={handleShare} />,
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
    <Screen backgroundImage={require("../assets/handwriting-1362879_1280.jpg")}>
      <View style={{ paddingTop: 10 }}>
        <Text style={GeneralTheme.headingStyle}>Latest Blog Entries</Text>
      </View>
      <View style={{ width: "100%", padding: 10, flex: 1 }}>
        <FlatList<BlogEntryWithId>
          data={result}
          renderItem={({ item }) => (
            <BlogListEntry entry={item} onSelect={() => entrySelected(item)} />
          )}
          refreshing={!hasRun || isWorking}
          onRefresh={doRefresh}
          style={GeneralTheme.screen}
        />
      </View>
    </Screen>
  );
}

export default withErrorBoundary(BlogListScreen);
