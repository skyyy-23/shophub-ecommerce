const LEGACY_KEYS = [
  "auth_token",
  "user",
  "auth_remember",
  "auth_scope",
  "auth_token:user",
  "auth_token:admin",
  "user:user",
  "user:admin",
  "auth_remember:user",
  "auth_remember:admin",
];

const REMEMBER_KEY = "auth_remember";

const resolveScope = (scope) => (scope === "admin" ? "admin" : "user");

const rememberKey = (scope) => `${REMEMBER_KEY}:${resolveScope(scope)}`;

export const clearLegacyAuthStorage = () => {
  LEGACY_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

export const wasRemembered = (scope = "user") =>
  localStorage.getItem(rememberKey(scope)) === "1";

export const persistRememberPreference = ({
  remember = false,
  scope = "user",
}) => {
  const key = rememberKey(scope);

  if (remember) {
    localStorage.setItem(key, "1");
  } else {
    localStorage.removeItem(key);
  }
};
