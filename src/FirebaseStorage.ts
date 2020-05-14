import axios, { AxiosRequestConfig, Method } from "axios";
import { FirebaseConfig } from "./FirebaseTools";
import { networkLogger } from "./Logging";
import {
  extendPath,
  getMimetype,
  httpSimplePost,
  PathDef,
  pathDefToString,
} from "./Networking";

function makeParent(path: PathDef, firebaseConfig: FirebaseConfig) {
  const { storageBucket } = firebaseConfig;
  const fullPath = pathDefToString(path);
  return `b/${storageBucket}/o/${fullPath}`;
}

export type ProgressCallbackType = (
  bytes: number,
  total: number,
  name: string,
  finished: boolean
) => any;

export async function makeStorageRequest(
  method: Method,
  path: PathDef,
  params: undefined | URLSearchParams,
  data: undefined | any,
  firebaseConfig: FirebaseConfig,
  token?: string,
  extraConfig?: AxiosRequestConfig,
  progressCallback?: ProgressCallbackType
) {
  // const base_url = "https://firebasestorage.googleapis.com/v0/";
  const base_url = "https://storage.googleapis.com/upload/storage/v1/";
  const parent = makeParent(path, firebaseConfig);
  const headers: any = extraConfig?.headers || {};
  if (token) {
    headers["Authorization"] = "Bearer " + token; // access_token
  }

  progressCallback && progressCallback(0, data.length, parent, true);

  const config: AxiosRequestConfig = {
    url: base_url + parent,
    // url: "http://192.168.178.25:8081", // for testing
    method,
    validateStatus: () => true,
    headers,
    ...extraConfig,
    onUploadProgress: function (progressEvent) {
      // Do whatever you want with the native progress event
      // @ts-ignore
      progressCallback &&
        progressCallback(
          progressEvent.loaded,
          progressEvent.total,
          parent,
          true
        );
    },
  };
  if (params) config.params = params;
  if (data) config.data = data;

  try {
    networkLogger.debug("Storage request config: ", config);
    const response = await axios(config);
    networkLogger.info(
      `Received storage response of length: ${response.headers["content-length"]}`
    );
    networkLogger.debug("Storage request config: ", config);
    return response;
  } finally {
    progressCallback &&
      progressCallback(data.length, data.length, parent, true);
  }
}

export async function createResource(
  path: PathDef,
  resourceId: string,
  data: any,
  firebaseConfig: FirebaseConfig,
  token?: string,
  progressCallback?: ProgressCallbackType
) {
  try {
    const params = new URLSearchParams();

    const mimetype = getMimetype(resourceId);

    const { content, contentHeaders } = httpSimplePost(data, mimetype);

    params.append("uploadType", "media");
    params.append("name", pathDefToString(extendPath(path, resourceId)));

    const response = await makeStorageRequest(
      "post",
      [],
      params,
      content,
      firebaseConfig,
      token,
      {
        headers: contentHeaders,
      },
      progressCallback
    );

    return response;
  } catch (e) {
    networkLogger.error("Error in create resource: ", e.message);
    networkLogger.debug("Error details: ", e);
    throw e;
  }
}

// export async function getResourceAsStream(
//   path: PathDef,
//   resourceId: string,
//   firebaseConfig: FirebaseConfig,
//   token?: string
// ) {
//   const params = new URLSearchParams();
//   params.append("alt", "media");

//   const data = await makeStorageRequest(
//     "get",
//     extendPath(path, resourceId),
//     params,
//     undefined,
//     firebaseConfig,
//     token,
//     { responseType: "stream" }
//   );
//   return data;
//   // return fromFirestoreDocument(data, makeParent(path, firebaseConfig))
// }

// export async function listResources(
//   path: PathDef,
//   firebaseConfig: FirebaseConfig,
//   token?: string
// ) {
//   const params = new URLSearchParams();

//   const data = await makeStorageRequest(
//     "get",
//     path,
//     params,
//     undefined,
//     firebaseConfig,
//     token
//   );
//   return data; // data.documents.map((doc: any) => fromFirestoreDocument(doc, makeParent(collection, firebaseConfig)))
// }

// export async function deleteResource(
//   path: string,
//   resource: string,
//   firebaseConfig: FirebaseConfig,
//   token?: string
// ) {
//   return await makeStorageRequest(
//     "delete",
//     path + "/" + resource,
//     undefined,
//     undefined,
//     firebaseConfig,
//     token
//   );
// }
