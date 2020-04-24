import React from 'react'
import Screen from './Screen'
import { Text } from 'react-native'

interface TextScreenProps {
    text: string
}

function TextScreen({ text }: TextScreenProps) {
    return (<Screen>
        <Text>{text}</Text>
    </Screen>)
}

export default TextScreen
