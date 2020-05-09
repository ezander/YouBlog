import { StackNavigationProp, StackNavigationOptions } from '@react-navigation/stack'
import moment from 'moment'
import React, { useCallback } from 'react'
import { ActivityIndicator, RefreshControl, Share, StyleSheet } from 'react-native'
import { Image, Text } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import { Item } from 'react-navigation-header-buttons'
import { RootStackParamList } from '../App'
import { withErrorBoundary } from '../components/AppErrorBoundary'
import { useAuthItem, useAuthState, useIsLoggedIn } from '../components/AuthItem'
import ErrorScreen from '../components/ErrorScreen'
import LoadingScreen from '../components/LoadingScreen'
import Markdown from '../components/Markdown'
import Screen from '../components/Screen'
import { BlogFontSizes, BlogTheme } from '../config/Theming'
import { BlogEntryWithId, fetchBlogEntry, BlogEntry } from '../model/Blog'
import { useAsyncAction } from '../src/AsyncTools'
import { RouteProp } from '@react-navigation/native'

// @ts -ignore
interface BlogReadScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'BlogRead'>,
    route: RouteProp<RootStackParamList, 'BlogRead'>,
}
export interface BlogReadParams { id: string, 
    extra?: { 
        id: string,
        author: string,
        author_id: string,
        title: string, 
        date_str: string,
        image_url: string
    } 
}

function BlogReadScreen({ navigation, route }: BlogReadScreenProps) {
    const params = route.params
    const id = params.id
    const from_params = params.extra?.id === id
    const extra_params = (from_params && params.extra) ? params.extra : undefined

    console.log(route)

    const authItem = useAuthItem()
    const isLoggedIn = useIsLoggedIn()
    const authState = useAuthState()
    console.log(authState)

    const fetchThisBlogEntry = useCallback(fetchBlogEntry.bind(null, id), [id])
    const { hasRun, isWorking, error, result, doRefresh } = useAsyncAction<BlogEntryWithId>(fetchThisBlogEntry)

    if (error) {
        const text = "An error occurred loading blog entry"
        return <ErrorScreen text={text} error={error} onRetry={doRefresh} />
    }


    const entry = result as BlogEntryWithId
    const doc = entry?.document
    const text = doc?.text
    const title = from_params ? extra_params?.title : doc?.title
    const author = from_params ? extra_params?.author : doc?.author
    const author_id = from_params ? extra_params?.author_id : doc?.author_id
    const image_url = from_params ? extra_params?.image_url : doc?.image_url
    const date = from_params ? new Date(extra_params?.date_str!) : doc?.date

    const handleEdit = () => {
        navigation.navigate("BlogEdit", { id, extra: { id, title, author, image_url } })
    }
    const editAllowed = isLoggedIn && authState.user.localId === author_id // check whether logged in and owner of entry


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
        // @ts-ignore
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

