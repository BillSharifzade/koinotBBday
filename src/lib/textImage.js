// Renders text in the brand font to a transparent PNG data URL, so ElectricLogo
// can trace it like any other logo.
export async function renderTextImage(text, { weight = 700, size = 440, family = '"DIN Pro", Arial, sans-serif' } = {}) {
  const font = `${weight} ${size}px ${family}`;
  try {
    await document.fonts.load(font, text);
  } catch {
    // Fall back to whatever font is available.
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = font;
  const width = ctx.measureText(text).width;
  canvas.width = Math.ceil(width + size * 0.3);
  canvas.height = Math.ceil(size * 1.3);
  ctx.font = font;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  return canvas.toDataURL('image/png');
}
