import Axios, { AxiosRequestConfig, Method } from "axios";
import { networkLogger } from "../config/Logging";

export type PathDef = string | string[];

export function pathDefToString(path: PathDef) {
  return Array.isArray(path) ? path.join("/") : path;
}

export function extendPath(path1: PathDef, path2?: PathDef): PathDef {
  const toArray = (s: PathDef | undefined) =>
    Array.isArray(s) ? s : s ? [s] : [];
  return [...toArray(path1), ...toArray(path2)];
}

export function getExtension(name: string, includePoint: boolean=true) {
  if (name.indexOf(".") < 0) return "";
  return name.substr(name.lastIndexOf(".") + (includePoint?0:1));
}

function toUint8Array(bstr: string) {
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n) {
    u8arr[n - 1] = bstr.charCodeAt(n - 1);
    n -= 1; // to make eslint happy
  }
  return u8arr;
}

export function httpFormData(base64: string, mimetype: string) {
  // this is not really optimal with the boundary... should be generated dynamically
  const boundary = "-----------------------------62915494542230995342154047584";

  const arr = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="file"`,
    `Content-Type: ${mimetype}`,
    ``,
    atob(base64),
    `--${boundary}--`,
  ];

  const content = toUint8Array(arr.join("\n") + "\n");
  const contentHeaders = {
    "Content-Type": `multipart/form-data; boundary=${boundary}`,
    "Content-Length": content.length.toString(),
  };
  return { content, contentHeaders };
}

export function httpSimplePost(base64: string, mimetype: string) {
  const content = toUint8Array(atob(base64));
  const contentHeaders = {
    "Content-Type": mimetype,
    "Content-Length": content.length.toString(),
  };
  return { content, contentHeaders };
}

export function getMimetype(
  filename: string,
  defaultMimetype: string = "application/x-binary"
) {
  const ext = getExtension(filename, false);
  switch (ext.toLowerCase()) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "svg":
      return "image/svg";
    case "txt":
      return "text/plain";
    default:
      return defaultMimetype;
  }
}

export async function makeRequest(
  method: Method,
  path: PathDef,
  params: undefined | URLSearchParams,
  data: undefined | any,
  token?: string,
  extraConfig?: AxiosRequestConfig
) {
  const headers: any = {};
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const config: AxiosRequestConfig = {
    url: pathDefToString(path),
    method,
    // validateStatus: () => true,
    headers,
    ...extraConfig,
  };
  if (params) config.params = params;
  if (data) config.data = data;

  networkLogger.info("Request: ", JSON.stringify(config));
  try {
    const response = await Axios(config);
    console.log(response.headers["content-length"]);
    return response;
  } catch (error) {
    networkLogger.error("Network error: ", error.message);
    console.log(error);

    // throw error;
    return;
  }
  // return await handleResponse(response);
}

export async function getResourceAsStream(
  path: PathDef,
  params?: URLSearchParams,
  token?: string
) {
  const response = await makeRequest(
    "get",
    path,
    params,
    undefined,
    token
    // { responseType: "stream" }
    // { responseType: "arraybuffer" }
  );
  console.log(response);

  return response;
  // return fromFirestoreDocument(data, makeParent(path, firebaseConfig))
}
