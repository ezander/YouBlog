import { BlogEntryWithId, BlogList } from "../model/Blog";

export enum BlogActionTypes {
  SET_LIST = "SET_LIST",
  SET_POST = "SET_POST",
  EDIT_POST = "EDIT_POST",
  CREATE_POST = "CREATE_POST",
  UPDATE_POST = "UPDATE_POST",
}

export type BlogAction =
  | { type: BlogActionTypes.SET_LIST; list: BlogList }
  | { type: BlogActionTypes.SET_POST; post: BlogEntryWithId }
  | { type: BlogActionTypes.EDIT_POST; post: BlogEntryWithId }
  | { type: BlogActionTypes.CREATE_POST }
  | { type: BlogActionTypes.UPDATE_POST; post: BlogEntryWithId };

export function doSetList(list: BlogList) {
  return { type: BlogActionTypes.SET_LIST, list };
}

export function doSetPost(post: BlogEntryWithId) {
  return { type: BlogActionTypes.SET_POST, post };
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
