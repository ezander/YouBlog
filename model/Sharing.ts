import { Platform, Share } from "react-native";
import { Linking } from "expo";

export const urlPrefixes = [
  Linking.makeUrl("/"),
  "https://expo.io/@ezander/YouBlog",
  "https://zandere.de/youblog",
]

export const deepLinkPrefix = urlPrefixes[1]

export function shareDeeplink(title: string, path: string, message: string) {
  const url = deepLinkPrefix + "/" + path;
  const messageWithUrl = `${message}\n${url}`;
  Share.share({
    title,
    message: Platform.select( {ios: message, default: messageWithUrl}),
    url,
  });
}
