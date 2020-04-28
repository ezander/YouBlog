
// #https://mediatemple.net/blog/web-development-tech/you-should-probably-blog-in-markdown/

var fs = require('fs');
var axios = require('axios')

console = console.Console({ stdout: process.stdout, stderr: process.stderr, colorMode: true, inspectOptions: { depth: 56 } })

const firebaseConfig = require("../firebaseConfig.json")
const COLLECTION = 'test_blog_entries'

function readFile(filename) {
    var path = process.cwd();
    var buffer = fs.readFileSync(`${path}/${filename}`)
    return buffer.toString();
}

function mapObject(obj, func) {
    const res = {}
    for (key in obj) {
        res[key] = func(obj[key])
    }
    return res
}

function toFirestoreField(value) {
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

function toFirestoreDocument(obj) {
    return { fields: mapObject(obj, toFirestoreField) }
}

function toFirestoreParams(obj, params) {
    params = params || new URLSearchParams()

    function addToParams(value, path) {
        console.log("atop", value, path)
        if (typeof value === "string") params.append(path, value)
        else if (value instanceof Date) params.append(path, value.toString())
        else if (typeof value === "boolean") params.append(path, value)
        else if (typeof value === "number") params.append(path, value)
        else if (value instanceof Array) value.map( v => addToParams(v, path))
        else if (value instanceof Object) for( key in value ) {
            addToParams(value[key], path + (path.length>0 ? "." : "") + key )}
        return params
    }
    return addToParams(obj, "")
}

function makeFirestoreRequest(method, collection, params, data, firebaseConfig) {
    const { projectId } = firebaseConfig
    const base_url = "https://firestore.googleapis.com/v1/"
    const name = `projects/${projectId}/databases/(default)/documents/${collection}`

    const config = {
        url: base_url + name,
        method: method
    }
    if (params) config.params = params
    if (data) config.data = data

    return axios(config).then(
        response => console.log("Response: ", response, response.data),
        error => console.log("Error: ", error)
    )
}

function createDocument(collection, object, documentId, firebaseConfig) {
    const params = new URLSearchParams()
    if (documentId) toFirestoreParams( {'documentId': documentId}, params )
    const data = toFirestoreDocument(object)

    makeFirestoreRequest('post', collection, params, data, firebaseConfig)
}

function getDocument(collection, documentId) {
    makeFirestoreRequest('get', collection + '/' + documentId, undefined, undefined, firebaseConfig)
}

function listDocuments(collection, mask=[]) {
    const params = toFirestoreParams({mask: []})
    makeFirestoreRequest('get', collection + '/' + documentId, undefined, undefined, firebaseConfig)
}

function deleteDocument(collection, documentId) {
    makeFirestoreRequest('delete', collection + '/' + documentId, undefined, undefined, firebaseConfig)
}

// function updateDocument(collection, object, )

function write_post(author, author_id, date_str, title, filename, image_url) {
    const id = filename
    const date = new Date(date_str + "T00:00:00Z")
    const text = readFile(filename).slice(0, 100) + "..."
    const post = { author, author_id, title, date, text, image_url }
    post.extra = { foo: "bar", bi: [1, 3, new Date(), { baz: 3, d: 3.141 }] }
    createDocument(COLLECTION, post, filename, firebaseConfig)
}


async function doIt() {
    // await deleteDocument(COLLECTION, "logs_and_metrics.md")
    write_post("Alex Alabbas", "_aa", "2020-04-22", "Logs And Metrics: How Important Are They?", "logs_and_metrics.md", "https://mediatemple.net/blog/wp-content/uploads/2020/04/3330x1410-1-960x407.png")
    // await getDocument(COLLECTION, "logs_and_metrics.md")
}
doIt()

// console.log(toFirestoreParams( {'documentId': "asdf", mask: {fieldNames: ["foo", "bar"]}} ))
// write_post( "Chris Coyier", "_cc", "2016-04-27", "You Should Probably Blog in Markdown", "blog_markdown.md", "https://mediatemple.net/blog/wp-content/uploads/2016/04/chris-coyier-4-960x406.png")
// write_post( "Jeffrey Uberstine", "_ju", "2020-04-10", "Linux Administration For Web Developers: Part 1", "linux_admin_web_dev1.md", "https://mediatemple.net/blog/wp-content/uploads/2020/04/1665x705-Part1.-960x407.png")
// write_post( "Jeffrey Uberstine", "_ju", "2020-04-10", "Linux Administration For Web Developers: Part 2", "linux_admin_web_dev2.md", "https://mediatemple.net/blog/wp-content/uploads/2020/04/1665x705-Part2-960x407.png")







// write_post "Chris Coyier" "_cc" "2016-04-27" "You Should Probably Blog in Markdown" "blog_markdown.md" "https://mediatemple.net/blog/wp-content/uploads/2016/04/chris-coyier-4-960x406.png"
// write_post "Jeffrey Uberstine" "_ju" "2020-04-10" "Linux Administration For Web Developers: Part 1" "linux_admin_web_dev1.md" "https://mediatemple.net/blog/wp-content/uploads/2020/04/1665x705-Part1.-960x407.png"
// write_post "Jeffrey Uberstine" "_ju" "2020-04-10" "Linux Administration For Web Developers: Part 2" "linux_admin_web_dev2.md" "https://mediatemple.net/blog/wp-content/uploads/2020/04/1665x705-Part2-960x407.png"
// write_post "Alex Alabbas" "_aa" "2020-04-22" "Logs And Metrics: How Important Are They?" "logs_and_metrics.md" "https://mediatemple.net/blog/wp-content/uploads/2020/04/3330x1410-1-960x407.png"

