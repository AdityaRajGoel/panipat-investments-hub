import fs from 'fs';
const path = 'supabase/functions/fetch-stock-prices/index.ts';
let code = fs.readFileSync(path, 'utf8');
code = code.replace(/const CACHE_TTL_MS = 0;/, "const CACHE_TTL_MS = 2 * 60 * 1000;");
code = code.replace(/const ttl = 0;/, "const ttl = marketStatus.isOpen ? CACHE_TTL_MS : 10 * 60 * 1000;");
fs.writeFileSync(path, code);
console.log("Restored TTL");
