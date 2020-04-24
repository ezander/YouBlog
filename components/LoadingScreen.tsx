import React from 'react'
import Screen from './Screen'
import { Text, ActivityIndicator } from 'react-native'

interface TextScreenProps {
    text: string
}

function LoadingScreen({ text }: TextScreenProps) {
    return (<Screen>
        <ActivityIndicator size="large" color="red"/>
        <Text>{text}</Text>
    </Screen>)
}

export default LoadingScreen
