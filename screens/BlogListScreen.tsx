import moment from 'moment';
import React from 'react';
import { FlatList, View } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { Item } from 'react-navigation-header-buttons';
import { withErrorBoundary } from '../components/AppErrorBoundary';
import ErrorScreen from '../components/ErrorScreen';
import Screen from '../components/Screen';
import { BlogEntry, BlogEntryWithId, BlogList, fetchBlogEntries } from '../model/Blog';
import { useAsyncAction } from '../src/AsyncTools';
import { useAuthItem } from '../components/AuthItem';
import {Share} from 'react-native'


function BlogListEntry({ entry, onSelect }: { entry: BlogEntryWithId, onSelect: (() => void) }) {
    const blog = entry.document
    return (
        <ListItem
            title={blog.title}
            subtitle={blog.author + " | " + moment(blog.date).fromNow()}
            onPress={onSelect}
            bottomDivider
            chevron
        />
    )
}

function BlogListScreen({ navigation }: { navigation: any }) {
    const authItem = useAuthItem()

    const { hasRun, isWorking, error, result, doRefresh } = useAsyncAction<BlogList>(fetchBlogEntries)

    const entrySelected = (entry: BlogEntryWithId) => {
        const blog = entry.document
        navigation.navigate("BlogRead", {
            id: entry.id,
            extra: {
                id: entry.id,
                title: blog.title,
                date_str: blog.date.toISOString(),
                author: blog.author,
                author_id: blog.author_id,
                image_url: blog.image_url
            } as Partial<BlogEntry>
        })
    }

    const handleShare = () => {
        const path = `list`
        const url = "https://expo.io/@ezander/YouBlog/" + path
        const message = `Check out this cool blogging app! \n "${url}"`
        Share.share({
            title: "Share this blogging app", message, url
        })
    }

    navigation.setOptions({
        // title: title,
        // @ts-ignore
        extraHeaderItems: [
            <Item key="share" title="Share" iconName="share" onPress={handleShare} />,
            authItem
        ]
    })

    if (error) {
        return <ErrorScreen text="An error occurred loading blog entries" error={error} onRetry={doRefresh} />
    }

    return <Screen>
        <View style={{ padding: 10 }}>
            <Text h4>Latest blog entries</Text>
        </View>
        <View style={{ width: "100%", padding: 10, flex: 1 }}>
            <FlatList<BlogEntryWithId>
                data={result}
                renderItem={({ item }) => <BlogListEntry entry={item} onSelect={() => entrySelected(item)} />}
                refreshing={!hasRun || isWorking}
                onRefresh={doRefresh}
            />
        </View>
    </Screen>
}

export default withErrorBoundary(BlogListScreen)