import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { FlatList, TouchableHighlight, View } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { withErrorBoundary } from '../components/AppErrorBoundary';
import Screen from '../components/Screen';
import TextScreen from '../components/TextScreen';
import firebaseConfig from '../firebaseConfig.json';
import { useAsyncAction } from '../src/AsyncTools';
import { listDocuments } from '../src/FirestoreTools';

async function fetchBlogEntries(): Promise<BlogList> {
    const mask = ["title", "author", "date", "image_url"]
    const orderBy = "date desc"

    console.log("Fetching documents...")
    return listDocuments("blog_entries", { mask, orderBy }, firebaseConfig)
}

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
    const [refresh, setRefresh] = useState(0)

    const doFetchBlogEntries = useCallback(() => fetchBlogEntries(), [refresh])

    const { hasRun, isWorking, error, result } = useAsyncAction<BlogList>(doFetchBlogEntries)

    if (error) {
        return <TextScreen text="An error occurred loading blog entries" />
    }

    const entrySelected = (entry: BlogEntryWithId) => {
        const blog = entry.document
        navigation.navigate("BlogEntry", { 
            id: entry.id, 
            title: blog.title, 
            date_str: blog.date.toISOString(),
            author: blog.author,
            image_url: blog.image_url
         })
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
                onRefresh={() => { setRefresh(refresh => refresh + 1) }}
            />
        </View>
    </Screen>
}

export default withErrorBoundary(BlogListScreen)