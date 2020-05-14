import firebaseConfig from "../firebaseConfig.json";
import { getDocument, listDocuments, deleteDocument, createDocument, patchDocument } from "../src/FirestoreTools";
import * as FirebaseSDK from "../src/FirebaseSDK";

export const BLOG_ENTRY_COLLECTION = "blog_entries"

export interface BlogEntry {
  author: string;
  author_id: string;
  title: string;
  date: Date;
  text: string;
  image_url: string;
}

export type WithId<T> = {
  document: T;
  id: string;
};

export type BlogEntryWithId = WithId<BlogEntry>;

export type BlogList = Array<BlogEntryWithId>;

class SDK {
  static db = FirebaseSDK.getDB();

  static convertBlogEntry(
    id: string,
    doc: firebase.firestore.DocumentData
  ): BlogEntryWithId {
    return {
      id,
      document: {
        author: doc.author,
        author_id: doc.author_id,
        date: doc.date.toDate(),
        image_url: doc.image_url,
        text: doc.text,
        title: doc.title,
      },
    };
  }
  static async fetchBlogEntry(id: string): Promise<BlogEntryWithId> {
    const coll = SDK.db.collection(BLOG_ENTRY_COLLECTION);
    const docRef = coll.doc(id);
    const docData = (await docRef.get()).data();
    if (!docData) throw new Error(`Error fetching blog entry ${id}`);
    const doc = SDK.convertBlogEntry(id, docData);
    return doc;
  }

  static async fetchBlogEntries(): Promise<BlogList> {
    // no mask support in firestore sdk, need to split the data if really wanted

    const coll = SDK.db.collection(BLOG_ENTRY_COLLECTION).orderBy("date", "desc");
    const docRefs = (await coll.get()).docs;
    const docs = docRefs.map((docSnap) =>
      SDK.convertBlogEntry(docSnap.id, docSnap.data())
    );
    return docs;
  }
}

class REST {
  static async fetchBlogEntry(id: string): Promise<BlogEntryWithId> {
    return await getDocument(BLOG_ENTRY_COLLECTION, id, {}, firebaseConfig);
  }

  static async fetchBlogEntries(): Promise<BlogList> {
    const mask = ["title", "author", "author_id", "date", "image_url"];
    const orderBy = "date desc";

    // console.log("Fetching documents...");
    return await listDocuments(BLOG_ENTRY_COLLECTION, { mask, orderBy }, firebaseConfig);
  }

  static async deleteBlogEntry(id: string, idToken: string): Promise<BlogEntryWithId> {
    return await deleteDocument(BLOG_ENTRY_COLLECTION, id, {}, firebaseConfig, idToken);
  }

  static async storeBlogEntry(entry: BlogEntryWithId, idToken: string): Promise<BlogEntryWithId> {
    if( entry.id ) {
      const updatedDoc = await patchDocument(BLOG_ENTRY_COLLECTION, entry.document, entry.id, firebaseConfig, idToken)
      return updatedDoc
    }
    else {
      const newDocument = await createDocument(BLOG_ENTRY_COLLECTION, entry.document, undefined, firebaseConfig, idToken);
      return newDocument
    }
  }

}

const blogAPI = REST;

export const { fetchBlogEntry, fetchBlogEntries, deleteBlogEntry, storeBlogEntry } = blogAPI;
