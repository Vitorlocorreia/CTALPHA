import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/Adels/.gemini/antigravity/brain/fab70355-1dc2-4eae-b419-7c2d8d18e2cc';

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let edgePath = edgePaths.find(p => fs.existsSync(p));

const shots = [
  { file: '20_workout_builder_lateral_bio.png', url: 'http://localhost:3000/?view=workout_builder&role=personal' },
  { file: '21_student_portal_bioimpedance.png', url: 'http://localhost:3000/?view=student_portal' }
];

shots.forEach(s => {
  const dest = path.join(outDir, s.file);
  console.log(`Capturing ${s.file}...`);
  const cmd = `"${edgePath}" --headless --screenshot="${dest}" --window-size=1366,850 --hide-scrollbars "${s.url}"`;
  execSync(cmd);
});

console.log('All screenshots captured!');
