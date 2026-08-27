import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/Adels/.gemini/antigravity/brain/fab70355-1dc2-4eae-b419-7c2d8d18e2cc';

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let edgePath = edgePaths.find(p => fs.existsSync(p));

const dest = path.join(outDir, '40_client_portal_clean_no_bioimpedance.png');
console.log('Capturando área do cliente limpa sem bioimpedância...');
const cmd = `"${edgePath}" --headless --screenshot="${dest}" --window-size=1920,1080 --virtual-time-budget=4000 --hide-scrollbars "http://localhost:3000/?view=student_portal"`;
execSync(cmd);

console.log('Screenshot salvo com sucesso em:', dest);
