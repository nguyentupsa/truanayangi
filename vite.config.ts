import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import {fileURLToPath} from 'node:url';
// Normalize PUBLIC_BASE_PATH: '' | '/' -> root; '/foo' | 'foo' | '/foo/' -> '/foo/'.
// Vite `base` needs a trailing slash so %BASE_URL% in index.html resolves cleanly.
const stripped=(process.env.PUBLIC_BASE_PATH || '').replace(/^\/+|\/+$/g,'');
const base=stripped ? `/${stripped}/` : '/';
const appBase=stripped ? `/${stripped}` : '';
export default defineConfig({plugins:[react()],server:{host:'127.0.0.1',port:5173,strictPort:true},preview:{host:'127.0.0.1',port:4173,strictPort:true},base,css:{postcss:{plugins:[tailwindcss()]}},resolve:{alias:{'@':fileURLToPath(new URL('./src',import.meta.url))}},define:{'process.env.NEXT_PUBLIC_BASE_PATH':JSON.stringify(appBase)}});
