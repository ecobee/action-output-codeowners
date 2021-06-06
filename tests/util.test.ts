import * as fs from 'fs';

import { getCodeOwnersPath, loadOwners, cleanCodeOwners } from '../src/lib';

const mockCodeownersPath = './some_path';
const mockCodeownersName = 'CODEOWNERS';
const mockCodeownersContents = '/ @one @two';

describe("Get codeowners path", () => {
  const defaultPath = './CODEOWNERS';
  const pathProvided = `${mockCodeownersPath}/${mockCodeownersName}`;

  test("if path is not provided, should return default", () => {
    expect(getCodeOwnersPath(null)).toBe(defaultPath);
  });
  test("if path is provided, should return that same path", () => {
    expect(getCodeOwnersPath(pathProvided)).toBe(pathProvided);
  });
});

describe("Clean codeowners contents", () => {
  const input = ['@one', '@two'];
  const expecting = ['one', 'two'];

  test("array length should remain the same and @ symbol should be removed", () => {
    expect(cleanCodeOwners(input)).toEqual(expect.arrayContaining(expecting));
  });
});

describe("Load owners", () => {
  jest.mock('fs')
  const mockReadFile = jest.spyOn(fs, 'readFileSync')
  mockReadFile.mockImplementation(() => mockCodeownersContents);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {});

  test("should return null if passed null", async () => {
    expect.assertions(1);
    const response = await loadOwners(null, mockReadFile);

    expect(response).toBe(null);
  });  

  test("should parse the entries, returning an array of the contents", async () => {
    const pathProvided = `${mockCodeownersPath}/${mockCodeownersName}`;
    const expected = ['@one', '@two']


    expect.assertions(1);
    const response = await loadOwners(pathProvided, mockReadFile);

    expect(response).toEqual(expected);
  });
});