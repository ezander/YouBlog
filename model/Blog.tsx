interface BlogEntry {
    author: string,
    author_id: string,
    title: string,
    date: string,
    text: string,
    image_url: string
}

type WithId<T> = T & { id : string }
type BlogEntryWithId = WithId<BlogEntry>

type BlogList = Array<BlogEntryWithId>

