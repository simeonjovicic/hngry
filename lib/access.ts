export const ACCESS_COOKIE = "hngry_access";
export const ACCESS_VALUE = "granted-drop-001";

// Preview password. In production it ONLY works when the DROP_PASSWORD env
// var is set — without it the gate accepts nothing at all. The "jahudi"
// fallback exists purely for local development.
export const DROP_PASSWORD =
  process.env.DROP_PASSWORD ??
  (process.env.NODE_ENV === "development" ? "jahudi" : null);

export const DROP_DATE_ISO = "2026-07-20T20:15:00+02:00";
