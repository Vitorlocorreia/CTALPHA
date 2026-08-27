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

const views = [
  { name: '11_student_portal.png', url: 'http://localhost:3000/?view=student_portal' },
  { name: '12_workout_tracker_app.png', url: 'http://localhost:3000/?view=workout_tracker' },
];

for (const v of views) {
  const dest = path.join(outDir, v.name);
  console.log(`Capturing ${v.name}...`);
  const cmd = `"${edgePath}" --headless --screenshot="${dest}" --window-size=1280,1000 --hide-scrollbars "${v.url}"`;
  execSync(cmd);
}

console.log('Accordion screenshots captured successfully!');
