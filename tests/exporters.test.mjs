import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {snapshot} from '../assets/document-model.mjs';

test('exportador publicado carrega versões íntegras e gera PDF e Word sem enviar o conteúdo',async()=>{
 const root=new URL('../',import.meta.url),loaded=[];
 const context=vm.createContext({console,setTimeout,clearTimeout,setInterval,clearInterval,queueMicrotask,TextEncoder,TextDecoder,Blob,Uint8Array,ArrayBuffer,crypto:crypto.webcrypto,URL,atob,btoa});
 context.window=context;context.self=context;context.navigator={userAgent:'Test fixture'};context.HTMLAnchorElement=class {};context.HTMLAnchorElement.prototype.download='';
 const previous=globalThis.document;
 globalThis.document={createElement:()=>({remove(){}}),head:{append(script){(async()=>{
  const url=new URL(script.src);assert.equal(url.origin,'https://cdn.jsdelivr.net');assert.equal(script.crossOrigin,'anonymous');
  const path=url.pathname.replace('/npm/','').replace(/@\d+\.\d+\.\d+/,'');
  const bytes=await fs.readFile(new URL('node_modules/'+path,root));
  assert.equal('sha384-'+crypto.createHash('sha384').update(bytes).digest('base64'),script.integrity);
  vm.runInContext(bytes.toString('utf8'),context,{timeout:10000});globalThis.pdfMake=context.pdfMake;globalThis.docx=context.docx;loaded.push(path);script.onload();
 })().catch(e=>{script.onerror();console.error(e.message);});}}};
 try{
  const {pdfBlob,wordBlob}=await import('../assets/exporters.mjs');
  const d=snapshot('Teste de exportação',[{id:'q',statement:'Qual é o resultado de 2 + 2?',options:[{id:'a',text:'5'},{id:'b',text:'4'}],correctId:'b'}],{font:'serif'},'teste');
  const pdf=await pdfBlob(d,true);assert.ok(pdf.size>1000);assert.equal(Buffer.from(await pdf.arrayBuffer()).subarray(0,4).toString(),'%PDF');
  const word=await wordBlob(d);assert.ok(word.size>1000);assert.equal(Buffer.from(await word.arrayBuffer()).subarray(0,2).toString(),'PK');
  const count=loaded.length;await pdfBlob(d);await wordBlob(d,true);assert.equal(loaded.length,count);assert.equal(count,4);
 }finally{globalThis.document=previous;delete globalThis.pdfMake;delete globalThis.docx;}
});
