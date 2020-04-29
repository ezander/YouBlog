
// #https://mediatemple.net/blog/web-development-tech/you-should-probably-blog-in-markdown/

var fs = require('fs');

import * as Firestore from '../src/FirestoreTools'

console = console.Console({ stdout: process.stdout, stderr: process.stderr, colorMode: true, inspectOptions: { depth: 56 } })

const firebaseConfig = require("../firebaseConfig.json")
const COLLECTION = 'test_blog_entries'

function readFile(filename) {
    var path = process.cwd();
    var buffer = fs.readFileSync(`${path}/${filename}`)
    return buffer.toString();
}


// function updateDocument(collection, object, )

function write_post(author, author_id, date_str, title, filename, image_url) {
    const id = filename
    const date = new Date(date_str + "T00:00:00Z")
    const text = readFile(filename).slice(0, 100) + "..."
    const post = { author, author_id, title, date, text, image_url }
    // post.extra = { foo: "bar", bi: [1, 3, new Date(), { baz: 3, d: 3.141, bool: true, bf: false, nl: null }] }
    return Firestore.createDocument(COLLECTION, post, filename, firebaseConfig)
}


const recreate = false
async function processFile(author, author_id, date_str, title, filename, image_url) {
    const id = filename
    
    console.log("File: ", filename)

    let exist = await Firestore.hasDocument(COLLECTION, id, undefined, firebaseConfig)

    if (exist && recreate) {
        await Firestore.deleteDocument(COLLECTION, id, firebaseConfig)
        exist = false;
    }
    if (!exist) {
        const doc = await write_post(author, author_id, date_str, title, filename, image_url)
    }
    try {
        const doc = await Firestore.getDocument(COLLECTION, id, [], firebaseConfig)
        doc.document.text = doc.document.text.slice(0, 100)
        console.log(doc)
        return doc
    }
    catch (error) {
        console.log("Error:", error)
    }
}

async function doIt() {
    // console.log(firebaseConfig)
    await processFile( "Alex Alabbas", "_aa", "2020-04-22", "Logs And Metrics: How Important Are They?", "logs_and_metrics.md", "https://mediatemple.net/blog/wp-content/uploads/2020/04/3330x1410-1-960x407.png")
    await processFile( "Chris Coyier", "_cc", "2016-04-27", "You Should Probably Blog in Markdown", "blog_markdown.md", "https://mediatemple.net/blog/wp-content/uploads/2016/04/chris-coyier-4-960x406.png")
    await processFile( "Jeffrey Uberstine", "_ju", "2020-04-10", "Linux Administration For Web Developers: Part 1", "linux_admin_web_dev1.md", "https://mediatemple.net/blog/wp-content/uploads/2020/04/1665x705-Part1.-960x407.png")
    await processFile( "Jeffrey Uberstine", "_ju", "2020-04-10", "Linux Administration For Web Developers: Part 2", "linux_admin_web_dev2.md", "https://mediatemple.net/blog/wp-content/uploads/2020/04/1665x705-Part2-960x407.png")

    const docs = await Firestore.listDocuments(COLLECTION, ["author", "date", "title"], firebaseConfig)
    console.log(docs)
}
doIt()

// console.log(toFirestoreParams( {'documentId': "asdf", mask: {fieldNames: ["foo", "bar"]}} ))

