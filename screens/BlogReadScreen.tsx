import moment from 'moment'
import React, { useCallback } from 'react'
import { ActivityIndicator, StyleSheet, Platform } from 'react-native'
import { Image } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import Markdown, { MarkdownProps } from 'react-native-markdown-simple'
import LoadingScreen from '../components/LoadingScreen'
import Screen from '../components/Screen'
import TextScreen from '../components/TextScreen'
import firebaseConfig from '../firebaseConfig.json'
import { useAsyncAction } from '../src/AsyncTools'
import { getDocument } from '../src/FirestoreTools'

async function fetchBlogEntry(id: string): Promise<BlogEntryWithId> {
    return getDocument("blog_entries", id, {}, firebaseConfig)
}

// interface MarkdownProps {
//     styles: any
// }
function MarkdownLoader({id, ...rest} : {id: string} & MarkdownProps) {
    // use useCallback and useMemo?
    const fetchThisBlogEntry = useCallback(fetchBlogEntry.bind(null, id), [id])
    const { hasRun, isWorking, error, result } = useAsyncAction<BlogEntryWithId>(fetchThisBlogEntry)

    const title="foo"
    if (!hasRun || isWorking) {
        return <LoadingScreen text={'Loading blog entry...'} />
    }

    if (error) {
        return <TextScreen text="An error occurred loading blog entry" />
    }
    const entry = result as BlogEntryWithId
    const { text } = entry.document

    return <Markdown {...rest}>{text}</Markdown>
}

// @ts-ignore
function BlogReadScreen({ navigation, route }) {
    const { id, blogInfo } = route.params

    navigation.setOptions({
        title: blogInfo.title,
    })

    const {title, author, date, image_url} = blogInfo

    const fontSize = 14
    return (<Screen>
        <ScrollView style={styles.blogContainer}>
            <Markdown styles={markdownStyles(fontSize)}>
                # {title} {'\n\n'}
                _{author}_ | _{moment(date).format('LLL')}_ {'\n'}
            </Markdown>
            <Image resizeMethod="auto" resizeMode="cover" source={{ uri: image_url }}
                style={{ width: "100%", height: 200 }}
                PlaceholderContent={<ActivityIndicator />}
            />
            <MarkdownLoader id={id} styles={markdownStyles(fontSize)}/>
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
            fontFamily: Platform.select({android: "serif", ios: "Times New Roman" })
        },
   })
}