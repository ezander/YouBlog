import { StackHeaderProps } from '@react-navigation/stack';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { Button, Header, Icon, Avatar } from 'react-native-elements';

function NavHeader({ headerProps, onOpenMenu }: { headerProps: StackHeaderProps, onOpenMenu: any }) {
    const { scene, previous, navigation } = headerProps

    const { options } = scene.descriptor;
    let title =
        options.headerTitle !== undefined
            ? options.headerTitle
            : options.title !== undefined
                ? options.title
                : scene.route.name;

    const leftAction = previous ? navigation.goBack : onOpenMenu
    const leftIcon = previous ? 'arrow-back' : 'menu'
    // const goBack = 
    // style={options.headerStyle}

    const color = Platform.select({android: "#fff", default: "#000"})
    const leftComponent = <TouchableOpacity onPress={leftAction}>
        <Icon name={leftIcon} size={25} color={color}/>
    </TouchableOpacity>
    const centerComponent = { text: title, style: { color: color } }
    // const rightComponent = { icon: 'home', color: color }
    const rightComponent = <Avatar rounded title="EZ"/>


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

