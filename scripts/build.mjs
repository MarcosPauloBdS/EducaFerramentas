import { build } from 'esbuild';
await import('./generate-pages.mjs');
await build({entryPoints:['src/client.mjs'],bundle:true,minify:true,format:'esm',platform:'browser',target:'es2022',outfile:'assets/client.mjs',legalComments:'eof'});
