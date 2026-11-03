import test from 'node:test';
import assert from 'node:assert/strict';
import {validateInput,validateOutput,providerPayload,requestQuestions,createHandler} from '../supabase/functions/generate-exam/core.mjs';
import {arrange} from '../assets/domain.mjs';
const input={topic:'Frações equivalentes',subject:'Matemática',level:'Fundamental II',difficulty:'intermediária',count:1};
const generated={questions:[{statement:'Qual fração é equivalente a um meio?',options:['2/4','1/3','3/5','4/5'],correctIndex:0,explanation:'Multiplicar numerador e denominador por dois mantém o valor da fração.'}]};
const post=(body=input,token='signed-user',origin='https://marcospaulobds.github.io')=>new Request('https://example.invalid/generate-exam',{method:'POST',headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{}),...(origin?{origin}:{})},body:JSON.stringify(body)});
test('regressão real: rejeita várias frações equivalentes e gabarito inconsistente',()=>{
 const q={statement:'Qual das opções representa uma fração equivalente a 3/4?',options:['1/2','6/8','9/12','12/16'],correctIndex:1,explanation:'Multiplicando numerador e denominador por dois, temos seis oitavos.'};
 assert.throws(()=>validateOutput({questions:[q]},1),e=>e.code==='CONTENT_CHECK_FAILED');
 assert.throws(()=>validateOutput({questions:[{...q,statement:'Qual das frações abaixo é equivalente a 3/4?'}]},1),e=>e.code==='CONTENT_CHECK_FAILED');
 const correct={...q,options:['1/2','6/8','9/16','12/20']};assert.equal(validateOutput({questions:[correct]},1,()=> 'math')[0].correctId,'math-1');
 assert.throws(()=>validateOutput({questions:[{...correct,correctIndex:0}]},1),e=>e.code==='CONTENT_CHECK_FAILED');
});
function service(overrides={}){const calls={reserve:0,generate:0};return{calls,handler:createHandler({authenticate:async()=>({id:'verified-user'}),isConfigured:()=>true,reserve:async id=>{assert.equal(id,'verified-user');calls.reserve++;return{allowed:true,remaining:9};},generate:async()=>{calls.generate++;return validateOutput(generated,1,()=> 'question');},...overrides})};}
test('entrada limitada a tema curricular, nível, dificuldade e 1–3 questões',()=>{
 assert.equal(validateInput(input).count,1);
 for(const body of [{...input,count:4},{...input,topic:'a'},{...input,user_id:'other-user'},{...input,apiKey:'do-not-accept'},{...input,subject:'x'.repeat(61)}])assert.throws(()=>validateInput(body));
});
test('validação rejeita saída incompleta, alternativas repetidas e gabaritos inválidos',()=>{
 const q=generated.questions[0];for(const body of [{questions:[]},{questions:[{...q,correctIndex:4}]},{questions:[{...q,options:['a','A','b','c']}]},{questions:[{...q,explanation:''}]}])assert.throws(()=>validateOutput(body,1));
 const normalized=validateOutput(generated,1,()=> 'fixed')[0];assert.equal(normalized.correctId,'fixed-0');for(let n=0;n<30;n++){const r=arrange(normalized,true);assert.equal(r.options[r.answer.charCodeAt(0)-65].text,'2/4');}
});
test('sem autenticação, sessão inválida ou usuário anônimo não há cota nem chamada de IA',async()=>{
 for(const item of [{token:null,authenticate:async()=>null},{token:'bad',authenticate:async()=>null},{token:'anonymous',authenticate:async()=>({id:'x',is_anonymous:true})}]){const s=service({authenticate:item.authenticate});const r=await s.handler(post(input,item.token));assert.equal(r.status,401);assert.deepEqual(s.calls,{reserve:0,generate:0});}
});
test('chave ausente, origem proibida e entrada excessiva falham antes do provedor',async()=>{
 const missing=service({isConfigured:()=>false});assert.equal((await missing.handler(post())).status,503);assert.deepEqual(missing.calls,{reserve:0,generate:0});
 const s=service();assert.equal((await s.handler(post(input,'token','https://other.invalid'))).status,403);assert.equal((await s.handler(post({...input,topic:'x'.repeat(3000)}))).status,413);assert.deepEqual(s.calls,{reserve:0,generate:0});
});
test('GET de disponibilidade não reserva cota; preflight permitido não exige sessão',async()=>{
 const s=service({isConfigured:()=>false});const r=await s.handler(new Request('https://example.invalid',{headers:{authorization:'Bearer token'}}));assert.equal((await r.json()).available,false);assert.deepEqual(s.calls,{reserve:0,generate:0});
 const preflight=await s.handler(new Request('https://example.invalid',{method:'OPTIONS',headers:{origin:'https://marcospaulobds.github.io'}}));assert.equal(preflight.status,204);assert.equal(preflight.headers.get('Access-Control-Allow-Origin'),'https://marcospaulobds.github.io');
});
test('cota esgotada não chama o provedor e retorna tempo de espera',async()=>{
 const s=service({reserve:async()=>({allowed:false,code:'COOLDOWN',retryAfter:60})});const r=await s.handler(post());assert.equal(r.status,429);assert.equal(r.headers.get('Retry-After'),'60');assert.equal(s.calls.generate,0);
});
test('resposta normalizada e cota são retornadas, sem adicionar/salvar prova automaticamente',async()=>{
 const s=service();const r=await s.handler(post());const body=await r.json();assert.equal(r.status,200);assert.equal(body.questions[0].correctId,'question-0');assert.equal(body.remaining,9);assert.equal(s.calls.generate,1);
});
test('provedor recebe somente instruções curriculares, com esquema estrito e limite de saída',async()=>{
 const payload=providerPayload(input);assert.equal(payload.response_format.json_schema.strict,true);assert.equal(payload.max_completion_tokens,4096);assert.deepEqual(JSON.parse(payload.messages[1].content),input);
 const q=await requestQuestions(input,'synthetic-test-secret',async(url,options)=>{assert.equal(url,'https://api.groq.com/openai/v1/chat/completions');assert.equal(options.headers.Authorization,'Bearer synthetic-test-secret');return Response.json({choices:[{finish_reason:'stop',message:{content:JSON.stringify(generated)}}]});});assert.equal(q.length,1);
});
test('limite, chave inválida, truncamento e indisponibilidade do provedor têm erros controlados',async()=>{
 for(const [status,code]of [[429,'PROVIDER_LIMIT'],[401,'AI_CONFIGURATION'],[503,'PROVIDER_UNAVAILABLE']])await assert.rejects(requestQuestions(input,'secret',async()=>new Response('upstream-private-info',{status})),e=>e.code===code&&!e.message.includes('private'));
 await assert.rejects(requestQuestions(input,'secret',async()=>Response.json({choices:[{finish_reason:'length',message:{content:JSON.stringify(generated)}}]})),e=>e.code==='INVALID_OUTPUT');
});
