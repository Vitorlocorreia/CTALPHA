import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/Adels/.gemini/antigravity/brain/fab70355-1dc2-4eae-b419-7c2d8d18e2cc';

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let edgePath = edgePaths.find(p => fs.existsSync(p));

if (!edgePath) {
  console.error('Edge not found');
  process.exit(1);
}

const dest = path.join(outDir, '16_professor_library_master.png');
console.log('Capturing 16_professor_library_master.png...');
const cmd = `"${edgePath}" --headless --screenshot="${dest}" --window-size=1366,850 --hide-scrollbars "http://localhost:3000/?view=workouts&role=personal"`;
execSync(cmd);

console.log('Done');
