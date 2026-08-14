export type CloudinaryPreset =
  | "thumb"
  | "card"
  | "gallery"
  | "hero"
  | "logo-sm"
  | "logo-md"
  | "og";

const PRESETS: Record<CloudinaryPreset, string> = {
  thumb: "w_120,h_120,c_fill,f_auto,q_auto",
  card: "w_400,h_400,c_fill,f_auto,q_auto",
  gallery: "w_1200,f_auto,q_auto",
  hero: "w_1600,c_limit,f_auto,q_auto",
  "logo-sm": "w_80,h_80,c_fill,f_auto,q_auto",
  "logo-md": "w_200,h_200,c_fill,f_auto,q_auto",
  og: "w_1200,h_630,c_fill,f_auto,q_auto",
};

const PRESET_WIDTHS: Record<CloudinaryPreset, number> = {
  thumb: 120,
  card: 400,
  gallery: 1200,
  hero: 1600,
  "logo-sm": 80,
  "logo-md": 200,
  og: 1200,
};

function isCloudinaryUrl(url: string): boolean {
  return url.includes("res.cloudinary.com") && url.includes("/upload/");
}

function injectTransform(url: string, transform: string): string {
  return url.replace("/upload/", `/upload/${transform}/`);
}

function transformForWidth(preset: CloudinaryPreset, width: number): string {
  switch (preset) {
    case "thumb":
    case "logo-sm":
      return `w_${width},h_${width},c_fill,f_auto,q_auto`;
    case "card":
    case "logo-md":
      return `w_${width},h_${width},c_fill,f_auto,q_auto`;
    case "og":
      return `w_${width},h_${Math.round(width * (630 / 1200))},c_fill,f_auto,q_auto`;
    case "gallery":
      return `w_${width},f_auto,q_auto`;
    case "hero":
      return `w_${width},c_limit,f_auto,q_auto`;
    default:
      return `w_${width},f_auto,q_auto`;
  }
}

/** Inject transforms after `/upload/` in a Cloudinary secure_url. Non-Cloudinary URLs pass through. */
export function cloudinaryUrl(
  url: string | null | undefined,
  preset: CloudinaryPreset,
): string {
  if (!url) return "";
  if (!isCloudinaryUrl(url)) {
    return url;
  }
  return injectTransform(url, PRESETS[preset]);
}

/** Tiny blurred placeholder for progressive image loading */
export function cloudinaryBlurPlaceholder(
  url: string | null | undefined,
): string {
  if (!url || !isCloudinaryUrl(url)) {
    return "";
  }
  return injectTransform(url, "e_blur:1000,q_1,w_50");
}

/** Width-descriptor srcset for responsive images */
export function cloudinarySrcSet(
  url: string | null | undefined,
  preset: CloudinaryPreset,
  widths?: readonly number[],
): string | undefined {
  if (!url || !isCloudinaryUrl(url)) {
    return undefined;
  }

  const baseWidth = PRESET_WIDTHS[preset];
  const resolvedWidths = widths ?? [baseWidth, baseWidth * 2];

  return resolvedWidths
    .map((width) => `${injectTransform(url, transformForWidth(preset, width))} ${width}w`)
    .join(", ");
}

/** Suggested `sizes` attribute per preset */
export function cloudinarySizes(preset: CloudinaryPreset): string {
  switch (preset) {
    case "thumb":
    case "logo-sm":
      return "120px";
    case "logo-md":
      return "200px";
    case "card":
      return "(max-width: 640px) 50vw, 400px";
    case "gallery":
      return "(max-width: 1024px) 100vw, 1200px";
    case "hero":
      return "100vw";
    case "og":
      return "1200px";
    default:
      return "100vw";
  }
}
