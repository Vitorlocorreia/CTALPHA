import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/Adels/.gemini/antigravity/brain/fab70355-1dc2-4eae-b419-7c2d8d18e2cc';

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let edgePath = edgePaths.find(p => fs.existsSync(p));

const targets = [
  { name: '27_workout_builder_multi_routine_assessment.png', url: 'http://localhost:3000/?view=workout_builder&role=personal', width: 1920, height: 1080 },
  { name: '28_student_portal_workout_hub.png', url: 'http://localhost:3000/?view=student_portal', width: 1440, height: 900 },
  { name: '29_workout_builder_mobile.png', url: 'http://localhost:3000/?view=workout_builder&role=personal', width: 390, height: 844 }
];

for (const t of targets) {
  const dest = path.join(outDir, t.name);
  console.log(`Capturing: ${t.name}...`);
  // Use --virtual-time-budget=3000 so lazy modules load completely before screenshot
  const cmd = `"${edgePath}" --headless --screenshot="${dest}" --window-size=${t.width},${t.height} --virtual-time-budget=3000 --hide-scrollbars "${t.url}"`;
  execSync(cmd);
}

console.log('Screenshots captured successfully with virtual time budget!');
