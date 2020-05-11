import { sequence } from "./Util";

test("sequence", () => {
  function mul(a: number, b: string) {
    return a * b.length;
  }
  function add(a: number, b: string) {
    return a + b.length;
  }

  expect(sequence(mul, add)(3, "abcde")).toBe(8);

  expect(sequence(add, mul)(3, "abcde")).toBe(15);
});

test("sequence", () => {
  const arr: any[] = [];
  function mul(a: number, b: string) {
    arr.push(a * b.length);
    return arr;
  }
  function add(a: number, b: string) {
    arr.push(a + b.length);
    return arr;
  }

  expect(sequence(mul, add)(3, "abcde")).toStrictEqual([15, 8]);
});
