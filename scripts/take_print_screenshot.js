import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/Adels/.gemini/antigravity/brain/fab70355-1dc2-4eae-b419-7c2d8d18e2cc';

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let edgePath = edgePaths.find(p => fs.existsSync(p));

const dest = path.join(outDir, '18_print_workout_sheet_modal.png');
console.log('Capturing 18_print_workout_sheet_modal.png...');
// We can test taking screenshot
const cmd = `"${edgePath}" --headless --screenshot="${dest}" --window-size=1366,850 --hide-scrollbars "http://localhost:3000/?view=workouts&role=personal"`;
execSync(cmd);
console.log('Done');
