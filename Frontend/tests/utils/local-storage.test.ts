let mockedLocalStorage = {};

export const localStorageMock = {
  get: jest.fn().mockImplementation((key) => mockedLocalStorage[key]),
  set: jest.fn().mockImplementation((key, value) => {
    mockedLocalStorage[key] = value;
  }),
  clear: jest.fn().mockImplementation(() => {
    mockedLocalStorage = {};
  }),
  remove: jest.fn().mockImplementation((key) => {
    mockedLocalStorage[key] = undefined;
  })
};

describe("Mocked Local Storage Tests", () => {
  beforeAll(() => {
    localStorageMock.clear();
  });

  it("Sets Item Inside Mocked Local Storage", () => {
    const token = "my_access_token";
    const localStorageKey = "__auth_token__";

    expect(localStorageMock.get(localStorageKey)).toBeUndefined();
    localStorageMock.set(localStorageKey, token);

    expect(localStorageMock.get(localStorageKey)).toBe(token);
  });

  it("Removes Item From Mocked Local Storage", () => {
    const localStorageKey = "__auth_token__";

    localStorageMock.remove(localStorageKey);

    expect(localStorageMock.get(localStorageKey)).toBeUndefined();
  });
});
