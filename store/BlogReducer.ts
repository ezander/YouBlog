import { produce, Draft } from "immer";
import { appLogger } from "../config/Logging";
import { BlogActionTypes, BlogAction } from "./BlogActions";
import { BlogList, BlogEntryWithId } from "../model/Blog";
import deepmerge from "deepmerge";

export type EditPostType = Partial<BlogEntryWithId> & { changed: boolean };

const initialState = {
  list: [] as BlogList,
  posts: new Map<string, Partial<BlogEntryWithId>>(),
  edit: {} as EditPostType,
};

export type BlogState = Readonly<typeof initialState>;
export type BlogMap = typeof initialState.posts;

function blogProducer(draft: Draft<BlogState>, action: BlogAction) {
  switch (action.type) {
    case BlogActionTypes.SET_LIST:
      draft.list = action.list;
      return;

    case BlogActionTypes.SET_POST:
      const merge = action.merge;
      let post = action.post;
      if (merge) {
        let oldPost = draft.posts.get(post.id);
        if (oldPost) post = deepmerge(oldPost, post);
      }
      draft.posts.set(post.id, post);
      return;

    case BlogActionTypes.EDIT_POST:
      appLogger.info(
        `Start editing ${action.post?.document.title} by (${action.post?.document.author}).`
      );
      draft.edit = { ...action.post, changed: false };
      return;

    case BlogActionTypes.CREATE_POST:
      appLogger.info(`Creating new post.`);
      draft.edit = { ...action.post, changed: false };
      return;

    case BlogActionTypes.UPDATE_POST:
      const changed = draft.edit.changed
      const oldJson = changed ? "" : JSON.stringify(draft);
      draft.edit = deepmerge(draft.edit, action.post) as typeof draft.edit;
      const newJson = changed ? "" : JSON.stringify(draft);
      draft.edit.changed = changed || oldJson !== newJson;
      // console.log("Action: ", action.type, oldJson.length, newJson.length)
      return;

    case BlogActionTypes.DELETE_POST:
      console.log("Action: ", action.type, action?.id)
      draft.list = draft.list.filter(entry => entry.id !== action.id)
      if( draft.posts.has(action.id)) {
        draft.posts.delete(action.id)
      }
      return;

    case BlogActionTypes.STORE_POST:
      // console.log(action);
      console.log("Action: ", action.type, action.post?.id, action.post?.title)
      const index = draft.list.findIndex(entry => (entry.id === action.post.id))
      if( index ) {
        draft.list[index] = action.post
      }
      else {
        draft.list.unshift(action.post)
      }

      draft.posts.set(action.post.id, action.post)
      return;
  }
}

export const blogReducer = produce(blogProducer, initialState);

export default blogReducer;
