import pdfMake from 'pdfmake/build/pdfmake.js';
import vfs from 'pdfmake/build/vfs_fonts.js';
import times from 'pdfmake/build/standard-fonts/Times.js';
import * as docx from 'docx';
import {exportPDF,exportWord} from '../assets/document-format.mjs?v=20261103-cadernos1';
pdfMake.addVirtualFileSystem(vfs);
pdfMake.addFontContainer(times);
export const pdfBlob=(doc,key=false)=>exportPDF(doc,key,pdfMake);
export const wordBlob=(doc,key=false)=>exportWord(doc,key,docx);
