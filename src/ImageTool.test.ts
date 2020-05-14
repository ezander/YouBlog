import { createHashFilename } from "./ImageTool";


test("createHashFilename", async () => {

  const data = "abcdefg"
  const data_hash = "7d1a54127b222502f5b79b5fb0803061152a44f92b37e23c6527baf665d4da9a"
  expect(await createHashFilename("foobar", data)).toBe(data_hash);
  expect(await createHashFilename("foobar.jpg", data)).toBe(`${data_hash}.jpg`);
  expect(await createHashFilename("foobar.jpg.bak", data)).toBe(`${data_hash}.bak`);

});
