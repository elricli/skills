import { chromium } from '/Applications/ses-lite.app/Contents/Resources/dsh/tools/playwright-cli/node_modules/playwright-core/index.mjs';
import { pathToFileURL } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
const output = process.argv[2] || '.scratch/prototype-shell/after-1';
await mkdir(output, {recursive:true});
const browser = await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try {
  const page = await browser.newPage({viewport:{width:2000,height:1870},deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL('/Users/elric/Codespaces/Elric/skills/skills/prototype/assets/canvas.html').href);
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`${output}/actual.png`});
  const geometry=await page.evaluate(()=>Object.fromEntries(['.title-bar','.project-title','#export-canvas','#fullscreen','#close-preview','.page-menu','.view-controls','#canvas-heading','#page-list .page-label','#page-list .screen','#page-detail .page-label','#page-detail .screen','#dock'].map(selector=>{const e=document.querySelector(selector),r=e.getBoundingClientRect(),style=getComputedStyle(e);return[selector,{x:r.x,y:r.y,width:r.width,height:r.height,font:style.font,color:style.color}]})));
  await writeFile(`${output}/geometry.json`,JSON.stringify({geometry,errors},null,2));
  console.log(JSON.stringify({output,geometry,errors},null,2));
} finally {await browser.close();}
