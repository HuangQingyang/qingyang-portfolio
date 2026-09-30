import { copyFileSync, mkdirSync } from 'node:fs';

mkdirSync('dist/server', { recursive: true });
copyFileSync('src/site-worker.js', 'dist/server/index.js');
