import axios from 'axios'
import { FirebaseConfig, parseError } from './FirebaseTools';

function mapField(field) {
    if (field.hasOwnProperty("stringValue")) return field["stringValue"]
    if (field.hasOwnProperty("timestampValue")) return new Date(field["timestampValue"])
    return "FOOOO"
}
function mapFields(fields) {
    const res = {}
    for (const key in fields) {
        console.log(key)
        res[key] = mapField(fields[key])
    }
    console.log(res)
    return res
}
function convertDoc(document) {
    const { fields, name } = document
    return ({ id: name, ...mapFields(fields) })
}
function toArray(dictData: any) {
    const documents = dictData.documents

    const arr = documents.map(convertDoc)
    console.log(arr)
    return arr
}

interface FetchAllOptions {
    toArray?: boolean,
    mask?: String[],
    orderBy?: String
}
export async function fetchAll(
    collection: string,
    firebaseConfig: FirebaseConfig,
    options: FetchAllOptions
) {
    options = { toArray: true, ...options }
    const base_url = "https://firestore.googleapis.com/v1/"
    const endpoint = `projects/${firebaseConfig.projectId}/databases/(default)/documents/${collection}`
    let url = base_url + endpoint
    let params = [] as String[]
    if (options.mask) {
        params = [...params, ...options.mask.map(field => `mask.fieldPaths=${field}`)]
    }
    if (options.orderBy) {
        params = [...params, "orderBy=" + encodeURI(options.orderBy)]
    }
    if (params.length > 0) {
        url = url + "?" + params.join("&")
    }

    try {
        const config = {
            validateStatus: (status: number) => (status >= 200 && status < 300) || status === 400
        }
        console.log(url)
        const response = await axios.get(url, config)
        console.log(response)

        // return toArray(response.data)
        return options.toArray ? toArray(response.data) : response.data
    }
    catch (error) {
        console.log("HTTP error: ", error)
        throw parseError(error)
    }
}

export async function fetchItem(
    collection: string,
    id: string,
    firebaseConfig: FirebaseConfig,
    options = {}
) {
    const base_url = "https://firestore.googleapis.com/v1/"
    //const endpoint = `projects/${firebaseConfig.projectId}/databases/(default)/documents/${collection}/${name}`
    const endpoint = id;
    let url = base_url + endpoint
    let params = [] as String[]
    // if (options.mask) {
    //     params = [...params, ...options.mask.map(field => `mask.fieldPaths=${field}`)]
    // } 
    if (params.length > 0) {
        url = url + "?" + params.join("&")
    }

    try {
        const config = {
            validateStatus: (status: number) => (status >= 200 && status < 300) || status === 400
        }
        console.log(url)
        const response = await axios.get(url, config)
        console.log(response)

        return convertDoc( response.data )
        // return options.toArray ? toArray(response.data) : response.data
    }
    catch (error) {
        console.log("HTTP error: ", error)
        throw parseError(error)
    }

    // const url = `https://${firebaseConfig.projectId}.firebaseio.com${endpoint}/${id}.json`
    // console.log(url)
    // try {
    //     const response = await axios.get(url)
    //     return {...response.data, id}
    // }
    // catch (error) {
    //     throw parseError(error)
    // }
}
