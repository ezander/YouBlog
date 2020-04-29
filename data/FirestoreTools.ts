import axios, { Method, AxiosRequestConfig } from 'axios'

export function mapObject<T>(
    obj: T,
    func: ((value: any, key: string) => any)
): T {
    const res: T = {} as T
    for (const key in obj) {
        res[key] = func(obj[key], key)
    }
    return res
}

type FirestoreField =
    | { "nullValue": null }
    | { "stringValue": string }
    | { "timestampValue": Date }
    | { "booleanValue": boolean }
    | { "integerValue": number }
    | { "doubleValue": number }
    | { "arrayValue": { values: FirestoreField[] } }
    | { "mapValue": { fields: any } }

export function toFirestoreField(value: any): FirestoreField {
    if (value === null || value === undefined) { return { "nullValue": null } }
    if (typeof value === "string") return { "stringValue": value }
    if (value instanceof Date) return { "timestampValue": value }
    if (typeof value === "boolean") return { "booleanValue": value }
    if (typeof value === "number" && Number.isInteger(value)) return { "integerValue": value }
    if (typeof value === "number") return { "doubleValue": value }
    if (value instanceof Array) return { "arrayValue": { values: value.map(toFirestoreField) } }
    if (value instanceof Object) return { "mapValue": { fields: mapObject(value, toFirestoreField) } }

    // "bytesValue": string,
    // "referenceValue": string,
    // "geoPointValue": {object(LatLng)},

    throw Error(`Unknown type: ${typeof value} ${value}`)
}

type Document<T> = { fields: T }
export function toFirestoreDocument<T>(obj: T): Document<T> {
    return { fields: mapObject(obj, toFirestoreField) }
}

export function toFirestoreParams(obj: any, params?: URLSearchParams) {
    function addToParams(value: any, path: string, params: URLSearchParams) {
        if (typeof value === "string") params.append(path, value)
        else if (value instanceof Date) params.append(path, value.toString())
        else if (typeof value === "boolean") params.append(path, value.toString())
        else if (typeof value === "number") params.append(path, value.toString())
        else if (value instanceof Array) value.map(v => addToParams(v, path, params))
        else if (value instanceof Object) for (const key in value) {
            addToParams(value[key], path + (path.length > 0 ? "." : "") + key, params)
        }
        return params
    }
    return addToParams(obj, "", params || new URLSearchParams())
}

type FirebaseConfig = any

export function makeFirestoreRequest(
    method: Method,
    collection: string,
    params: undefined | URLSearchParams,
    data: undefined | any,
    firebaseConfig: FirebaseConfig
) {
    const { projectId } = firebaseConfig
    const base_url = "https://firestore.googleapis.com/v1/"
    const name = `projects/${projectId}/databases/(default)/documents/${collection}`

    const config: AxiosRequestConfig = {
        url: base_url + name,
        method: method
    }
    if (params) config.params = params
    if (data) config.data = data

    return axios(config).then(
        response => {
            // console.log("Response: ", response, response.data)
            console.log("Axios success: ", response.status, response.statusText)
            return response.data
        },
        error => {
            console.log("Error: ", error)
            throw error
        }
    )
}

export function createDocument(
    collection: string,
    object: any,
    documentId: undefined | string,
    firebaseConfig: FirebaseConfig
) {
    const params = new URLSearchParams()
    if (documentId) toFirestoreParams({ 'documentId': documentId }, params)
    const data = toFirestoreDocument(object)

    makeFirestoreRequest('post', collection, params, data, firebaseConfig)
}

export function getDocument(
    collection: string,
    documentId: string,
    firebaseConfig: FirebaseConfig
) {
    makeFirestoreRequest('get', collection + '/' + documentId, undefined, undefined, firebaseConfig)
}

export function listDocuments(
    collection: string,
    mask: string[] = [],
    firebaseConfig: FirebaseConfig
) {
    const params = toFirestoreParams({ mask })
    makeFirestoreRequest('get', collection, params, undefined, firebaseConfig)
}

export function deleteDocument(
    collection: string,
    documentId: string,
    firebaseConfig: FirebaseConfig
) {
    makeFirestoreRequest('delete', collection + '/' + documentId, undefined, undefined, firebaseConfig)
}
