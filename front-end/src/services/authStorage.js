const TOKEN_KEY = "auth_token";
const USER_KEY = "user";
const REMEMBER_KEY = "auth_remember";
const SCOPE_KEY = "auth_scope";
const DEFAULT_SCOPE = "user";

const resolveScope = (scope) => (scope === "admin" ? "admin" : "user");

const getScope = () => resolveScope(sessionStorage.getItem(SCOPE_KEY) || DEFAULT_SCOPE);

const setScope = (scope) => {
  sessionStorage.setItem(SCOPE_KEY, resolveScope(scope));
};

const scopedKey = (baseKey, scope) => `${baseKey}:${resolveScope(scope)}`;

const readUser = (storage, key) => {
  const raw = storage.getItem(key);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    storage.removeItem(key);
    return null;
  }
};

const clearLegacyKeys = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem(REMEMBER_KEY);
};

export const getAuthSession = (scope) => {
  const resolvedScope = resolveScope(scope || getScope());
  const tokenKey = scopedKey(TOKEN_KEY, resolvedScope);
  const userKey = scopedKey(USER_KEY, resolvedScope);

  const sessionToken = sessionStorage.getItem(tokenKey);
  if (sessionToken) {
    return {
      token: sessionToken,
      user: readUser(sessionStorage, userKey),
      remember: false,
      scope: resolvedScope,
    };
  }

  const localToken = localStorage.getItem(tokenKey);
  if (localToken) {
    return {
      token: localToken,
      user: readUser(localStorage, userKey),
      remember: true,
      scope: resolvedScope,
    };
  }

  const legacyToken = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  if (legacyToken) {
    const legacyUser =
      readUser(sessionStorage, USER_KEY) ||
      readUser(localStorage, USER_KEY);
    const legacyRemember = localStorage.getItem(REMEMBER_KEY) === "1" || Boolean(localStorage.getItem(TOKEN_KEY));

    persistAuthSession({
      token: legacyToken,
      user: legacyUser,
      remember: legacyRemember,
      scope: resolvedScope,
    });
    clearLegacyKeys();

    return {
      token: legacyToken,
      user: legacyUser,
      remember: legacyRemember,
      scope: resolvedScope,
    };
  }

  return {
    token: null,
    user: null,
    remember: false,
    scope: resolvedScope,
  };
};

export const getAuthToken = () => getAuthSession().token;

export const getStoredUser = () => getAuthSession().user;

export const wasRemembered = (scope) => {
  const resolvedScope = resolveScope(scope || getScope());
  const rememberKey = scopedKey(REMEMBER_KEY, resolvedScope);
  if (localStorage.getItem(rememberKey) === "1") {
    return true;
  }
  const tokenKey = scopedKey(TOKEN_KEY, resolvedScope);
  return localStorage.getItem(tokenKey) !== null;
};

export const persistAuthSession = ({ token, user, remember = true, scope }) => {
  if (!token) {
    return;
  }

  const resolvedScope = resolveScope(scope || getScope());
  setScope(resolvedScope);
  const tokenKey = scopedKey(TOKEN_KEY, resolvedScope);
  const userKey = scopedKey(USER_KEY, resolvedScope);
  const rememberKey = scopedKey(REMEMBER_KEY, resolvedScope);

  const primary = remember ? localStorage : sessionStorage;
  const secondary = remember ? sessionStorage : localStorage;

  primary.setItem(tokenKey, token);
  if (user) {
    primary.setItem(userKey, JSON.stringify(user));
  }

  secondary.removeItem(tokenKey);
  secondary.removeItem(userKey);

  if (remember) {
    localStorage.setItem(rememberKey, "1");
  } else {
    localStorage.removeItem(rememberKey);
  }
};

export const clearAuthSession = (scope) => {
  const resolvedScope = resolveScope(scope || getScope());
  const tokenKey = scopedKey(TOKEN_KEY, resolvedScope);
  const userKey = scopedKey(USER_KEY, resolvedScope);
  const rememberKey = scopedKey(REMEMBER_KEY, resolvedScope);

  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
  sessionStorage.removeItem(tokenKey);
  sessionStorage.removeItem(userKey);
  localStorage.removeItem(rememberKey);

  clearLegacyKeys();
};
