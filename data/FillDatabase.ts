#!/usr/bin/env ts-node-script

// #https://mediatemple.net/blog/web-development-tech/you-should-probably-blog-in-markdown/
// https://www.browserling.com/tools/html-to-markdown

var fs = require('fs');
import * as Firestore from '../src/FirestoreTools'
import * as Auth from '../src/FirebaseAuthTools'
import { verifyIdToken } from '../src/FirebaseTokens'
//@ts-ignore
console = console.Console({ stdout: process.stdout, stderr: process.stderr, colorMode: true, inspectOptions: { depth: 56 } })

const firebaseConfig = require("../firebaseConfig.json")
const COLLECTION = 'blog_entries'

function readFile(filename: string) {
    //@ts-ignore
    var path = process.cwd();
    var buffer = fs.readFileSync(`${path}/${filename}`)
    return buffer.toString();
}



enum DocMode { LEAVE, RECREATE, UPDATE };

const mode: DocMode = DocMode.RECREATE
// const mode: DocMode = DocMode.UPDATE

async function processFile(
    author: string,
    author_id: string,
    date_str: string,
    title: string,
    filename: string,
    image_url: string
) {
    const id = filename.endsWith(".md") ? filename.slice(0, -3) : filename
    const date = new Date(date_str + "T00:00:00Z")
    const text = readFile(filename)
    // post.extra = { foo: "bar", bi: [1, 3, new Date(), { baz: 3, d: 3.141, bool: true, bf: false, nl: null }] }

    // const localId = registeredUsers[author]?.localId
    const user = registeredUsers[author]
    if (!user) {
        console.log(`User ${author} not registered`)
        return null
    }

    const localId = user.localId
    const token = user.idToken

    const post = { author, author_id: localId, title, date, text, image_url }


    let exist = await Firestore.hasDocument(COLLECTION, id, "author", firebaseConfig, token)

    if (exist && mode === DocMode.RECREATE) {
        await Firestore.deleteDocument(COLLECTION, id, {}, firebaseConfig, token)
        exist = false;
    }
    if (!exist) {
        const doc = await Firestore.createDocument(COLLECTION, post, id, firebaseConfig, token)
    }
    else if (mode === DocMode.UPDATE) {
        const doc = await Firestore.patchDocument(COLLECTION, post, id, firebaseConfig, token)
    }
    try {
        const doc = await Firestore.getDocument(COLLECTION, id, {}, firebaseConfig, token)
        doc.document.text = doc.document.text.slice(0, 100)
        console.log(doc)
        return doc
    }
    catch (error) {
        console.log("Error:", error)
    }
}

async function storeBlogEntries() {
    // console.log(firebaseConfig)
    await processFile(
        "Alex Alabbas", "_aa",
        "2020-04-22",
        "Logs And Metrics: How Important Are They?",
        "logs_and_metrics.md",
        "https://mediatemple.net/blog/wp-content/uploads/2020/04/3330x1410-1-960x407.png")
    await processFile(
        "Chris Coyier", "_cc",
        "2016-04-27",
        "You Should Probably Blog in Markdown",
        "blog_markdown.md",
        "https://mediatemple.net/blog/wp-content/uploads/2016/04/chris-coyier-4-960x406.png")
    await processFile(
        "Jeffrey Uberstine", "_ju",
        "2020-04-10",
        "Linux Administration For Web Developers: Part 1",
        "linux_admin_web_dev1.md",
        "https://mediatemple.net/blog/wp-content/uploads/2020/04/1665x705-Part1.-960x407.png")
    await processFile(
        "Jeffrey Uberstine", "_ju",
        "2020-04-10",
        "Linux Administration For Web Developers: Part 2",
        "linux_admin_web_dev2.md",
        "https://mediatemple.net/blog/wp-content/uploads/2020/04/1665x705-Part2-960x407.png")
    await processFile(
        "Lindsay Kolowich", "_lk",
        "2020-05-03",
        "13 Blogging Mistakes Most Beginner Bloggers Make",
        "blogging_mistakes.md",
        "https://blog.hubspot.com/hubfs/blogging-for-beginners.jpg")
    await processFile(
        "Dave Cheney", "_dc",
        "2020-05-05",
        "Don’t just check errors, handle them gracefully",
        "handle_errors.md",
        "https://dave.cheney.net/wp-content/uploads/2016/04/Screen-Shot-2016-04-23-at-11.39.26.png")
    await processFile(
        "Saadia Minhas", "_sm",
        "2020-05-06",
        "How to Write Good Error Messages",
        "good_error_messages.md",
        "https://miro.medium.com/max/1382/1*W6sDVrsrLBYHP881a8COQA.jpeg")




    const token = registeredUsers["Alex Alabbas"].idToken
    const docs = await Firestore.listDocuments(COLLECTION, { mask: ["author", "date", "title"], orderBy: "date desc" }, firebaseConfig, token)
    console.log(docs)
}

const registeredUsers: any = {}

async function registerUser(email: string, password: string, displayName: string, photoUrl?: string) {
    let user: any = {}
    try {
        const userData = await Auth.signUpUser({ email, password }, firebaseConfig)
        // console.log("SignUp: ", userData)
        user = { ...user, ...userData }

        const profileData = await Auth.updateUserProfile(userData.idToken, { displayName, photoUrl }, firebaseConfig)
        // console.log("Profile: ", profileData)
        user = { ...user, ...profileData }
    }
    catch (error) {
        // console.error(error)
        const userData = await Auth.loginUser({ email, password }, firebaseConfig)
        // console.log("Login: ", userData)
        user = { ...user, ...userData }
    }
    console.log(verifyIdToken(user.idToken))

    registeredUsers[displayName] = user
    // registeredUsers[email] = user
}

async function registerUsers() {
    await registerUser("aa@testmail.com", "test1234", "Alex Alabbas", "https://mediatemple.net/blog/wp-content/uploads/2019/10/IMG_8950-400x400.jpg")
    await registerUser("cc@testmail.com", "test1234", "Chris Coyier")
    await registerUser("ju@testmail.com", "test1234", "Jeffrey Uberstine")
    await registerUser("lk@testmail.com", "test1234", "Lindsay Kolowich")
    await registerUser("dc@testmail.com", "test1234", "Dave Cheney")
    await registerUser("sm@testmail.com", "test1234", "Saadia Minhas")

    console.log("Users: ", registeredUsers)
}

async function doIt() {
    await registerUsers()
    await storeBlogEntries()
}

doIt()

