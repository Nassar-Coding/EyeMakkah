import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
const root = process.env.ROOT || "/tmp/ziptest/EyeMakkah_Vercel_DragDrop";
const MIME = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".json":"application/json" };
const server = createServer(async (req,res)=>{ const f=resolve(root, req.url==="/"?"index.html":"."+req.url.split("?")[0]);
  try{const b=await readFile(f);res.writeHead(200,{"Content-Type":MIME[extname(f)]||"text/plain"});res.end(b);}catch{res.writeHead(404);res.end();} });
await new Promise(r=>server.listen(4599,r));
const errs=[]; const browser=await chromium.launch({executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome",args:["--no-sandbox"]});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
page.on("pageerror",e=>errs.push("pageerror: "+e.message));
page.on("console",m=>{if(m.type()==="error"){const t=m.text(); if(!/fonts\.googleapis|ERR_|net::|Failed to load resource/.test(t)) errs.push("console: "+t);}});
for (const lang of ["ar","en"]) {
  await page.goto("http://127.0.0.1:4599/",{waitUntil:"networkidle"}); await page.waitForTimeout(700);
  const landing = await page.locator(".em").innerText();
  await page.getByText(/^(ابدأ|Enter EyeMakkah)$/).first().click(); await page.waitForTimeout(500);
  await page.locator(`[data-lang="${lang}"]`).click(); await page.waitForTimeout(1100);
  const dir = await page.evaluate(()=>document.querySelector(".em")?.getAttribute("dir"));
  const tabs = await page.locator("[data-nav]").count();
  const imgs = await page.evaluate(()=>{const a=[...document.querySelectorAll("img")];
    return {total:a.length, broken:a.filter(i=>i.complete&&i.naturalWidth===0).length};});
  const portal = /portal|بوابة|Citizen|Investor/i.test(await page.locator(".em").innerText());
  console.log(`${lang}: landingFirst=${/EyeMakkah/.test(landing)} dir=${dir} tabs=${tabs} imgs=${imgs.total} broken=${imgs.broken} portalScreen=${portal}`);
}
console.log("errors:", errs.length, errs.slice(0,3));
await browser.close(); server.close();
