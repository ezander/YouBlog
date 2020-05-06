import { StackHeaderProps } from '@react-navigation/stack';
import React from 'react';
import { Platform, TouchableOpacity, Share } from 'react-native';
import { Header, Icon, Avatar } from 'react-native-elements';
import { HeaderButton, HeaderButtons, HiddenItem, Item } from 'react-navigation-header-buttons';
import ThemedIcon, { IoniconIcon, MaterialIcon, SpecialisedThemedIconProps } from './ThemedIcon';
import { getPathFromState } from '@react-navigation/native';
import { HeaderTheme } from '../config/Theming';
import { Linking } from 'expo';






function NavHeader({ headerProps, onOpenMenu }: { headerProps: StackHeaderProps, onOpenMenu?: any }) {
    const { scene, previous, navigation } = headerProps

    const { options } = scene.descriptor;
    let title =
        options.headerTitle !== undefined
            ? options.headerTitle
            : options.title !== undefined
                ? options.title
                : scene.route.name;

    const leftHeaderItems: Array<JSX.Element> = []
    const rightHeaderItems: Array<JSX.Element> = []

    if (previous) {
        leftHeaderItems.push(
            <Item key="back" title="Back" iconName="back" onPress={navigation.goBack} />
        )
    }
    if (onOpenMenu) {
        leftHeaderItems.push(
            <Item key="menu" title="Menu" iconName="menu" onPress={onOpenMenu} />
        )
    }

    // console.log(scene.route)
    const route = scene.route
    const name = route.name
    const params: any = route.params
    const edit = true // check whether logged in and owner of entry

    if (name === "BlogEntry" && edit && params) {
        const handlePress = () => { 
            navigation.navigate("BlogEdit", { 
                id: params.id, 
                title: params.title, 
                author: params.author,
                image_url: params.image_url
             })
        }
        rightHeaderItems.push(<Item key="edit" title="Edit" iconName="edit" onPress={handlePress} />)
    }

    if (name === "BlogEntry" && params && params.id) {
        // getPathFromState
        // @ts -ignore
        const path = 'post/' + params?.id
        console.log("makeUrl: ", Linking.makeUrl(path))
        // Linking.
        const url = "https://expo.io/@ezander/YouBlog/" + path
        const message = `Read this! \n "${url}"`

        const handlePress = () => Share.share({
            title: "Share this blog post", message, url
        })
        rightHeaderItems.push(<Item key="share" title="Share" iconName="share" onPress={handlePress} />)
    }


    // rightHeaderItems.push(<Avatar rounded title="EZ" key="avatar" />)

    function IconComponent(props: SpecialisedThemedIconProps) {
        const iconSize = HeaderTheme.iconSize
        const iconColor = HeaderTheme.iconColor
        return <ThemedIcon theme={HeaderTheme.iconTheme} {...props} size={iconSize} color={iconColor} />
    }

    const ThemedHeaderButton = (props: any) => {
        return <HeaderButton IconComponent={IconComponent} {...props} />
    }

    const leftComponent = <HeaderButtons
        HeaderButtonComponent={ThemedHeaderButton}
        OverflowIcon={<IconComponent name="more" />}
        children={leftHeaderItems}
    />

    const rightComponent = <HeaderButtons
        HeaderButtonComponent={ThemedHeaderButton}
        OverflowIcon={<IconComponent name="more" />}
        children={rightHeaderItems}
    />
    // const rightComponent = <Avatar rounded title="EZ" key="avatar" />

    const centerComponent = {
        text: title,
        style: {
            color: HeaderTheme.textColor,
            fontSize: HeaderTheme.fontSize
        }
    }

    return (
        <Header
            leftComponent={leftComponent}
            centerComponent={centerComponent}
            rightComponent={rightComponent}
            containerStyle={{
                paddingTop: 0, height:
                    Platform.select({
                        android: 50,
                        default: 44,
                    }),
            }}

        />
    );
}

export default NavHeader

