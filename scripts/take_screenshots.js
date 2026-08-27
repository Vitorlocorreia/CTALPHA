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
  { name: '01_dashboard_light.png', url: 'http://localhost:3000/?view=dashboard&theme=light' },
  { name: '02_dashboard_dark.png', url: 'http://localhost:3000/?view=dashboard&theme=dark' },
  { name: '03_alunos_light.png', url: 'http://localhost:3000/?view=students&theme=light' },
  { name: '04_treino_light.png', url: 'http://localhost:3000/?view=workouts&theme=light' },
  { name: '05_atendimento_ia_light.png', url: 'http://localhost:3000/?view=commercial&theme=light' },
  { name: '06_financeiro_light.png', url: 'http://localhost:3000/?view=financial&theme=light' },
  { name: '07_migracao_g3_light.png', url: 'http://localhost:3000/?view=migration&theme=light' },
];

for (const v of views) {
  const dest = path.join(outDir, v.name);
  console.log(`Capturing ${v.name}...`);
  const cmd = `"${edgePath}" --headless --screenshot="${dest}" --window-size=1280,920 --hide-scrollbars "${v.url}"`;
  execSync(cmd);
}

console.log('All screenshots taken successfully!');
