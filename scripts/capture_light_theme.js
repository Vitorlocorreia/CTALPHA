import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/Adels/.gemini/antigravity/brain/fab70355-1dc2-4eae-b419-7c2d8d18e2cc';

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let edgePath = edgePaths.find(p => fs.existsSync(p));

const dest = path.join(outDir, '31_light_theme_dashboard.png');
console.log('Capturando tela com tema claro padrão...');
const cmd = `"${edgePath}" --headless --screenshot="${dest}" --window-size=1920,1080 --hide-scrollbars "http://localhost:3000/?view=dashboard&theme=light"`;
execSync(cmd);

const dest2 = path.join(outDir, '32_light_theme_workout_builder.png');
console.log('Capturando construtor de treinos com tema claro padrão...');
const cmd2 = `"${edgePath}" --headless --screenshot="${dest2}" --window-size=1920,1080 --hide-scrollbars "http://localhost:3000/?view=workout_builder&theme=light"`;
execSync(cmd2);

console.log('Screenshots do tema claro salvos com sucesso!');
