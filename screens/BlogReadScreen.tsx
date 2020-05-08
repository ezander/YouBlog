import moment from 'moment'
import React, { useCallback } from 'react'
import { ActivityIndicator, RefreshControl, Share, StyleSheet } from 'react-native'
import { Image, Text } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import { Item } from 'react-navigation-header-buttons'
import { withErrorBoundary } from '../components/AppErrorBoundary'
import { useAuthItem, useIsLoggedIn, useAuthState } from '../components/AuthItem'
import ErrorScreen from '../components/ErrorScreen'
import LoadingScreen from '../components/LoadingScreen'
import Markdown from '../components/Markdown'
import Screen from '../components/Screen'
import { BlogFontSizes, BlogTheme } from '../config/Theming'
import firebaseConfig from '../firebaseConfig.json'
import { useAsyncAction } from '../src/AsyncTools'
import { getDocument } from '../src/FirestoreTools'

async function fetchBlogEntry(id: string): Promise<BlogEntryWithId> {
    return getDocument("blog_entries", id, {}, firebaseConfig)
}

// @ts-ignore
function BlogReadScreen({ navigation, route }) {
    const id = route.params.urlId || route.params.id
    const from_params = !route.params.urlId

    const authItem = useAuthItem()
    const isLoggedIn = useIsLoggedIn()
    const authState = useAuthState()
    console.log(authState)

    const fetchThisBlogEntry = useCallback(fetchBlogEntry.bind(null, id), [id])
    const { hasRun, isWorking, error, result, doRefresh } = useAsyncAction<BlogEntryWithId>(fetchThisBlogEntry)
    // console.log("ASync: ", hasRun, isWorking, error)

    if (error) {
        const text = "An error occurred loading blog entry"
        return <ErrorScreen text={text} error={error} onRetry={doRefresh} />
    }
    const entry = result as BlogEntryWithId
    const text = entry?.document?.text
    const { title, author, date_str, image_url } = from_params ? route.params : (entry?.document || {})
    const date = from_params ? new Date(date_str) : entry?.document?.date
    const author_id = entry?.document?.author_id

    const handleLogin = () => {
        navigation.navigate("Login")
    }
    const handleEdit = () => {
        navigation.navigate("BlogEdit", { id, title, author, image_url })
    }
    console.log("Loggedin: ", authState)
    console.log("Loggedin user: ", authState.user)
    console.log("Author: ", author_id)
    const editAllowed = isLoggedIn && authState.user.localId===author_id // check whether logged in and owner of entry


    const handleShare = () => {
        const path = `post/${id}`
        const url = "https://expo.io/@ezander/YouBlog/" + path
        const message = `Read this! \n "${url}"`
        Share.share({
            title: "Share this blog post", message, url
        })
    }


    navigation.setOptions({
        title: title,
        extraHeaderItems: [
            editAllowed && <Item key="edit" title="Edit" iconName="edit" onPress={handleEdit} />,
            <Item key="share" title="Share" iconName="share" onPress={handleShare} />,
            authItem
        ]
    })

    const fontSize = BlogFontSizes[BlogTheme.fontScale]
    const codeFF = BlogTheme.codeFontFamily
    const textFF = BlogTheme.textFontFamily

    const header = `\n # ${title} \n _${author}_ | _${moment(date).format('LLL')}_ \n`
    return (<Screen>
        <ScrollView
            style={styles.blogContainer}
            refreshControl={<RefreshControl
                refreshing={!hasRun || isWorking}
                onRefresh={doRefresh} />
            }
        >
            <Text></Text>
            {
                title &&
                <Markdown fontSize={fontSize} textFontFamily={textFF} codeFontFamily={codeFF}>
                    {header}
                </Markdown>
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
                    <Markdown fontSize={fontSize} textFontFamily={textFF} codeFontFamily={codeFF}>
                        {text}
                    </Markdown>
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

