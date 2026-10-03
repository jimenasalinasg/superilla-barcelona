const { chromium } = require('playwright-core');
const { spawn } = require('child_process');
(async()=>{
 const FPS = 30;
 const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
 const p = await b.newPage({viewport:{width:432,height:768}, deviceScaleFactor:2.5});
 const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.clock.install({time:0});
 // node reel/grabar.js        → versión completa
 // node reel/grabar.js corto  → versión de ~30 s
 const SHORT = process.argv[2] === 'corto';
 await p.goto('http://localhost:8000/reel/' + (SHORT ? '?corto' : ''));
 await p.waitForFunction(()=>window.__ready && [...document.images].every(i=>i.complete) && document.fonts.status==='loaded');
 await p.clock.pauseAt(10000);
 const ff = spawn('ffmpeg', ['-y','-loglevel','error','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-',
   '-c:v','libx264','-preset','slow','-crf','18','-pix_fmt','yuv420p','-r',String(FPS),'-movflags','+faststart',SHORT ? 'reel/superilla-reel-30s.mp4' : 'reel/superilla-reel.mp4']);
 ff.stderr.on('data', d => process.stderr.write(d));
 await p.evaluate(()=>{ window.__runReel(); });
 let f = 0, t = 0, extra = 0;
 while (f < FPS * 75) {
   const buf = await p.screenshot({type:'jpeg', quality:95});
   if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
   f++;
   const nt = Math.round(f * 1000 / FPS);
   await p.clock.runFor(nt - t); t = nt;
   if (await p.evaluate(()=>window.__done)) { if (++extra > 3) break; }
   if (f % 150 === 0) console.log('frames', f);
 }
 ff.stdin.end();
 await new Promise(r => ff.on('close', r));
 console.log('total frames', f, 'seconds', (f/FPS).toFixed(1), errs.join('|')||'no errors');
 await b.close();
})();
