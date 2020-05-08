import React from 'react'
import MarkdownRenderer, {
    MarkdownProps as MarkdownRendererProps,
    styles as defaultMarkdownStyles
} from 'react-native-markdown-display'
import { Platform, StyleSheet } from 'react-native'
import { FontFaces } from '../config/Theming'

export type MarkdownProps = MarkdownRendererProps & {
    fontSize?: number,
    textFontFamily?: string,
    codeFontFamily?: string,
    children: string | string[]
}

export default function Markdown<Props>({ 
    fontSize, codeFontFamily, textFontFamily, children, ...props }: MarkdownProps) {
    const text = Array.isArray(children)  ? children.join("\n") : children

    const style = markdownStyles(fontSize, textFontFamily, codeFontFamily)
    return <MarkdownRenderer style={style} {...props}>
        {text}
    </MarkdownRenderer>
}


function markdownStyles(
    baseFontSize: number = 14,
    textFontFamily: string = FontFaces.serif,
    codeFontFamily: string = FontFaces.monospace
) {
    const codeProps = {
        fontFamily: codeFontFamily,
        backgroundColor: "#F0F0D0"
    }

    const styles: any = {
        code_block: {
            ...codeProps
        },
        code_inline: {
            ...codeProps,
            // backgroundColor: "#F3F3F3"
        },
        fence: {
            ...codeProps
        },
        text: {
            fontFamily: textFontFamily,
        },
        heading1: {
            fontSize: 24,
        },
        heading2: {
            fontSize: 20,
        },
        heading3: {
            fontSize: 18,
        },
        heading4: {
            fontSize: 16,
        },
        heading5: {
            fontSize: 14,
            fontWeight: 'bold',
        },
        heading6: {
            fontSize: 14,
            fontStyle: 'italic',
        },
        body: {
            fontSize: 14,
        },
    }

    for (const key in defaultMarkdownStyles) {
        styles[key] = { ...defaultMarkdownStyles[key], ...styles[key] }
    }

    const scaleFactor = baseFontSize / 14
    for (const key in styles) {
        if ("fontSize" in styles[key]) {
            const fontSize = styles[key].fontSize
            styles[key].fontSize = Math.round(fontSize * scaleFactor)
        }
    }
    // console.log("Factor: ", scaleFactor)
    // console.log("styles: ", styles)

    return StyleSheet.create(styles)
}