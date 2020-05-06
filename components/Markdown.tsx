import React from 'react'
// import MarkdownRenderer, {
//     MarkdownProps as MarkdownRendererProps, 
//     styles as defaultMarkdownStyles } 
//     from 'react-native-markdown-renderer'
import MarkdownRenderer, {
    MarkdownProps as MarkdownRendererProps,
    styles as defaultMarkdownStyles
} from 'react-native-markdown-display'
import { Platform, StyleSheet } from 'react-native'


export type MarkdownProps = MarkdownRendererProps & {
    fontSize?: number,
    updateStyles?: any,
    children: string | string[]
}

export default function Markdown<Props>({ fontSize, updateStyles, children, ...props }: MarkdownProps) {
    const text = (typeof children === "string") ? children : children.join("\n")
    return <MarkdownRenderer style={markdownStyles(fontSize)} {...props}>
        {text}
    </MarkdownRenderer>
}


const markdownStyles = (baseFontSize = 14) => {
    const factor = baseFontSize / 14
    const fontFamilyCode = Platform.select({ android: "monospace", ios: "Courier" })
    const fontFamilyBase = Platform.select({ android: "serif", ios: "Times New Roman" })
    const codeProps = {
        fontFamily: fontFamilyCode,
        backgroundColor: "#F0F0D0"
    }

    const styles: any = {
        code_block: {
            ...codeProps
        },
        code_inline: {
            ...codeProps,
            backgroundColor: "#F3F3F3"
        },
        fence: {
            ...codeProps
        },
        text: {
            fontFamily: fontFamilyBase,
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

    for (const key in styles) {
        if ("fontSize" in styles[key]) {
            const fontSize = styles[key].fontSize
            styles[key].fontSize = Math.round(fontSize * factor)
        }
    }
    console.log("Factor: ", factor)
    console.log("styles: ", styles)

    return StyleSheet.create(styles)
}