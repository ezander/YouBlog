import React, { useCallback } from 'react'
import TextScreen from '../components/TextScreen'
import Screen from '../components/Screen'
import { Text, Image } from 'react-native'
// import Markdown from 'react-native-markdown-renderer'
import Markdown from 'react-native-markdown-simple'
import { ScrollView } from 'react-native-gesture-handler'
import firebaseConfig from '../firebaseConfig.json'
import { fetchItem, fetchAll } from '../src/FirebaseDatabaseTools'
import { useAsyncAction } from '../src/AsyncTools'
import LoadingScreen from '../components/LoadingScreen'

async function fetchBlogEntry(id: string): Promise<BlogEntryWithId> {
    return fetchItem("/blog_entries", id, firebaseConfig)
}

function BlogReadScreen({ navigation, route }) {
    const { id, title } = route.params

    // use useCallback and useMemo?
    const fetchThisBlogEntry = useCallback(fetchBlogEntry.bind(null, id), [id])
    const { hasRun, isWorking, error, result } = useAsyncAction<BlogEntryWithId>(fetchThisBlogEntry)

    if (!hasRun || isWorking) {
        return <LoadingScreen text={`Loading blog entry: ${title}`} />
    }

    if (error) {
        return <TextScreen text="An error occurred loading blog entry" />
    }

    const entry = result as BlogEntryWithId
    const { text, author, date, image_url } = entry


    return (<Screen>
        <ScrollView>
            <Markdown>
                # {title} {'\n\n'}
                _{author}_ | _{date}_ {'\n'}
            </Markdown>
            <Image resizeMethod="auto" resizeMode="cover" source={{uri: image_url}}
            style={{width: "100%", height: 200}}/>
            <Markdown>{text}</Markdown>
        </ScrollView>
    </Screen>)
}

export default BlogReadScreen