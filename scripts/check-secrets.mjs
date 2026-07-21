#!/usr/bin/env node
/**
 * Pre-commit secret scanner.
 *
 * Blocks a commit when staged content looks like a live credential. This repo is
 * public, so a pushed secret is a rotation event — CI catches it far too late,
 * which is exactly how a .env holding live Gemini and Groq keys ended up in 616
 * commits of history.
 *
 * Scans the STAGED blob (`git show :file`), not the working tree, so partial
 * `git add -p` staging cannot smuggle a key past the check.
 *
 * Escape hatches, in order of preference:
 *   1. Put the value in .env (gitignored) and reference it via env vars.
 *   2. Append `secret-scan:allow` on the same line for a reviewed false positive.
 *   3. `git commit --no-verify` — last resort, leaves no record. Avoid.
 */

import { execFileSync } from 'node:child_process';

const ALLOW_MARKER = 'secret-scan:allow';

/** Files that must never be committed, matched on path. */
const BLOCKED_PATHS = [
  { re: /(^|\/)\.env$/, why: 'real .env file (commit .env.example instead)' },
  { re: /(^|\/)\.env\.(?!example$|sample$|template$)[^/]+$/, why: 'environment file' },
  { re: /\.(pem|key|p12|pfx|jks|keystore)$/i, why: 'key or certificate material' },
  { re: /(^|\/)id_(rsa|dsa|ecdsa|ed25519)$/, why: 'private SSH key' },
  { re: /(^|\/)\.(npmrc|netrc|pypirc)$/, why: 'may contain registry auth tokens' },
  { re: /service-account.*\.json$/i, why: 'service-account credentials' },
  { re: /credentials.*\.json$/i, why: 'credentials file' },
];

/** Content patterns. Anchored and length-bound to limit false positives. */
const SECRET_PATTERNS = [
  { name: 'Google / Gemini API key', re: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { name: 'Groq API key', re: /\bgsk_[A-Za-z0-9]{40,}\b/ },
  { name: 'OpenRouter API key', re: /\bsk-or-v1-[a-f0-9]{48,}\b/ },
  { name: 'Cerebras API key', re: /\bcsk-[a-z0-9]{40,}\b/ },
  { name: 'Anthropic API key', re: /\bsk-ant-[A-Za-z0-9_-]{20,}\b/ },
  { name: 'OpenAI API key', re: /\bsk-(?:proj-)?[A-Za-z0-9]{40,}\b/ },
  { name: 'GitHub token', re: /\b(?:ghp|gho|ghs|ghu)_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{30,}\b/ },
  { name: 'AWS access key id', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'Slack token', re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: 'Telegram bot token', re: /\b\d{8,10}:AA[A-Za-z0-9_-]{33}\b/ },
  { name: 'Private key block', re: /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/ },
  { name: 'Supabase service-role assignment', re: /SUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*['"][A-Za-z0-9._-]{20,}['"]/ },
];

/** JWTs: only service_role is dangerous. Anon keys ship to every browser. */
const JWT_RE = /\beyJ[A-Za-z0-9_-]{10,}\.(eyJ[A-Za-z0-9_-]{10,})\.[A-Za-z0-9_-]{10,}\b/g;

function decodeJwtRole(payloadB64) {
  try {
    const json = Buffer.from(payloadB64, 'base64url').toString('utf8');
    return JSON.parse(json).role ?? null;
  } catch {
    return null;
  }
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

const staged = git(['diff', '--cached', '--name-only', '--diff-filter=ACM'])
  .split('\n')
  .map((s) => s.trim())
  .filter(Boolean);

if (staged.length === 0) process.exit(0);

const findings = [];

for (const file of staged) {
  for (const { re, why } of BLOCKED_PATHS) {
    if (re.test(file)) findings.push({ file, line: 0, what: `blocked file — ${why}` });
  }

  let content;
  try {
    content = git(['show', `:${file}`]);
  } catch {
    continue; // deleted or unreadable in the index
  }
  // Skip binaries: a NUL byte in the first chunk is the usual heuristic.
  if (content.slice(0, 8000).includes('\0')) continue;

  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (line.includes(ALLOW_MARKER)) return;

    for (const { name, re } of SECRET_PATTERNS) {
      if (re.test(line)) findings.push({ file, line: i + 1, what: name });
    }

    for (const m of line.matchAll(JWT_RE)) {
      const role = decodeJwtRole(m[1]);
      if (role && role !== 'anon') {
        findings.push({ file, line: i + 1, what: `Supabase JWT with role "${role}"` });
      }
    }
  });
}

if (findings.length === 0) process.exit(0);

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const dim = (s) => `\x1b[90m${s}\x1b[0m`;

console.error(`\n${red('COMMIT BLOCKED')} — possible credentials in staged changes:\n`);
for (const f of findings) {
  const loc = f.line ? `${f.file}:${f.line}` : f.file;
  console.error(`  ${red('•')} ${loc}\n    ${f.what}`);
}
console.error(`
${dim('This repository is public. A pushed secret must be rotated, not just removed —')}
${dim('git history and forks keep serving it.')}

Fix by:
  1. Moving the value into .env (gitignored) or Supabase secrets, then
     referencing it via an environment variable.
  2. If this is a reviewed false positive, append ${dim(ALLOW_MARKER)} to that line.
`);
process.exit(1);
