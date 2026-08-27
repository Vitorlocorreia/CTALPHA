import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/Adels/.gemini/antigravity/brain/fab70355-1dc2-4eae-b419-7c2d8d18e2cc';

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let edgePath = edgePaths.find(p => fs.existsSync(p));

const dest = path.join(outDir, '35_reception_dashboard_no_financial.png');
console.log('Capturando dashboard da recepção sem dados financeiros...');
const cmd = `"${edgePath}" --headless --screenshot="${dest}" --window-size=1920,1080 --hide-scrollbars "http://localhost:3000/?view=dashboard&role=recepcao"`;
execSync(cmd);

const destStudents = path.join(outDir, '36_reception_students_view.png');
console.log('Capturando lista de alunos da recepção sem faturamento...');
const cmd2 = `"${edgePath}" --headless --screenshot="${destStudents}" --window-size=1920,1080 --hide-scrollbars "http://localhost:3000/?view=students&role=recepcao"`;
execSync(cmd2);

console.log('Screenshots da recepção salvos com sucesso!');
