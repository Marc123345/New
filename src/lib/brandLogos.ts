function svg(content: string, vb = "0 0 100 100"): string {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${content}</svg>`
  )}`;
}

function svgSquare(bg: string, content: string, vb = "0 0 100 100"): string {
  return svg(`<rect width="100" height="100" fill="${bg}"/>${content}`, vb);
}

export const brandLogos: string[] = [
  // Facebook
  svgSquare(
    "#1877F2",
    `<path d="M56 22h-6c-8 0-13 6-13 13v6h-6v10h6v23h10V51h8l1-10h-9v-5c0-3 2-4 4-4h6V22z" fill="#fff"/>`
  ),
  // Instagram
  svg(
    `<defs><linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">` +
      `<stop offset="0" stop-color="#feda75"/><stop offset=".25" stop-color="#fa7e1e"/>` +
      `<stop offset=".5" stop-color="#d62976"/><stop offset=".75" stop-color="#962fbf"/>` +
      `<stop offset="1" stop-color="#4f5bd5"/></linearGradient></defs>` +
      `<rect width="100" height="100" fill="url(#ig)"/>` +
      `<rect x="27" y="27" width="46" height="46" rx="12" fill="none" stroke="#fff" stroke-width="4.5"/>` +
      `<circle cx="50" cy="50" r="10" fill="none" stroke="#fff" stroke-width="4.5"/>` +
      `<circle cx="63" cy="37" r="3" fill="#fff"/>`
  ),
  // X / Twitter
  svgSquare(
    "#000",
    `<path d="M28 30h8l10 14L58 30h8L52 50l16 20h-8L48 56 36 70h-8l16-20z" fill="#fff"/>`
  ),
  // LinkedIn
  svgSquare(
    "#0A66C2",
    `<rect x="28" y="44" width="8" height="24" rx="1" fill="#fff"/>` +
      `<circle cx="32" cy="35" r="5" fill="#fff"/>` +
      `<path d="M42 44h8v3c2-3 5-4 9-4 8 0 10 6 10 13v12h-8V57c0-4-1-6-5-6s-6 3-6 6v11h-8V44z" fill="#fff"/>`
  ),
  // YouTube
  svgSquare(
    "#FF0000",
    `<path d="M40 34v32l26-16z" fill="#fff"/>`
  ),
  // WhatsApp
  svgSquare(
    "#25D366",
    `<path d="M50 25C36 25 25 36 25 50c0 5 1 9 4 13l-3 12 12-3c4 2 8 3 12 3 14 0 25-11 25-25S64 25 50 25zm0 44c-4 0-7-1-10-3l-7 2 2-7c-2-3-4-7-4-11 0-10 9-19 19-19s19 9 19 19-9 19-19 19z" fill="#fff"/>`
  ),
  // Telegram
  svgSquare(
    "#26A5E4",
    `<path d="M22 49l10 4 3 11 5-5 9 7L72 32z" fill="#fff"/>`
  ),
  // TikTok
  svgSquare(
    "#010101",
    `<path d="M58 32v11c4 3 9 4 13 4v10c-4 0-8-1-13-4v18c0 9-7 16-16 16s-16-7-16-16 7-16 16-16c2 0 3 0 5 1v11c-2-1-3-1-5-1-5 0-8 4-8 9s3 9 8 9 8-4 8-9V21h8c0 2 1 3 2 5 1 3 4 5 7 6z" fill="#fff"/>`
  ),
  // Pinterest
  svgSquare(
    "#E60023",
    `<path d="M50 22c-16 0-28 11-28 26 0 11 6 20 16 24 0-2 0-5 1-7l3-13s-1-2-1-4c0-4 2-7 5-7 2 0 4 2 4 4 0 3-2 6-3 10-1 3 2 5 4 5 5 0 9-7 9-15 0-6-5-11-12-11-9 0-14 6-14 13 0 3 1 5 2 7l-1 3c-4-2-6-6-6-10 0-9 7-17 18-17 10 0 17 7 17 16 0 10-6 18-14 18-3 0-6-2-7-4l-2 7c-1 3-3 5-4 7 3 1 6 1 9 1 16 0 28-11 28-26S66 22 50 22z" fill="#fff"/>`
  ),
  // Reddit
  svgSquare(
    "#FF4500",
    `<ellipse cx="50" cy="56" rx="18" ry="14" fill="#fff"/>` +
      `<circle cx="43" cy="53" r="3" fill="#FF4500"/>` +
      `<circle cx="57" cy="53" r="3" fill="#FF4500"/>` +
      `<path d="M43 61c2 3 5 4 7 4s5-1 7-4" stroke="#FF4500" stroke-width="2" fill="none" stroke-linecap="round"/>` +
      `<circle cx="68" cy="38" r="4" fill="#fff"/>` +
      `<path d="M56 28l4-7 8 3" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
  ),
  // Snapchat
  svgSquare(
    "#FFFC00",
    `<path d="M50 28c-6 0-10 4-11 10l-1 8c-1 0-3-1-4 0s-1 2 0 3c1 0 3 1 4 1-1 2-4 5-9 6 0 1 0 2 1 2 2 0 4 0 6-1 1 2 2 3 3 3 0 1-1 2-1 3 3 0 6-1 12-1s9 1 12 1c0-1-1-2-1-3 1 0 2-1 3-3 2 1 4 1 6 1 1 0 1-1 1-2-5-1-8-4-9-6 1 0 3-1 4-1s1-2 0-3-3 0-4 0l-1-8c-1-6-5-10-11-10z" fill="#fff"/>`
  ),
];
