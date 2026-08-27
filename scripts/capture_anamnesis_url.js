import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/Adels/.gemini/antigravity/brain/fab70355-1dc2-4eae-b419-7c2d8d18e2cc';

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let edgePath = edgePaths.find(p => fs.existsSync(p));

const destAnamnese = path.join(outDir, '37_student_drawer_anamnese_tab.png');
console.log('Capturando tela de Anamnese & Avaliação permanente...');
const cmd1 = `"${edgePath}" --headless --screenshot="${destAnamnese}" --window-size=1920,1080 --hide-scrollbars "http://localhost:3000/?view=students&student=std-1&tab=anamnese"`;
execSync(cmd1);

const destCadastral = path.join(outDir, '38_student_drawer_cadastral_tab.png');
console.log('Capturando tela de Dados Cadastrais & Emergência...');
const cmd2 = `"${edgePath}" --headless --screenshot="${destCadastral}" --window-size=1920,1080 --hide-scrollbars "http://localhost:3000/?view=students&student=std-1&tab=cadastral"`;
execSync(cmd2);

console.log('Screenshots capturados com sucesso!');
