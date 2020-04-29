
// #https://mediatemple.net/blog/web-development-tech/you-should-probably-blog-in-markdown/

var fs = require('fs');

import * as Firestore from './FirestoreTools'

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
    post.extra = { foo: "bar", bi: [1, 3, new Date(), { baz: 3, d: 3.141 }] }
    Firestore.createDocument(COLLECTION, post, filename, firebaseConfig)
}


async function doIt() {
    await Firestore.deleteDocument(COLLECTION, "logs_and_metrics.md", firebaseConfig)
    await write_post("Alex Alabbas", "_aa", "2020-04-22", "Logs And Metrics: How Important Are They?", "logs_and_metrics.md", "https://mediatemple.net/blog/wp-content/uploads/2020/04/3330x1410-1-960x407.png")
    await Firestore.getDocument(COLLECTION, "logs_and_metrics.md", firebaseConfig)
}
doIt()

// console.log(toFirestoreParams( {'documentId': "asdf", mask: {fieldNames: ["foo", "bar"]}} ))
// write_post( "Chris Coyier", "_cc", "2016-04-27", "You Should Probably Blog in Markdown", "blog_markdown.md", "https://mediatemple.net/blog/wp-content/uploads/2016/04/chris-coyier-4-960x406.png")
// write_post( "Jeffrey Uberstine", "_ju", "2020-04-10", "Linux Administration For Web Developers: Part 1", "linux_admin_web_dev1.md", "https://mediatemple.net/blog/wp-content/uploads/2020/04/1665x705-Part1.-960x407.png")
// write_post( "Jeffrey Uberstine", "_ju", "2020-04-10", "Linux Administration For Web Developers: Part 2", "linux_admin_web_dev2.md", "https://mediatemple.net/blog/wp-content/uploads/2020/04/1665x705-Part2-960x407.png")

