# Contributing

Thanks for your interest — but please read this before opening anything.

**This repository is publicly viewable, not open source.** It is the production source of
[www.sphpnp.com](https://www.sphpnp.com), operated by Shri Parasram Holdings Pvt. Ltd., a
SEBI-registered stockbroker. It is published for transparency and security review under a
proprietary licence (see [`LICENSE`](LICENSE)).

## Pull requests are not accepted

We do not accept external code contributions. Pull requests will be closed without review.

This is not a judgement on your work. Changes here alter a live financial service and its
regulatory disclosures, so every change has to go through internal review and release
control. There is no mechanism for us to merge outside code into that process.

Please also note that the licence does not grant permission to modify or redistribute this
software, so a fork carrying your changes is not something we can accept or adopt.

## What *is* welcome

| You found | Do this |
|---|---|
| A security vulnerability | Follow [`SECURITY.md`](SECURITY.md) — report privately to [contact@adityarajgoel.com](mailto:contact@adityarajgoel.com). Never open a public issue. |
| An incorrect regulatory detail — SEBI or DP number, compliance contact, disclosure | Email [contact@adityarajgoel.com](mailto:contact@adityarajgoel.com). We take accuracy here seriously and will correct it quickly. |
| A broken page, bad link, or factual error on the site | Email [contact@adityarajgoel.com](mailto:contact@adityarajgoel.com) with the URL. |
| A question about licensing, reuse, or permission | Email [contact@adityarajgoel.com](mailto:contact@adityarajgoel.com). |

Please do not report security issues through public issues, discussions, or social media.

## Not the right place for

- **Investor grievances or complaints** — use the official channels on the
  [Investor Corner](https://www.sphpnp.com/investor-corner), or contact the Compliance
  Officer, Mr. Vivek Sheel Aggarwal, at
  [compliance@sphpl.com](mailto:compliance@sphpl.com). A GitHub issue is not a recorded
  grievance channel and will not satisfy any regulatory timeline.
- **Account, trading, or service queries** — contact the Panipat branch at
  [anil@sphpnp.com](mailto:anil@sphpnp.com).
- **Investment advice** — nothing in this repository is advice, and we cannot give any
  here.

## For maintainers

Internal workflow, for the record:

```sh
npm install          # also enables the pre-commit hook via core.hooksPath
npm run dev          # http://localhost:8080
npm test             # unit (Vitest)
npm run test:e2e     # end-to-end (Playwright)
npx tsc --noEmit     # typecheck
npm run check:secrets # scan staged changes manually
```

A pre-commit hook blocks staged credentials. It is enabled automatically by `npm install`.
If it ever fires on a reviewed false positive, append `secret-scan:allow` to that line
rather than reaching for `--no-verify`.

Adding a page? Register it in **both** `scripts/prerender.js` and
`scripts/generate-sitemap.js`, or it ships with no static HTML and no SEO presence.
