import React from 'react';
import { Text, View } from 'react-native';
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import LoadingScreen from '../components/LoadingScreen';
import Screen from '../components/Screen';
import TextScreen from '../components/TextScreen';
import firebaseConfig from '../firebaseConfig.json';
import { useAsyncAction } from '../src/AsyncTools';
import { fetchAll } from '../src/FirebaseDatabaseTools';


async function fetchBlogEntries(): Promise<BlogList> {
    return fetchAll("/blog_entries", firebaseConfig)
}

function BlogListEntry({ entry, onSelect }: { entry: BlogEntryWithId, onSelect: (() => void) }) {
    return (
        <TouchableHighlight
            underlayColor="#CFC"
            activeOpacity={0.6}
            onPress={onSelect}>
            <View style={{ paddingBottom: 5 }}>
                <Text>{entry.title}</Text>
                <Text style={{ color: "grey", fontSize: 10 }}>10 points | {entry.author} | {entry.date}</Text>
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
        navigation.navigate("BlogEntry", { id: entry.id, title: entry.title, text: entry.text })
    }

    if (result) {
        return <Screen>
            <FlatList<BlogEntryWithId>
                data={result}
                renderItem={({ item }) => <BlogListEntry entry={item} onSelect={() => entrySelected(item)} />} />
        </Screen>
    }

    return <TextScreen text="Internal error." />
}
