import * as firebase from 'firebase'
import 'firebase/firestore'
import firebaseConfig from '../firebaseConfig.json'
import { getDocument, listDocuments } from '../src/FirestoreTools'

export interface BlogEntry {
    author: string,
    author_id: string,
    title: string,
    date: Date,
    text: string,
    image_url: string
}

// type WithId<T> = T & { id : string }
export type WithId<T> = {
    document: T,
    id: string
}
export type BlogEntryWithId = WithId<BlogEntry>

export type BlogList = Array<BlogEntryWithId>

class SDK {
    static db = SDK.getDB()

    static getDB() {
        try {
            firebase.app()
        }
        catch (error) {
            firebase.initializeApp(firebaseConfig)
        }
        return firebase.firestore()
    }

    static convertBlogEntry(id: string, doc: firebase.firestore.DocumentData): BlogEntryWithId {
        return {
            id,
            document: {
                author: doc.author,
                author_id: doc.author_id,
                date: doc.date.toDate(),
                image_url: doc.image_url,
                text: doc.text,
                title: doc.title
            }
        }
    }
    static async fetchBlogEntry(id: string): Promise<BlogEntryWithId> {
        const coll = SDK.db.collection('blog_entries')
        const docRef = coll.doc(id)
        const docData = (await docRef.get()).data()
        if (!docData) throw new Error(`Error fetching blog entry ${id}`)
        const doc = SDK.convertBlogEntry(id, docData)
        return doc
    }

    static async fetchBlogEntries(): Promise<BlogList> {
        // no mask support in firestore sdk, need to split the data if really wanted

        const coll = SDK.db.collection('blog_entries').orderBy("date", "desc")
        const docRefs = (await coll.get()).docs
        const docs = docRefs.map(docSnap => SDK.convertBlogEntry(docSnap.id, docSnap.data()))
        return docs
    }
}

class REST {
    static async fetchBlogEntry(id: string): Promise<BlogEntryWithId> {
        return getDocument("blog_entries", id, {}, firebaseConfig)
    }

    static async fetchBlogEntries(): Promise<BlogList> {
        const mask = ["title", "author", "date", "image_url"]
        const orderBy = "date desc"

        console.log("Fetching documents...")
        return listDocuments("blog_entries", { mask, orderBy }, firebaseConfig)
    }
}

const blogAPI = SDK

export const { fetchBlogEntry, fetchBlogEntries } = blogAPI
