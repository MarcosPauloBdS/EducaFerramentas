import {themes} from './theme-data.mjs';
import {$,message} from './ui.mjs';
function save(){try{localStorage.setItem('educa.preferences',JSON.stringify({theme:document.documentElement.dataset.theme,motion:document.documentElement.dataset.motion,text:document.documentElement.dataset.text}));}catch{message('Preferências aplicadas. Este navegador não permitiu salvá-las para a próxima visita.');}}
function sync(){document.querySelectorAll('[data-pick-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pickTheme===document.documentElement.dataset.theme)));if($('text-size'))$('text-size').value=document.documentElement.dataset.text||'normal';if($('motion'))$('motion').checked=document.documentElement.dataset.motion!=='off';const color=themes.find(t=>t.id===document.documentElement.dataset.theme)?.bg;document.querySelector('meta[name=theme-color]')?.setAttribute('content',color||'#080f14');}
document.querySelectorAll('[data-pick-theme]').forEach(b=>b.addEventListener('click',()=>{document.documentElement.dataset.theme=b.dataset.pickTheme;save();sync();message('Tema '+b.dataset.themeName+' aplicado.');}));
$('text-size')?.addEventListener('change',()=>{document.documentElement.dataset.text=$('text-size').value;save();message('Tamanho do texto atualizado.');});
$('motion')?.addEventListener('change',()=>{document.documentElement.dataset.motion=$('motion').checked?'auto':'off';save();message($('motion').checked?'Movimento suave ativado, respeitando as preferências do dispositivo.':'Animações de fundo desativadas.');});
sync();
