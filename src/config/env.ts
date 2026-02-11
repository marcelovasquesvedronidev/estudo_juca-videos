const DEFAULT_API_BASE_URL = "/api";

function normalizeBaseUrl(value: string | undefined): string {
  if (!value) {
    return DEFAULT_API_BASE_URL;
  }

  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export const env = {
  apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
};
