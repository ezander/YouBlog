import { PathDef, getExtension, extendPath, pathDefToString, getMimetype } from "./Networking";

test("getExtension", () => {

  expect(getExtension("foobar")).toBe("");
  expect(getExtension("foobar.jpg")).toBe(".jpg");
  expect(getExtension("foobar.jpg", false)).toBe("jpg");
  expect(getExtension("foobar.jpg.bak")).toBe(".bak");

});

test("getMimetype", () => {

  expect(getMimetype("foobar")).toBe("application/x-binary");
  expect(getMimetype("foobar.jpg")).toBe("image/jpeg");
  expect(getMimetype("foobar.txt")).toBe("text/plain");

});

test("pathDefToString", () => {

  expect(pathDefToString("foobar")).toBe("foobar");
  expect(pathDefToString(["foobar", "baz"])).toBe("foobar/baz");
  expect(pathDefToString(["foo", "bar", "baz"])).toBe("foo/bar/baz");

});

test("extendPath", () => {

  expect(extendPath("foobar", "baz")).toStrictEqual(["foobar", "baz"]);
  expect(extendPath(["foo", "bar"], "baz")).toStrictEqual(["foo", "bar", "baz"]);
  expect(extendPath(["foo"], ["bar", "baz"])).toStrictEqual(["foo", "bar", "baz"]);
  expect(extendPath("foo", ["bar", "baz"])).toStrictEqual(["foo", "bar", "baz"]);
  expect(extendPath(["foo", "bar"], undefined)).toStrictEqual(["foo", "bar"]);
});




