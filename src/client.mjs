import { createClient } from '@supabase/supabase-js';
import { config } from '../assets/config.mjs';
export const supabase = createClient(config.url,config.publishableKey,{
  auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
});
