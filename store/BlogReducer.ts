import { produce, Draft } from "immer";
import { appLogger } from "../src/Logging";
import { BlogActionTypes, BlogAction } from "./BlogActions";
import { BlogList, BlogEntryWithId } from "../model/Blog";
import deepmerge from 'deepmerge'


export type EditPostType = (Partial<BlogEntryWithId> & {changed: boolean})

const initialState = {
  list: [] as BlogList,
  posts: new Map<string, Partial<BlogEntryWithId>>(),
  edit: {} as EditPostType,
};

export type BlogState = Readonly<typeof initialState>
export type BlogMap = typeof initialState.posts

function blogProducer(draft: Draft<BlogState>, action: BlogAction) {
  switch (action.type) {
    case BlogActionTypes.SET_LIST:
      draft.list = action.list;
      break;

    case BlogActionTypes.SET_POST:
      const merge = action.merge
      let post = action.post 
      if( merge ) {
        let oldPost = draft.posts.get(post.id)
        if( oldPost ) post = deepmerge(oldPost, post)
      }
      draft.posts.set(post.id, post)
      break;

    case BlogActionTypes.EDIT_POST:
      appLogger.info(
        `Start editing ${action.post?.document.title} by (${action.post?.document.author}).`
      );
      draft.edit = {...action.post, changed: false};
      break;

    case BlogActionTypes.CREATE_POST:
      appLogger.info(`Creating new post.`);
      draft.edit = {...action.post, changed: false};
      break;

    case BlogActionTypes.UPDATE_POST:
      const oldJson = JSON.stringify(draft)
      draft.edit = deepmerge(draft.edit, action.post) as (typeof draft.edit)
      const newJson = JSON.stringify(draft)
      draft.edit.changed = draft.edit.changed  || (oldJson!==newJson)

      // console.log(draft.edit)
      // throw Error("Not yet implemented");
      break;
  }
}

export const blogReducer = produce(blogProducer, initialState);

export default blogReducer;
