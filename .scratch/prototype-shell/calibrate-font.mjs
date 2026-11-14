import { chromium } from '/Applications/ses-lite.app/Contents/Resources/dsh/tools/playwright-cli/node_modules/playwright-core/index.mjs';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try {
 const page=await browser.newPage({viewport:{width:1800,height:1000},deviceScaleFactor:1});
 await page.setContent('<html><body style="margin:0"></body></html>');
 const candidates=await page.evaluate(()=>{
  const ctx=document.createElement('canvas').getContext('2d'),all=[];
  for(const family of ['Inter','Inter Display','Arial','-apple-system','Helvetica Neue','Helvetica'])
   for(let size=47;size<=52;size+=.5)
    for(const weight of [600,650,700,750]) {
     ctx.font=`${weight} ${size}px "${family}"`;
     const spacing=(452-ctx.measureText('RiloPlayer redesign').width)/18;
     const item={family,size,weight,spacing,index:all.length};
     const div=document.createElement('div');
     div.textContent='RiloPlayer redesign';
     Object.assign(div.style,{position:'absolute',left:`${all.length%3*600}px`,top:`${Math.floor(all.length/3)*90}px`,width:'600px',height:'90px',background:'#ededed',color:'#181818',fontFamily:family,fontSize:`${size}px`,fontWeight:weight,lineHeight:'70px',letterSpacing:`${spacing}px`,whiteSpace:'nowrap'});
     document.body.append(div);all.push(item);
    }
  return all;
 });
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:'.scratch/prototype-shell/font-candidates.png',fullPage:true});
 await writeFile('.scratch/prototype-shell/font-candidates.json',JSON.stringify(candidates));
 console.log(`${candidates.length} native-font candidates rendered.`);
} finally {await browser.close();}
