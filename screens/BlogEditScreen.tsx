import React from 'react'
import TextScreen from '../components/TextScreen'


export function BlogEditScreen({navigation, route, ...props}) {
    return <TextScreen text={"This is the blog edit screen for:\n" + route.params.id}/>
}

export default BlogEditScreen