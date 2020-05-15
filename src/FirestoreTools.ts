import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { createError } from "./FirebaseErrors";
import { FirebaseConfig, HTTPError } from "./FirebaseTools";
import { networkLogger } from "../config/Logging";

export function mapObject<T>(
  obj: T,
  func: (value: any, key: string) => any
): T {
  const res: T = {} as T;
  for (const key in obj) {
    res[key] = func(obj[key], key);
  }
  return res;
}

type FirestoreField =
  | { nullValue: null }
  | { stringValue: string }
  | { timestampValue: Date }
  | { booleanValue: boolean }
  | { integerValue: number }
  | { doubleValue: number }
  | { arrayValue: { values: FirestoreField[] } }
  | { mapValue: { fields: any } };

export function toFirestoreField(value: any): FirestoreField {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }
  if (typeof value === "string") return { stringValue: value };
  if (value instanceof Date) return { timestampValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number" && Number.isInteger(value))
    return { integerValue: value };
  if (typeof value === "number") return { doubleValue: value };
  if (value instanceof Array)
    return { arrayValue: { values: value.map(toFirestoreField) } };
  if (value instanceof Object)
    return { mapValue: { fields: mapObject(value, toFirestoreField) } };

  // "bytesValue": string,
  // "referenceValue": string,
  // "geoPointValue": {object(LatLng)},

  throw Error(`Unknown type: ${typeof value} ${value}`);
}

export function fromFirestoreField(field: any): any {
  if ("nullValue" in field) return field.nullValue;
  if ("stringValue" in field) return field.stringValue;
  if ("timestampValue" in field) return new Date(field.timestampValue);
  if ("booleanValue" in field) return field.booleanValue;
  if ("doubleValue" in field) return Number.parseFloat(field.doubleValue);
  if ("integerValue" in field) return Number.parseInt(field.integerValue);
  if ("arrayValue" in field)
    return field.arrayValue.values.map(fromFirestoreField);
  if ("mapValue" in field)
    return mapObject(field.mapValue.fields, fromFirestoreField);

  // "bytesValue": string,
  // "referenceValue": string,
  // "geoPointValue": {object(LatLng)},

  throw Error(`Unknown type: ${typeof field} ${field}`);
}

interface DocumentInfo {
  createTime: Date;
  updateTime: Date;
  name: string;
  id: string;
}
type Document<T> = {
  fields: T;
};

export function toFirestoreDocument<T>(obj: T): Document<T> {
  return { fields: mapObject(obj, toFirestoreField) };
}

export function fromFirestoreDocument(doc: any, parent?: string): any {
  const id =
    parent && doc.name.startsWith(parent) && doc.name.slice(parent.length + 1);
  try {
    return {
      document: mapObject(doc.fields, fromFirestoreField),
      name: doc.name,
      createTime: new Date(doc.createTime),
      updateTime: new Date(doc.updateTime),
      id,
    };
  } catch (error) {
    // console.error(error)
    throw error;
  }
}

export function toFirestoreParams(obj: any, params?: URLSearchParams) {
  function addToParams(value: any, path: string, params: URLSearchParams) {
    if (typeof value === "string") params.append(path, value);
    else if (value instanceof Date) params.append(path, value.toString());
    else if (typeof value === "boolean") params.append(path, value.toString());
    else if (typeof value === "number") params.append(path, value.toString());
    else if (value instanceof Array)
      value.map((v) => addToParams(v, path, params));
    else if (value instanceof Object)
      for (const key in value) {
        addToParams(
          value[key],
          path + (path.length > 0 ? "." : "") + key,
          params
        );
      }
    return params;
  }
  return addToParams(obj, "", params || new URLSearchParams());
}

function handleResponse(response: AxiosResponse) {
  networkLogger.debug(
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

function makeParent(
  collection: string | string[],
  firebaseConfig: FirebaseConfig
) {
  const { projectId } = firebaseConfig;
  const path =
    typeof collection === "string" ? collection : collection.join("/");
  return `projects/${projectId}/databases/(default)/documents/${path}`;
}

export async function makeFirestoreRequest(
  method: Method,
  collection: string | string[],
  params: undefined | URLSearchParams,
  data: undefined | any,
  firebaseConfig: FirebaseConfig,
  token?: string
) {
  const base_url = "https://firestore.googleapis.com/v1/";
  const parent = makeParent(collection, firebaseConfig);
  const headers: any = {};
  if (token) {
    headers["Authorization"] = "Bearer " + token; // access_token
  }

  const config: AxiosRequestConfig = {
    url: base_url + parent,
    method,
    validateStatus: () => true,
    headers,
  };
  if (params) config.params = params;
  if (data) config.data = data;

  const response = await axios(config);
  return await handleResponse(response);
}

export async function createDocument(
  collection: string,
  object: any,
  documentId: undefined | string,
  firebaseConfig: FirebaseConfig,
  token?: string
) {
  const params = new URLSearchParams();
  if (documentId) toFirestoreParams({ documentId: documentId }, params);
  const doc = toFirestoreDocument(object);

  const data = await makeFirestoreRequest(
    "post",
    collection,
    params,
    doc,
    firebaseConfig,
    token
  );
  return fromFirestoreDocument(data, makeParent(collection, firebaseConfig));
}

export async function patchDocument(
  collection: string,
  object: any,
  documentId: string,
  firebaseConfig: FirebaseConfig,
  token?: string
) {
  const params = new URLSearchParams();
  // if (documentId) toFirestoreParams({ 'documentId': documentId }, params)
  const doc = toFirestoreDocument(object);

  const data = await makeFirestoreRequest(
    "patch",
    [collection, documentId],
    params,
    doc,
    firebaseConfig,
    token
  );
  return fromFirestoreDocument(data, makeParent(collection, firebaseConfig));
}

export async function getDocument(
  collection: string,
  documentId: string,
  options: { mask?: string[] },
  firebaseConfig: FirebaseConfig,
  token?: string
) {
  const params = new URLSearchParams();
  if (options.mask)
    toFirestoreParams({ mask: { fieldPaths: options.mask } }, params);

  const data = await makeFirestoreRequest(
    "get",
    [collection, documentId],
    params,
    undefined,
    firebaseConfig,
    token
  );
  return fromFirestoreDocument(data, makeParent(collection, firebaseConfig));
}

export async function hasDocument(
  collection: string,
  documentId: string,
  testField: undefined | string,
  firebaseConfig: FirebaseConfig,
  token?: string
) {
  try {
    await getDocument(
      collection,
      documentId,
      testField ? { mask: [testField] } : {},
      firebaseConfig,
      token
    );
    return true;
  } catch (error) {
    // if( error.data.status )
    return false;
  }
}
export async function listDocuments(
  collection: string,
  options: { mask?: string[]; orderBy?: string },
  firebaseConfig: FirebaseConfig,
  token?: string
) {
  const params = new URLSearchParams();
  if (options.mask)
    toFirestoreParams({ mask: { fieldPaths: options.mask } }, params);
  if (options.orderBy) toFirestoreParams({ orderBy: options.orderBy }, params);

  const data = await makeFirestoreRequest(
    "get",
    collection,
    params,
    undefined,
    firebaseConfig,
    token
  );
  return data.documents.map((doc: any) =>
    fromFirestoreDocument(doc, makeParent(collection, firebaseConfig))
  );
}

export async function deleteDocument(
  collection: string,
  documentId: string,
  options: {},
  firebaseConfig: FirebaseConfig,
  token?: string
) {
  return await makeFirestoreRequest(
    "delete",
    collection + "/" + documentId,
    undefined,
    undefined,
    firebaseConfig,
    token
  );
}
