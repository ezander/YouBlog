import * as ImagePicker from "expo-image-picker";
import { ImageInfo as _ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { CONSTANTS, JSHash } from "react-native-hash";
import firebaseConfig from "../firebaseConfig.json";
import { delay } from "./AsyncTools";
import { createResource, ProgressCallbackType } from "./FirebaseStorage";
import { appLogger } from "./Logging";
import Axios, { AxiosRequestConfig } from "axios";
import { getExtension, PathDef } from "./Networking";

export type ImageInfo = Required<
  Pick<_ImageInfo, "uri" | "width" | "height" | "base64">
>;

export type TakeOrPick = "take" | "pick"

export async function takeOrPickImage(take: TakeOrPick) {
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

export async function createHashFilename(basename: string, data: string) {
  const alg = CONSTANTS.HashAlgorithms.sha256;
  // @ts-ignore Type definitions in react-native-hash are somewhat messsed up...
  const hash = await JSHash(data, alg);
  const ext = getExtension(basename);
  return hash + ext;
}

async function compareMD5Hash(data: string, md5Hash: string) {
  return true;

  // need to check that later... they use base64 for md5hash instead of hex???...

  // const alg = CONSTANTS.HashAlgorithms.md5;
  // // @ts-ignore Type definitions in react-native-hash are somewhat messsed up...
  // const hash = await JSHash(atob(data), alg);
  // console.log(`Hashes: orig: "${hash}"  returned: "${md5Hash}"`)
  // const foo = atob(md5Hash)
  // let bar = ""
  // for( let i=0; i<foo.length; i++ ){
  //   const x = foo.charCodeAt(i)
  //   const chars = "0123456789abcdef"
  //   bar += chars[(x & 0xF0)>>4]
  //   bar += chars[x & 0x0F]
  // }
  // console.log(`Hashes: orig: "${btoa(hash)}"  returned: "${bar}"`)

  // return hash === foo;
}

export async function transferImage(
  image: ImageInfo,
  prefix: PathDef,
  progressCallback?: ProgressCallbackType,
  token?: string // not needed currently, doesn't work anyway
) {
  const path = prefix
  const resourceId= (await createHashFilename(image.uri, image.base64));

  try {
    const response = await createResource(
      path,
      resourceId,
      image.base64,
      firebaseConfig,
      token,
      progressCallback
    );
    const {id, mediaLink, selfLink, md5Hash, timeCreated, updated} = response.data
    appLogger.info("Created resource with link: " + mediaLink)
    appLogger.debug("Details: ", {id, mediaLink, selfLink, md5Hash, timeCreated, updated})

    // const hashesMatch = await compareMD5Hash(image.base64, md5Hash)

    return mediaLink
  } catch (error) {
    appLogger.error("Error uploading image: ", error.message)
    throw(error)
  }
}

