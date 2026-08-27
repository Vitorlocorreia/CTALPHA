import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/Adels/.gemini/antigravity/brain/fab70355-1dc2-4eae-b419-7c2d8d18e2cc';

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let edgePath = edgePaths.find(p => fs.existsSync(p));

const auditTargets = [
  // Desktop
  { file: 'resp_desktop_1920_dashboard.png', url: 'http://localhost:3000/?view=dashboard', w: 1920, h: 1080 },
  { file: 'resp_desktop_1920_workouts.png', url: 'http://localhost:3000/?view=workout_builder', w: 1920, h: 1080 },
  { file: 'resp_desktop_1440_students.png', url: 'http://localhost:3000/?view=students', w: 1440, h: 900 },
  
  // Tablet Landscape
  { file: 'resp_tablet_1024_dashboard.png', url: 'http://localhost:3000/?view=dashboard', w: 1024, h: 768 },
  { file: 'resp_tablet_1024_workouts.png', url: 'http://localhost:3000/?view=workout_builder', w: 1024, h: 768 },
  
  // Tablet Portrait
  { file: 'resp_tablet_768_students.png', url: 'http://localhost:3000/?view=students', w: 768, h: 1024 },
  { file: 'resp_tablet_768_crm.png', url: 'http://localhost:3000/?view=commercial', w: 768, h: 1024 },

  // Mobile Grande (430x932)
  { file: 'resp_mobile_430_dashboard.png', url: 'http://localhost:3000/?view=dashboard', w: 430, h: 932 },
  { file: 'resp_mobile_430_workouts.png', url: 'http://localhost:3000/?view=workout_builder', w: 430, h: 932 },
  
  // Mobile Padrão (390x844)
  { file: 'resp_mobile_390_students.png', url: 'http://localhost:3000/?view=students', w: 390, h: 844 },
  { file: 'resp_mobile_390_portal.png', url: 'http://localhost:3000/?view=student_portal', w: 390, h: 844 },
  
  // Mobile Pequeno (375x812)
  { file: 'resp_mobile_375_workouts.png', url: 'http://localhost:3000/?view=workout_builder', w: 375, h: 812 },
  { file: 'resp_mobile_375_financial.png', url: 'http://localhost:3000/?view=financial', w: 375, h: 812 }
];

console.log(`Starting Responsive QA Audit for ${auditTargets.length} devices...`);

for (const t of auditTargets) {
  const dest = path.join(outDir, t.file);
  console.log(`Auditing: ${t.file} (${t.w}x${t.h})...`);
  try {
    const cmd = `"${edgePath}" --headless --screenshot="${dest}" --window-size=${t.w},${t.h} --hide-scrollbars "${t.url}"`;
    execSync(cmd, { stdio: 'pipe' });
  } catch (err) {
    console.error(`Error capturing ${t.file}:`, err.message);
  }
}

console.log('Responsive QA Multi-Device Audit completed successfully!');
