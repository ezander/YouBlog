import * as ImagePicker from "expo-image-picker";
import { ImageInfo as _ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { CONSTANTS, JSHash } from "react-native-hash";
import { appLogger } from "./Logging";


type ImageInfo = Required<
  Pick<_ImageInfo, "uri" | "width" | "height" | "base64">
>;

export async function takeOrPickImage(take: "take" | "pick") {
  const aspect: [number, number] = [16, 9];
  const options = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect,
    quality: 0.5,
    allowsMultipleSelection: false,
    exif: false,
    base64: true,
  };

  // ImagePicker.getCameraPermissionsAsync()
  // ImagePicker.getCameraRollPermissionsAsync()

  let result =
    take === "take"
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

  if (result.cancelled) {
    return;
  }
  appLogger.info(
    `User picked image of size ${result.width}x${result.height}: ${result.uri}`
  );

  const info: ImageInfo = {
    uri: result.uri,
    width: result.width,
    height: result.height,
    base64: result.base64!,
  };

  return info;
}

export function getExtension(name: string) {
  if (name.indexOf(".") < 0) return "";
  return name.substr(name.lastIndexOf("."));
}

export async function createHashFilename(basename: string, data: string) {
  const alg = CONSTANTS.HashAlgorithms.sha256;
  // @ts-ignore Type definitions in react-native-hash are somewhat messsed up...
  const hash = await JSHash(data, alg);
  const ext = getExtension(basename);
  return hash + ext;
}

export async function transferUrl(
  srcUrl: string,
  destUrl: string,
  progressCallback: (bytesTransferred: number, bytesTotal: number) => any
) {}

// useEffect(() => {ImagePicker.getCameraPermissionsAsync()}, [])
// useEffect(() => {ImagePicker.getCameraRollPermissionsAsync()}, [])
