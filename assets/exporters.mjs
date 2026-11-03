import {exportPDF,exportWord} from '../assets/document-format.mjs';
// Pinned package files with integrity checks. Content is converted on the device.
const files={
 pdf:['pdfmake@0.3.13/build/pdfmake.min.js','sha384-/JVvlU2iyYp0inj2VW4i5tkJYTSn1bVkfuhFeEXFTXMMgiSjR+dDD1pnRqgl5csu'],
 fonts:['pdfmake@0.3.13/build/vfs_fonts.js','sha384-pkBUW1wxcm6m7ZjKDxADnNHqnz+Sx9sAL1ndsLNv/GZnWZgodPYsju1yxeyQnn0c'],
 times:['pdfmake@0.3.13/build/standard-fonts/Times.js','sha384-y/dBmhl0YEph+tuAYmmisNrcQrcV4KVDpYKBda0pT8Cd/VLggAFt7VDMaumsFChM'],
 word:['docx@9.15.1/dist/index.iife.js','sha384-ud8085E8t6iW4uUom5nN5cpzTZ4OdsNKB/AKWfOsI62tzsoV2X7r7/o4KWESO8rq']
};
const pending=new Map();
function load(name){if(!pending.has(name)){const [path,integrity]=files[name];const promise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/'+path;script.integrity=integrity;script.crossOrigin='anonymous';script.referrerPolicy='no-referrer';script.onload=resolve;script.onerror=()=>{script.remove();pending.delete(name);reject(Error('Não foi possível carregar o exportador. Confira sua conexão e tente novamente.'));};document.head.append(script);});pending.set(name,promise);}return pending.get(name);}
export async function pdfBlob(doc,key=false){await load('pdf');await load('fonts');await load('times');return exportPDF(doc,key,globalThis.pdfMake);}
export async function wordBlob(doc,key=false){await load('word');return exportWord(doc,key,globalThis.docx);}
