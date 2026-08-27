import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/Adels/.gemini/antigravity/brain/fab70355-1dc2-4eae-b419-7c2d8d18e2cc';

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let edgePath = edgePaths.find(p => fs.existsSync(p));

const destAnamnesis = path.join(outDir, '37_student_anamnesis_profile.png');
console.log('Capturando tela de perfil do aluno com prontuário de Anamnese...');
const cmd = `"${edgePath}" --headless --screenshot="${destAnamnesis}" --window-size=1920,1080 --hide-scrollbars "http://localhost:3000/?view=students"`;
execSync(cmd);

console.log('Screenshot salvo com sucesso!');
