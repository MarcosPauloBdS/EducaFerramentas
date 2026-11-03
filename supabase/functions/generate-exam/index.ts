import {createClient} from 'npm:@supabase/supabase-js@2.118.0';
import {createHandler,requestQuestions} from './core.mjs';
const url=Deno.env.get('SUPABASE_URL')!;
const anon=Deno.env.get('SUPABASE_ANON_KEY')!;
const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const userClient=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
Deno.serve(createHandler({
  authenticate:async(token:string)=>{const {data,error}=await userClient.auth.getUser(token);return error?null:data.user;},
  reserve:async(id:string)=>{const {data,error}=await admin.rpc('reserve_ai_generation',{p_user_id:id});if(error)throw Error('Quota unavailable');return data;},
  isConfigured:()=>Boolean(Deno.env.get('GROQ_API_KEY')),
  generate:async(input:Parameters<typeof requestQuestions>[0])=>requestQuestions(input,Deno.env.get('GROQ_API_KEY')!)
}));
