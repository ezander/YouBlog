import moment from 'moment'
import React, { useCallback } from 'react'
import { ActivityIndicator, Platform, StyleSheet, Share } from 'react-native'
import { Image, Text, Card } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import { withErrorBoundary } from '../components/AppErrorBoundary'
import LoadingScreen from '../components/LoadingScreen'
import Screen from '../components/Screen'
import firebaseConfig from '../firebaseConfig.json'
import { useAsyncAction } from '../src/AsyncTools'
import { getDocument } from '../src/FirestoreTools'
import Markdown from '../components/Markdown'
import { BlogTheme, BlogFontSizes } from '../config/Theming'
import { Item } from 'react-navigation-header-buttons'
import { useAuthItem, useIsLoggedIn } from '../components/AuthItem'

async function fetchBlogEntry(id: string): Promise<BlogEntryWithId> {
    return getDocument("blog_entries", id, {}, firebaseConfig)
}

// @ts-ignore
function BlogReadScreen({ navigation, route }) {
    const id = route.params.urlId || route.params.id
    const from_params = !route.params.urlId
    const isLoggedIn = useIsLoggedIn()

    const fetchThisBlogEntry = useCallback(fetchBlogEntry.bind(null, id), [id])
    const { hasRun, isWorking, error, result } = useAsyncAction<BlogEntryWithId>(fetchThisBlogEntry)
    // console.log("ASync: ", hasRun, isWorking, error)

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
    const date = from_params ? new Date(date_str) : entry?.document?.date

    // console.log("BRS: ", route.params, from_params)
    // console.log(id, { title, author, date_str, image_url })
    // console.log("Route: ", route)
    // console.log("Nav: ", navigation)



    const handleLogin = () => {
        navigation.navigate("Login")
    }
    const handleEdit = () => {
        navigation.navigate("BlogEdit", { id, title, author, image_url })
    }
    const editAllowed = isLoggedIn // check whether logged in and owner of entry

    const handleShare = () => {
        const path = `post/${id}`
        const url = "https://expo.io/@ezander/YouBlog/" + path
        const message = `Read this! \n "${url}"`
        Share.share({
            title: "Share this blog post", message, url
        })
    }

    const authItem = useAuthItem()

    navigation.setOptions({
        title: title,
        extraHeaderItems: [
            editAllowed && <Item key="edit" title="Edit" iconName="edit" onPress={handleEdit} />,
            <Item key="share" title="Share" iconName="share" onPress={handleShare} />,
            // <Item key="login" title="Login" iconName="sign_up" onPress={handleLogin} />
            authItem
        ]
    })

    const fontSize = BlogFontSizes[BlogTheme.fontScale]
    const codeFF = BlogTheme.codeFontFamily
    const textFF = BlogTheme.textFontFamily

    const header = `\n # ${title} \n _${author}_ | _${moment(date).format('LLL')}_ \n`
    return (<Screen>
        <ScrollView style={styles.blogContainer}>
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

