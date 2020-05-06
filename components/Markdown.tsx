import React from 'react'
import MarkdownRenderer, {MarkdownProps as MarkdownRendererProps} from 'react-native-markdown-renderer'
import { styles as defaultMarkdownStyles } from 'react-native-markdown-renderer/src/lib/styles'
import { Platform, StyleSheet } from 'react-native'


export type MarkdownProps = MarkdownRendererProps & {
    fontSize: number,
    updateStyles: any
}

export default function Markdown<Props>({ fontSize, updateStyles, ...props }: MarkdownProps ) {
    return <MarkdownRenderer style={markdownStyles(fontSize)} {...props} />
}


const markdownStyles = (baseFontSize = 14) => {
    const factor = baseFontSize / 14
    const fontFamilyCode = Platform.select({ android: "monospace", ios: "Courier" })
    const fontFamilyBase = Platform.select({ android: "serif", ios: "Times New Roman" })

    const def = defaultMarkdownStyles;


    return StyleSheet.create({
        codeBlock: {
            ...def.codeBlock,
            fontFamily: fontFamilyCode
        },
        codeInline: {
            ...def.codeInline,
            fontFamily: fontFamilyCode
        },
        inlineCode: {
            ...def.inlineCode,
            fontFamily: fontFamilyCode
        },
        text: {
            ...def.text,
            fontFamily: fontFamilyBase
        }
    })
}