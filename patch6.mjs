import fs from 'fs';
const path = 'supabase/functions/fetch-stock-prices/index.ts';
let code = fs.readFileSync(path, 'utf8');
code = code.replace(/const CACHE_TTL_MS = 2 \* 60 \* 1000;/, "const CACHE_TTL_MS = 0;");
code = code.replace(/const ttl = marketStatus\.isOpen \? CACHE_TTL_MS : 10 \* 60 \* 1000;/, "const ttl = 0;");
fs.writeFileSync(path, code);
console.log("Patched to clear cache");
