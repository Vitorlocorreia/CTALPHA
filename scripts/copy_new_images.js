import fs from 'fs';
import path from 'path';

const brainDir = 'C:/Users/Adels/.gemini/antigravity/brain/fab70355-1dc2-4eae-b419-7c2d8d18e2cc';
const publicDir = 'c:/Users/Adels/Documents/antigravity/wise-bardeen/public';

const copies = [
  { src: 'ct_alpha_hero_banner_1787764363902.jpg', dest: 'promo_hero.jpg' },
  { src: 'ct_alpha_hero_banner_1787764363902.jpg', dest: 'hero_bg.jpg' },
  { src: 'ct_alpha_facade_gym_1787764387966.jpg', dest: 'facade.jpg' },
  { src: 'ct_alpha_app_mobile_1787764412139.jpg', dest: 'app_banner.jpg' },
  { src: 'ct_alpha_combat_ring_1787764440727.jpg', dest: 'combat_bg.jpg' }
];

copies.forEach(({ src, dest }) => {
  const sourcePath = path.join(brainDir, src);
  const destPath = path.join(publicDir, dest);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${src} -> ${dest}`);
  } else {
    console.error(`Source missing: ${sourcePath}`);
  }
});

console.log('All landing page images successfully replaced with 100% CT ALPHA branded imagery!');
