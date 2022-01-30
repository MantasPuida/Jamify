type LocalStorageKeysType = "__spotify_auth_token__" | "__youtube_auth_token__";

function getUserToken(localStorageKey: LocalStorageKeysType): string | null {
  let token: string | null = null;
  try {
    token = window.localStorage.getItem(localStorageKey);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  return token;
}

function logout(localStorageKey: LocalStorageKeysType): void {
  window.localStorage.removeItem(localStorageKey);
}

function register(token: string, localStorageKey: LocalStorageKeysType): Promise<string | void> {
  window.localStorage.setItem(localStorageKey, token);

  return new Promise((resolve, reject) => {
    if (token) {
      resolve(token);
    } else {
      reject();
    }
  });
}

export { getUserToken, register, logout };
