import {requireUser} from './session.mjs';
import {supabase} from './client.mjs';
import {$} from './ui.mjs';
const user=await requireUser();
$('greeting').textContent='Seu espaço está pronto.';
const results=await Promise.all(['classrooms','students','exams'].map(t=>supabase.from(t).select('id',{count:'exact',head:true})));
results.forEach((r,i)=>{const el=$(['count-classes','count-students','count-exams'][i]);el.textContent=r.error?'Indisponível':String(r.count??0);});
