import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/Adels/.gemini/antigravity/brain/fab70355-1dc2-4eae-b419-7c2d8d18e2cc';

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let edgePath = edgePaths.find(p => fs.existsSync(p));

const dest = path.join(outDir, '26_landing_page_rounded_hero_balanced.png');
console.log('Capturing 26_landing_page_rounded_hero_balanced.png...');
const cmd = `"${edgePath}" --headless --screenshot="${dest}" --window-size=1366,950 --hide-scrollbars "http://localhost:3000/?view=landing"`;
execSync(cmd);
console.log('Done');
