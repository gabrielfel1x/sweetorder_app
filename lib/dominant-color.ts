import sharp from "sharp";

/**
 * Extracts the average color of an image, server-side.
 * Runs via sharp (not the browser) because the R2 bucket serving logos
 * has no CORS headers, which would taint a canvas-based extraction.
 * Transparent areas are flattened to white before averaging so PNG
 * logos with a transparent background don't skew toward black.
 */
export async function getDominantColor(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
    if (!res.ok) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    const { data, info } = await sharp(buffer)
      .flatten({ background: "#ffffff" })
      .resize(1, 1, { fit: "fill" })
      .raw()
      .toBuffer({ resolveWithObject: true });

    if (info.channels < 3) return null;
    const [r, g, b] = data;
    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return null;
  }
}
