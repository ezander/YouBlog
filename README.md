# YouBlog

YouBlog is a blogging app for Android and iOS written in TypeScript/JavaScript with React Native.

## Features

## Todo

(Should go to the issues...)

### User centric

* Use the refresh token and when id token has expired
* Use alternate logins via google/facebook...
* Change Profile (optional), Author image, Author name in blog post clickable
* Blog post preview
* Insert the Date picker
* Use also bold and italic fonts in the markdown
* User can select from their own uploaded images
* Image manager for registered users
* Liking and comments for blog posts

### Dev centric

* Figure out what contributes into the final apk and remove unncessary packages
* Maybe completely remove the Firebase SDK
* Overhaul and integrate the firbase rest code
* make logging consistent
* read up on and implement e2e tests
* test the reducers
* test some more of the database code (mocking?)
* make theming consistent

## Technology

* Frontend: React Native, Expo
* State management: Redux, Redux thunk, immer
* UI: RN Elements, RN paper, react navigation
* Backend: Firebase (Authentication, Firestore Database, Google Cloud Storage)
* Helpful tools: 
  * Color: chroma-js
  * Dates: moment
  * Validation: validate.js
  * Markdown: react-native-markdown-display
  * Networking: axios

### For development

* Testing: Jest
* Local scripts: ts-node, ts-node-dev
* Formatting: prettier


## Links

* [Firebase Console](https://console.firebase.google.com/u/0/project/youblog-814ae/authentication/users)
* [Expo Console](https://expo.io/dashboard/ezander)

