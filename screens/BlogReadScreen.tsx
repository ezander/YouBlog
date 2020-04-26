import React, { useCallback } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { Image } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import Markdown from 'react-native-markdown-simple'
import LoadingScreen from '../components/LoadingScreen'
import Screen from '../components/Screen'
import TextScreen from '../components/TextScreen'
import firebaseConfig from '../firebaseConfig.json'
import { useAsyncAction } from '../src/AsyncTools'
import { fetchItem } from '../src/FirebaseDatabaseTools'

async function fetchBlogEntry(id: string): Promise<BlogEntryWithId> {
    return fetchItem("blog_entries", id, firebaseConfig)
}

// @ts-ignore
function BlogReadScreen({ navigation, route }) {
    const { id, title } = route.params

    navigation.setOptions({
        title: title,
    })

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

    const fontSize = 14
    return (<Screen>
        <ScrollView style={styles.blogContainer}>
            <Markdown styles={markdownStyles(fontSize)}>
                # {title} {'\n\n'}
                _{author}_ | _{date}_ {'\n'}
            </Markdown>
            <Image resizeMethod="auto" resizeMode="cover" source={{ uri: image_url }}
                style={{ width: "100%", height: 200 }}
                PlaceholderContent={<ActivityIndicator />}
            />
            <Markdown styles={markdownStyles(fontSize)}>{text}</Markdown>
        </ScrollView>
    </Screen>)
}

export default BlogReadScreen

const styles = StyleSheet.create({
    blogContainer: {
        paddingHorizontal: 10
    },
})

const markdownStyles = (baseFontSize = 14) => {
    const factor = baseFontSize / 14
    return ({
        text: {
            fontFamily: "serif",
        },
        //     heading1: {
        //         fontSize: 32 * factor,
        //     },
        //     heading2: {
        //         fontSize: 24 * factor,
        //     },
        //     heading3: {
        //         fontSize: 18 * factor,
        //     },
        //     heading4: {
        //         fontSize: 16 * factor,
        //     },
        //     heading5: {
        //         fontSize: 13 * factor,
        //     },
        //     heading6: {
        //         fontSize: 11 * factor,
        //     },
        //     plainText: {
        //         fontSize: 14 * factor,
        //     },
        //     strong: {
        //         fontSize: 14 * factor,
        //     },
        //     u: {
        //         fontSize: 14 * factor,
        //     }
    })
}