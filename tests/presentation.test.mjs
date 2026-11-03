import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {themes} from '../assets/theme-data.mjs';
const root=new URL('../',import.meta.url);
const files=['index.html','provas.html','relatorios.html','aparencia.html','conta.html'];
test('todas as páginas têm Open Graph estático e imagem pública 1200 × 630',()=>{
 for(const file of files){const html=fs.readFileSync(new URL(file,root),'utf8');
   for(const key of ['og:title','og:type','og:url','og:image','og:description','og:image:alt'])assert.match(html,new RegExp(`property="${key}" content="[^"]+"`),file+' '+key);
   const url=html.match(/property="og:image" content="([^"]+)"/)[1];assert.ok(url.startsWith('https://marcospaulobds.github.io/EducaFerramentas/assets/social/'));
   const local=url.split('/EducaFerramentas/')[1];const png=fs.readFileSync(new URL(local,root));assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
   assert.match(html,/name="twitter:card" content="summary_large_image"/);assert.match(html,/rel="icon"/);assert.match(html,/class="dock" aria-label="Menu principal"/);assert.match(html,/class="skip-link"/);
 }
});
test('áreas de trabalho vêm ocultas mesmo antes de executar JavaScript',()=>{
 for(const file of files.filter(f=>f!=='conta.html')){const html=fs.readFileSync(new URL(file,root),'utf8');assert.match(html,/body data-protected="true"/);assert.match(html,/id="protected-content" data-protected-content hidden/);}
});
const linear=c=>{const v=parseInt(c,16)/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;};
const luminance=h=>{const s=h.slice(1);return .2126*linear(s.slice(0,2))+.7152*linear(s.slice(2,4))+.0722*linear(s.slice(4,6));};
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
test('cinco temas mantêm contraste de texto de pelo menos 4,5:1 nos pares principais',()=>{
 assert.equal(themes.length,5);
 for(const t of themes)for(const [front,back] of [[t.text,t.bg],[t.text,t.surface],[t.muted,t.surface],[t.muted,t.panel],[t.accent,t.surface],[t.ink,t.accent]])assert.ok(contrast(front,back)>=4.5,`${t.name}: ${front} / ${back} = ${contrast(front,back).toFixed(2)}`);
});
test('redução de movimento, preferências persistentes e ícones estão presentes',()=>{
 const css=fs.readFileSync(new URL('assets/app.css',root),'utf8');assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);assert.match(css,/data-motion=off/);assert.match(css,/safe-area-inset-bottom/);
 const ico=fs.readFileSync(new URL('favicon.ico',root));assert.equal(ico.readUInt16LE(2),1);assert.ok(fs.existsSync(new URL('assets/brand/apple-touch-icon.png',root)));
});
