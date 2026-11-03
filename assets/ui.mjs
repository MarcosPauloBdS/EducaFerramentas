export const $=id=>document.getElementById(id);
export function node(tag,text,parent,cls){const el=document.createElement(tag);el.textContent=text;if(cls)el.className=cls;parent?.append(el);return el;}
export function message(text){$('status').textContent=text;}
export async function action(button,run){const scope=button.closest('fieldset')||button.closest('form');const controls=scope?[...scope.querySelectorAll('input,select,textarea,button')].map(el=>[el,el.disabled]):[[button,button.disabled]];controls.forEach(([el])=>el.disabled=true);try{await run();}catch(e){message(e.message||'Não foi possível concluir. Tente novamente.');}finally{controls.forEach(([el,disabled])=>el.disabled=disabled);}}
export function check(result){if(result.error)throw Error(result.error.message);return result.data;}
export function conflict(data){if(!data?.length)throw Error('Este registro foi alterado em outro dispositivo. Recarregue os dados antes de salvar.');return data[0];}
