import { BlogEntryWithId, BlogList, deleteBlogEntry,storeBlogEntry,fetchBlogEntries, fetchBlogEntry, BlogEntry, WithId } from "../model/Blog";
import { User } from "../model/Auth";
import { Dispatch } from "redux";

export enum BlogActionTypes {
  SET_LIST = "SET_LIST",
  SET_POST = "SET_POST",
  EDIT_POST = "EDIT_POST",
  CREATE_POST = "CREATE_POST",
  STORE_POST = "STORE_POST",
  DELETE_POST = "DELETE_POST",
  UPDATE_POST = "UPDATE_POST",
}

export type BlogAction =
  | { type: BlogActionTypes.SET_LIST; list: BlogList }
  | { type: BlogActionTypes.SET_POST; post: BlogEntryWithId, merge:boolean }
  | { type: BlogActionTypes.EDIT_POST; post: BlogEntryWithId }
  | { type: BlogActionTypes.CREATE_POST; post: BlogEntryWithId }
  | { type: BlogActionTypes.DELETE_POST; id: string }
  | { type: BlogActionTypes.STORE_POST; post: BlogEntryWithId }
  | { type: BlogActionTypes.UPDATE_POST; post: BlogEntryWithId };

export function doSetList(list: BlogList) {
  return { type: BlogActionTypes.SET_LIST, list };
}

export function doSetPost(post: BlogEntryWithId, merge:boolean=true) {
  return { type: BlogActionTypes.SET_POST, post, merge };
}

export function doEditPost(post: BlogEntryWithId) {
  return { type: BlogActionTypes.EDIT_POST, post };
}

export function doCreatePost(user: User) {
  const post = {
    id: null,
    document: {
      author: user.displayName,
      author_id: user.localId,
      date: new Date(),
      image_url: null,
      text: "",
      title: "",
    }
  }

  return { type: BlogActionTypes.CREATE_POST, post };
}


async function asyncDeletePost(id: string, idToken: string, dispatch: Dispatch) {
  await deleteBlogEntry(id, idToken)
  return dispatch({type: BlogActionTypes.DELETE_POST, id})
}

export function doDeletePost(id: string, idToken: string) {
  return asyncDeletePost.bind(null, id, idToken)
}

async function asyncStorePost(entry: BlogEntryWithId, idToken: string, dispatch: Dispatch) {
  const storedEntry = await storeBlogEntry(entry, idToken)
  return dispatch({type: BlogActionTypes.STORE_POST, storedEntry})
}

export function doStorePost(entry: BlogEntryWithId, idToken: string) {
  return asyncStorePost.bind(null, entry, idToken)
}



export function doUpdatePost(post: Partial<WithId<Partial<BlogEntry>>>) {
  return { type: BlogActionTypes.UPDATE_POST, post };
}

export function doFetchBlogEntries() {
  async function fetchBlogEntriesAsync(dispatch: any) {
    const list = await fetchBlogEntries();
    dispatch(doSetList(list));
  }
  return fetchBlogEntriesAsync;
}

export function doFetchBlogEntry(id: string) {
  async function fetchBlogEntriesAsync(id: string, dispatch: any) {
    const post = await fetchBlogEntry(id)
    dispatch(doSetPost(post));
  }
  return fetchBlogEntriesAsync.bind(null, id);
}
