#!/usr/bin/env python3
"""Translate the UI i18n strings with IndicTrans2 - the open AI4Bharat model that
BHASHINI itself serves - so no BHASHINI/ULCA registration is needed.

Setup (Python 3.10-3.13):
    python -m venv .venv && source .venv/bin/activate
    pip install "torch" "transformers==4.46.3" "tokenizers>=0.20,<0.21" \
                sentencepiece IndicTransToolkit

AUTH: The AI4Bharat IndicTrans2 weights are gated on HuggingFace (free, instant
click-through - much lighter than the BHASHINI/ULCA portal). One-time:
    1. Create a free account at https://huggingface.co and accept the model card at
       https://huggingface.co/ai4bharat/indictrans2-en-indic-dist-200M
    2. huggingface-cli login        (or: export HF_TOKEN=hf_xxx)

Run:
    python scripts/translate_indictrans2.py            # -> scripts/i18n-out.json

Then paste the per-language blocks into src/i18n/config.ts. Review finance terms
with a native speaker before a public launch.

Env overrides: IT2_MODEL (weights repo), IT2_TOKENIZER (defaults to IT2_MODEL).
"""
import os
import json
import sys

import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from IndicTransToolkit.processor import IndicProcessor

MODEL = os.environ.get("IT2_MODEL", "ai4bharat/indictrans2-en-indic-dist-200M")
TOKENIZER = os.environ.get("IT2_TOKENIZER", MODEL)

# IndicTrans2 target language codes.
TARGETS = {"hi": "hin_Deva", "pa": "pan_Guru", "gu": "guj_Gujr"}

# English source strings, keyed by the i18n key (keep in sync with config.ts `en`).
EN = {
    "nav.services": "Our Services",
    "nav.unlistedSpace": "Unlisted Shares",
    "nav.markets": "Markets",
    "nav.tools": "Tools",
    "nav.learn": "Learn",
    "nav.about": "About Us",
    "nav.contact": "Contact Us",
    "cta.clientLogin": "Client Login",
    "cta.webTrade": "Web Trade",
    "cta.openAccount": "Open Account",
    "lang.label": "Language",
    "hero.title1": "Your Trusted Partner",
    "hero.title2": "for Smart Investments",
    "hero.subtitle": "Parasram India brings decades of stock broking expertise to Panipat. Join thousands of investors who trust us with their financial future.",
    "hero.ctaInvest": "Start Investing Today",
    "hero.ctaTrade": "Start Trading Now",
    "footer.ctaBand": "Open Free Demat Account",
    "footer.col.company": "Company",
    "footer.col.tools": "Markets and Tools",
    "footer.col.important": "Important Links",
    "footer.col.branch": "Panipat Branch",
    "page.services": "Our Services",
    "page.fno": "F&O Dashboard",
    "page.learn": "Learning Center",
    "page.screener": "Stock Screener",
    "page.marketIntel": "Market Intelligence",
    "page.recommendations": "Stock Recommendations",
    "mi.sentiment": "Sentiment and Institutional Flows",
    "mi.global": "Global Cues and Sectors",
    "mi.movers": "Movers and Commodities",
    "mi.currency": "Currency and Fund Flows",
    "mi.eyebrow": "Research and Analytics",
    "mi.subtitle": "Live market insights, institutional flows, and derivatives analytics",
    "services.eyebrow": "What We Offer",
}


def main() -> None:
    print("Loading IndicTrans2 (distilled 200M)...", file=sys.stderr)
    tok = AutoTokenizer.from_pretrained(TOKENIZER, trust_remote_code=True)
    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL, trust_remote_code=True)
    model.eval()
    ip = IndicProcessor(inference=True)

    keys = list(EN.keys())
    sentences = [EN[k] for k in keys]
    out: dict[str, dict[str, str]] = {}

    for lang, code in TARGETS.items():
        print(f"Translating -> {lang} ({code})...", file=sys.stderr)
        batch = ip.preprocess_batch(sentences, src_lang="eng_Latn", tgt_lang=code)
        inputs = tok(batch, truncation=True, padding="longest", return_tensors="pt", return_attention_mask=True)
        with torch.no_grad():
            gen = model.generate(**inputs, use_cache=True, min_length=0, max_length=256, num_beams=5, num_return_sequences=1)
        decoded = tok.batch_decode(gen, skip_special_tokens=True)
        translations = ip.postprocess_batch(decoded, lang=code)
        out[lang] = {k: t for k, t in zip(keys, translations)}

    json.dump(out, open("scripts/i18n-out.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print("Wrote scripts/i18n-out.json", file=sys.stderr)


if __name__ == "__main__":
    main()
