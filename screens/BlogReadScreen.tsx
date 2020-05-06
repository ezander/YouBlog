import moment from 'moment'
import React, { useCallback } from 'react'
import { ActivityIndicator, Platform, StyleSheet } from 'react-native'
import { Image, Text, Card } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import { withErrorBoundary } from '../components/AppErrorBoundary'
import LoadingScreen from '../components/LoadingScreen'
import Screen from '../components/Screen'
import firebaseConfig from '../firebaseConfig.json'
import { useAsyncAction } from '../src/AsyncTools'
import { getDocument } from '../src/FirestoreTools'
import Markdown from '../components/Markdown'
async function fetchBlogEntry(id: string): Promise<BlogEntryWithId> {
    return getDocument("blog_entries", id, {}, firebaseConfig)
}

// function MarkdownLoader({ id, ...rest }: { id: string } & MarkdownProps) {
//     // use useCallback and useMemo?
//     const fetchThisBlogEntry = useCallback(fetchBlogEntry.bind(null, id), [id])
//     const { hasRun, isWorking, error, result } = useAsyncAction<BlogEntryWithId>(fetchThisBlogEntry)

//     if (!hasRun || isWorking) {
//         return <LoadingScreen text={'Loading blog entry...'} />
//     }

//     if (error) {
//         return <TextScreen text="An error occurred loading blog entry" />
//     }
//     const entry = result as BlogEntryWithId
//     const { text } = entry.document

//     return <Markdown {...rest}>{text}</Markdown>
// }

// @ts-ignore
function BlogReadScreen({ navigation, route }) {
    const id = route.params.urlId || route.params.id
    const from_params = !route.params.urlId

    const fetchThisBlogEntry = useCallback(fetchBlogEntry.bind(null, id), [id])
    const { hasRun, isWorking, error, result } = useAsyncAction<BlogEntryWithId>(fetchThisBlogEntry)
    console.log("ASync: ", hasRun, isWorking, error)

    if (error) {
        // throw error;
        const text = "An error occurred loading blog entry"
        return (<Screen>
            <Card>
                <Text>{text}</Text>
                <Text>{JSON.stringify(error)}</Text>
            </Card>
        </Screen>)

        // <TextScreen text="An error occurred loading blog entry" />
    }
    const entry = result as BlogEntryWithId
    const text = entry?.document?.text
    const { title, author, date_str, image_url } = from_params ? route.params : (entry?.document || {})

    console.log("BRS: ", route.params, from_params)

    console.log(id, { title, author, date_str, image_url })

    const date = from_params ? new Date(date_str) : entry?.document?.date

    // console.log("Route: ", route)
    // console.log("Nav: ", navigation)
    navigation.setOptions({
        title: title,
    })


    const fontSizes = {
        small: 10, normal: 14, large: 18, xlarge: 22
    }
    const fontSize = fontSizes.large
    const header = `\n # ${title} \n _${author}_ | _${moment(date).format('LLL')}_ \n`
    return (<Screen>
        <ScrollView style={styles.blogContainer}>
            <Text></Text>
            {
                title &&
                <Markdown fontSize={fontSize}>{header}</Markdown>
            }
            {
                image_url &&
                <Image resizeMethod="auto" resizeMode="cover" source={{ uri: image_url }}
                    style={{ width: "100%", height: 200 }}
                    PlaceholderContent={<ActivityIndicator />}
                />
            }
            {
                (!hasRun || isWorking) ?
                    <LoadingScreen text={'Loading blog entry...'} /> :
                    <Markdown fontSize={fontSize}>{text}</Markdown>
            }
        </ScrollView>
    </Screen>)
}

export default withErrorBoundary(BlogReadScreen)

const styles = StyleSheet.create({
    blogContainer: {
        paddingHorizontal: 10
    },
})

