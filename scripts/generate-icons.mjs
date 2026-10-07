import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const root = process.cwd();
const images = path.join(root, 'public', 'images');
const iconSvg = fs.readFileSync(path.join(images, 'icon.svg'));
const logoSvg = fs.readFileSync(path.join(images, 'logo.svg'));

async function png(svg, size) {
  return sharp(svg).resize(size, size).png().toBuffer();
}

const sizes = [16, 32, 48, 180, 192, 512];
for (const size of sizes) {
  const source = size >= 180 ? iconSvg : logoSvg;
  fs.writeFileSync(path.join(images, `icon-${size}.png`), await png(source, size));
}

const mark = await sharp(logoSvg).resize(512, 512).png().toBuffer();
fs.writeFileSync(path.join(images, 'logo-mark.png'), mark);

const inner = await sharp(iconSvg).resize(320, 320).png().toBuffer();
const maskable = await sharp({
  create: { width: 512, height: 512, channels: 4, background: '#22c55e' },
})
  .composite([{ input: inner, gravity: 'center' }])
  .png()
  .toBuffer();
fs.writeFileSync(path.join(images, 'icon-maskable-512.png'), maskable);

fs.copyFileSync(path.join(images, 'icon-180.png'), path.join(images, 'apple-touch-icon.png'));

const ico = await pngToIco([
  path.join(images, 'icon-16.png'),
  path.join(images, 'icon-32.png'),
  path.join(images, 'icon-48.png'),
]);
fs.writeFileSync(path.join(root, 'public', 'favicon.ico'), ico);
console.log('wrote public/favicon.ico and public/images icons');
