const { getCodeOwnersPath } = require('./util');

describe("Get codeowners path",() => {
  let defaultPath = './CODEOWNERS';
  let pathProvided = '.some_other_path/CODEOWNERS';

  test("if path is not provided, should return default", () => {
    expect(getCodeOwnersPath(null)).toBe(defaultPath);
  });
  test("if path is provided, should return that same path", () => {
    expect(getCodeOwnersPath(pathProvided)).toBe(pathProvided);
  });
});