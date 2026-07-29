const apiUrl = import.meta.env.VITE_API_URL;
const mapboxPublicToken = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

if (!apiUrl) {
  throw new Error("VITE_API_URL is required");
}

export const websiteConfig = {
  apiUrl,
  mapboxPublicToken,
};
