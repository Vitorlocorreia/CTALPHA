import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/Adels/.gemini/antigravity/brain/fab70355-1dc2-4eae-b419-7c2d8d18e2cc';

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let edgePath = edgePaths.find(p => fs.existsSync(p));

const dest = path.join(outDir, '30_workout_builder_final.png');
console.log('Capturando tela com msedge headless...');
const cmd = `"${edgePath}" --headless --screenshot="${dest}" --window-size=1920,1080 --hide-scrollbars "http://localhost:3000/?view=workout_builder&role=personal"`;
execSync(cmd);
console.log('Screenshot final salvo com sucesso!');
