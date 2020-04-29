import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import LoadingScreen from '../components/LoadingScreen';
import Screen from '../components/Screen';
import TextScreen from '../components/TextScreen';
import firebaseConfig from '../firebaseConfig.json';
import { useAsyncAction } from '../src/AsyncTools';
import { listDocuments } from '../src/FirestoreTools';

async function fetchBlogEntries(): Promise<BlogList> {
    const mask = ["title", "author", "date"]
    const orderBy = "date desc"

    return listDocuments("blog_entries", { mask, orderBy }, firebaseConfig)
}

function BlogListEntry({ entry, onSelect }: { entry: BlogEntryWithId, onSelect: (() => void) }) {
    const blog = entry.document
    return (
        <TouchableHighlight
            underlayColor="#CFC"
            activeOpacity={0.6}
            onPress={onSelect}>
            <View style={{ paddingBottom: 5 }}>
                <Text>{blog.title}</Text>
                <Text style={{ color: "grey", fontSize: 10 }}>{blog.author} | {moment(blog.date).fromNow()}</Text>
            </View>
        </TouchableHighlight>)
}

export default function BlogListScreen({ navigation }: { navigation: any }) {

    const { hasRun, isWorking, error, result } = useAsyncAction<BlogList>(fetchBlogEntries)

    if (!hasRun || isWorking) {
        return <LoadingScreen text="Loading blog entries..." />
    }

    if (error) {
        return <TextScreen text="An error occurred loading blog entries" />
    }

    const entrySelected = (entry: BlogEntryWithId) => {
        // Alert.alert(entry.title, "Coming soon...")        
        const blog = entry.document
        navigation.navigate("BlogEntry", { id: entry.id, title: blog.title })
    }

    if (result) {
        return <Screen>
            <View style={{ padding: 10 }}>
                <Text h4>Latest blog entries</Text>
            </View>

            <FlatList<BlogEntryWithId>
                data={result}
                renderItem={({ item }) => <BlogListEntry entry={item} onSelect={() => entrySelected(item)} />} />
        </Screen>
    }

    return <TextScreen text="Internal error." />
}
