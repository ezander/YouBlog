import React from 'react'
import { Icon, IconProps } from "react-native-elements"
import { Platform } from "react-native"

type IconDef = string | { name: string, type: string }

type IconMap = {
    back: IconDef,
    menu: IconDef,
    create: IconDef,
    edit: IconDef,
    add_photo: IconDef,
    camera: IconDef,
    share: IconDef,
    cancel: IconDef,
    done: IconDef,
    more: IconDef
}

const mapMaterial: IconMap = {
    back: "arrow-back",
    menu: "menu",
    create: "add",
    edit: "edit",
    add_photo: "add-a-photo",
    camera: "camera",
    share: "share",
    cancel: "close",
    done: "done",
    more: "more-vert"
}

const mapIosIonicons: IconMap = {
    back: "ios-arrow-back",
    menu: "ios-menu",
    create: "ios-add", // ios-create
    edit: "ios-create",
    add_photo: "ios-folder-open",
    camera: "ios-camera",
    share: "ios-share",
    cancel: "ios-close",
    done: "ios-checkmark", //"ios-done-all"
    more: { name: "more-vert", type: "material" }
}

const mapDefIonicons: IconMap = {
    back: "md-arrow-back",
    menu: "md-menu",
    create: "md-add", // ios-create
    edit: "md-create",
    add_photo: "md-folder-open",
    camera: "md-camera",
    share: "md-share",
    cancel: "md-close",
    done: "md-checkmark", //"ios-done-all"
    more: { name: "more-vert", type: "material" }
}

type IconTheme = "material" | "ionicon"

type ThemedIconProps = IconProps & {
    theme: IconTheme,
    name: keyof IconMap
}


function getThemeMap(theme: IconTheme) {
    switch (theme) {
        case "material":
            return { type: "material", map: mapMaterial }
        case "ionicon":
            return {
                type: "ionicon",
                map: Platform.select({ ios: mapIosIonicons, default: mapDefIonicons })
            }
        default:
            return { type: "material", map: mapMaterial }
    }
}

function ThemedIcon({ theme, name, ...props }: ThemedIconProps) {
    const {type, map} = getThemeMap(theme)
    const iconName = map[name] 
    if( !iconName ) throw new Error(`IconName ${name} not defined.`)

    const allProps = (typeof iconName === "string") ? { type, name: iconName, ...props } : { type, ...iconName, ...props }
    // console.log("AllProps: ", allProps)
    return <Icon {...allProps} />
}

export default ThemedIcon

export type SpecialisedThemedIconProps = Omit<ThemedIconProps, "theme">

export function MaterialIcon(props: SpecialisedThemedIconProps)  {
    console.log("MatProps: ", props)
    return <ThemedIcon theme="material" {...props}/>
}

export function IoniconIcon(props: SpecialisedThemedIconProps) {
    return <ThemedIcon theme="ionicon" {...props}/>
}
