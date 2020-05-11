#!/usr/bin/env ts-node-script

// #https://mediatemple.net/blog/web-development-tech/you-should-probably-blog-in-markdown/
// https://www.browserling.com/tools/html-to-markdown

var fs = require("fs");
import * as Firestore from "../src/FirestoreTools";
import * as Auth from "../src/FirebaseAuthTools";
import { verifyIdToken } from "../src/FirebaseTokens";
import * as Storage from "../src/FirebaseStorage";
//@ts-ignore
console = console.Console({
  stdout: process.stdout,
  stderr: process.stderr,
  colorMode: true,
  inspectOptions: { depth: 56 },
});

const firebaseConfig = require("../firebaseConfig.json");

async function testStorage() {
  const response = await Storage.getResource(
    [],
    "books-1245690_1280.jpg",
    firebaseConfig
  );

  const length = response.headers["content-length"];
  console.log(length)
  const data = response.data;
  //   console.log(data.pro)

  data.pipe(fs.createWriteStream("ada_lovelace.jpg"));
  let downloaded=0
  data.on('data', function(chunk:any){
    downloaded += chunk.length;
    console.log( (downloaded/length*100).toFixed(2), downloaded + "/" + length);
  })  

  //   const binData = new Uint8Array(Buffer.from(data));
  //   fs.writeFile("upload.jpg", binData, (err: any) => {
  //     if (err) throw err;
  //     console.log("The file has been saved!");
  //   });

  //   console.log(data);
}

async function doIt() {
  try {
    await testStorage();
  } catch (e) {
    console.log(e);
  }
}

doIt();

// axios({
//     method: 'get',
//     url: 'http://bit.ly/2mTM3nY',
//     responseType: 'stream'
//   })
//     .then(function (response) {
//       response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
//     });
