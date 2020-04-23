import React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'


interface ScreenProps {
    style ?: Object,
    children?: Array<JSX.Element> | JSX.Element,
    rest?: any
}

function Screen({ style, children, ...rest } : ScreenProps ) {
    return (
        <View style={{...styles.screen, ...style}} {...rest }>
            { children }
        </View>)
}

export default Screen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#fff'
    }
})
