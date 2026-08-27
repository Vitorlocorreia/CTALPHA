import puppeteer from 'puppeteer';
import path from 'path';

const outDir = 'C:/Users/Adels/.gemini/antigravity/brain/fab70355-1dc2-4eae-b419-7c2d8d18e2cc';

async function capture() {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('http://localhost:3000/?view=students', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Click first student row
  const rows = await page.$$('tbody tr');
  if (rows.length > 0) {
    await rows[0].click();
    await new Promise(r => setTimeout(r, 600));

    // Click on "Anamnese & Avaliação" tab
    const tabs = await page.$$('button');
    for (const tab of tabs) {
      const text = await page.evaluate(el => el.textContent, tab);
      if (text && text.includes('Anamnese & Avaliação')) {
        await tab.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: path.join(outDir, '37_student_drawer_anamnese_tab.png') });
    console.log('37_student_drawer_anamnese_tab.png capturado!');

    // Click on "Atualizar Avaliação" button to show full 6-tab modal
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Atualizar Avaliação')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: path.join(outDir, '38_student_anamnese_full_modal.png') });
    console.log('38_student_anamnese_full_modal.png capturado!');
  }

  await browser.close();
}

capture().catch(err => {
  console.error('Erro na captura:', err);
  process.exit(1);
});
