import { APP_CONFIG } from "./config.js";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${APP_CONFIG.API_BASE_URL}${path}`, {
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = {
      success: false,
      message: "Server returned an invalid response.",
    };
  }

  if (!response.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload;
}
