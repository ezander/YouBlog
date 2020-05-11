import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { createError } from "./FirebaseErrors";
import { FirebaseConfig, HTTPError } from "./FirebaseTools";

// export function mapObject<T>(
//     obj: T,
//     func: ((value: any, key: string) => any)
// ): T {
//     const res: T = {} as T
//     for (const key in obj) {
//         res[key] = func(obj[key], key)
//     }
//     return res
// }

function handleResponse(response: AxiosResponse) {
  console.log(
    "Axios: ",
    response.status,
    response.statusText,
    response.request.method,
    response.config.url,
    response.config.method,
    response.config.params
  );
  const between = (low: number, number: number, high: number) =>
    low <= number && number < high;
  //console.log("Axios success: ", response)
  const { status, statusText } = response;
  if (between(100, status, 200)) {
    // don't know how to handle informational messages
    throw new HTTPError(response.statusText + response.data.message);
  }
  if (between(200, status, 300)) {
    // OK
    // console.log("Data: ", response.data)
    return response.data;
  }
  if (between(300, status, 400)) {
    // don't know how to handle redirects and the like
    throw new HTTPError(response.statusText + response.data.message);
  }
  if (between(400, status, 500)) {
    // handle here: doc not found, 401, whatever...
    const error = createError(response);
    throw error;
  }

  throw new HTTPError(response.statusText + response.data.message);
}

function makeParent(path: PathDef, firebaseConfig: FirebaseConfig) {
  const { storageBucket } = firebaseConfig;
  const fullPath = pathDefToString(path);
  return `b/${storageBucket}/o/${fullPath}`;
}
// https://firebasestorage.googleapis.com/v0/b/youblog-814ae.appspot.com/o/books-1245690_1280.jpg

export type PathDef = string | string[];
export function pathDefToString(path: PathDef) {
  return Array.isArray(path) ? path.join("/") : path;
}

export function extendPath(path1: PathDef, path2: PathDef): PathDef {
  const toArray = (s: PathDef) => (Array.isArray(s) ? s : [s]);
  return [...toArray(path1), ...toArray(path2)];
}

export async function makeStorageRequest(
  method: Method,
  path: PathDef,
  params: undefined | URLSearchParams,
  data: undefined | any,
  firebaseConfig: FirebaseConfig,
  token?: string,
  extraConfig?: AxiosRequestConfig
) {
  const base_url = "https://firebasestorage.googleapis.com/v0/";
  const parent = makeParent(path, firebaseConfig);
  const headers: any = {};
  if (token) {
    headers["Authorization"] = "Bearer " + token; // access_token
  }

  const config: AxiosRequestConfig = {
    url: base_url + parent,
    method,
    validateStatus: () => true,
    headers,
    ...extraConfig,
  };
  if (params) config.params = params;
  if (data) config.data = data;

  const response = await axios(config);
  console.log(response.headers["content-length"]);
  return response;
  // return await handleResponse(response);
}

export async function createResource(
  path: PathDef,
  resourceId: undefined | string,
  data: any,
  firebaseConfig: FirebaseConfig,
  token?: string
) {
  const params = new URLSearchParams();
  // if (resourceId) toFirestoreParams({ documentId: resourceId }, params);
  // const doc = toFirestoreDocument(data)

  if (!resourceId) throw "al;ksdjf;laskdjf;la";

  const response = await makeStorageRequest(
    "post",
    extendPath(path, resourceId),
    params,
    data,
    firebaseConfig,
    token
  );
  return response; // fromFirestoreDocument(data, makeParent(path, firebaseConfig))
}

export async function getResource(
  path: PathDef,
  resourceId: string,
  firebaseConfig: FirebaseConfig,
  token?: string
) {
  const params = new URLSearchParams();
  params.append("alt", "media");

  const data = await makeStorageRequest(
    "get",
    extendPath(path, resourceId),
    params,
    undefined,
    firebaseConfig,
    token,
    { responseType: "stream" }
  );
  return data;
  // return fromFirestoreDocument(data, makeParent(path, firebaseConfig))
}

export async function listResources(
  path: PathDef,
  firebaseConfig: FirebaseConfig,
  token?: string
) {
  const params = new URLSearchParams();

  const data = await makeStorageRequest(
    "get",
    path,
    params,
    undefined,
    firebaseConfig,
    token
  );
  return data; // data.documents.map((doc: any) => fromFirestoreDocument(doc, makeParent(collection, firebaseConfig)))
}

export async function deleteResource(
  path: string,
  resource: string,
  firebaseConfig: FirebaseConfig,
  token?: string
) {
  return await makeStorageRequest(
    "delete",
    path + "/" + resource,
    undefined,
    undefined,
    firebaseConfig,
    token
  );
}
