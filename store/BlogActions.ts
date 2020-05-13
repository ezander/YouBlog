import { BlogEntryWithId, BlogList, fetchBlogEntries, fetchBlogEntry } from "../model/Blog";

export enum BlogActionTypes {
  SET_LIST = "SET_LIST",
  SET_POST = "SET_POST",
  EDIT_POST = "EDIT_POST",
  CREATE_POST = "CREATE_POST",
  UPDATE_POST = "UPDATE_POST",
}

export type BlogAction =
  | { type: BlogActionTypes.SET_LIST; list: BlogList }
  | { type: BlogActionTypes.SET_POST; post: BlogEntryWithId, merge:boolean }
  | { type: BlogActionTypes.EDIT_POST; post: BlogEntryWithId }
  | { type: BlogActionTypes.CREATE_POST }
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

export function doCreatePost() {
  return { type: BlogActionTypes.CREATE_POST };
}

export function doUpdatePost(post: Partial<BlogEntryWithId>) {
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
