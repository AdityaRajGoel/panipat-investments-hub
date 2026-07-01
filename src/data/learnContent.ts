// Original, India-specific educational content for the Learning Center.
// Each entry renders at /learn/:slug as a full, indexable article.
// NOTE: This is factual finance-education content - review for accuracy
// before major edits. It is not investment advice or stock recommendations.

export type LearnArticle = {
  slug: string;
  title: string;               // <title> / H1
  metaDescription: string;     // 150-160 chars
  category: "basics" | "trading" | "analysis" | "investing";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readTime: number;            // minutes
  updated: string;             // ISO date
  keyTakeaways: string[];
  related: string[];           // slugs
  content: string;             // markdown
};

export const LEARN_ARTICLES: Record<string, LearnArticle> = {
  "demat-account": {
    slug: "demat-account",
    title: "What is a Demat Account? A Beginner's Guide for Indian Investors",
    metaDescription:
      "A Demat account holds your shares electronically. Learn how it works, documents needed, charges, and how to open a free Demat account in India in 2026.",
    category: "basics",
    difficulty: "Beginner",
    readTime: 6,
    updated: "2026-07-01",
    keyTakeaways: [
      "A Demat account holds your shares and securities in electronic form - no paper certificates.",
      "It works alongside a trading account: the trading account places orders, the Demat account stores what you buy.",
      "In India, Demat accounts are held with CDSL or NSDL through a SEBI-registered broker (Depository Participant).",
      "Opening is fully online with PAN, Aadhaar, a bank proof and a photo - and is free at Parasram India.",
    ],
    related: ["mutual-funds-guide", "ipo-guide", "power-of-compounding"],
    content: `## What is a Demat account?

A **Demat account** (short for "dematerialised account") holds the shares, bonds, mutual funds, ETFs and other securities you own in **electronic form**. Before 1996, Indian investors received physical share certificates on paper - slow to transfer, easy to lose, and prone to forgery. Today, everything sits safely in your Demat account, just like money sits in your bank account.

## Demat vs. trading account - what's the difference?

New investors often confuse the two. You need **both**, and they work together:

| Account | What it does |
|---------|--------------|
| **Trading account** | Places buy/sell orders on the NSE and BSE |
| **Demat account** | Stores the shares you actually own |
| **Bank account** | Funds the trades and receives your money |

When you buy 10 shares of a company, your trading account executes the order and those 10 shares are **credited to your Demat account** two working days later (the T+1/T+2 settlement cycle).

## Who holds your Demat account in India?

There are two central depositories in India - **CDSL** and **NSDL** - that actually maintain the electronic records. You don't deal with them directly. Instead you open your account through a **Depository Participant (DP)** - a SEBI-registered broker like Parasram India that acts as the bridge between you and the depository.

## Documents you need to open a Demat account

- **PAN card** (mandatory)
- **Aadhaar card** (for e-KYC and mobile OTP verification)
- **Bank proof** - a cancelled cheque or recent bank statement
- **A passport-size photograph**
- **Signature** on white paper (for online KYC)

## How to open a Demat account (step by step)

1. **Fill the online form** with your name, mobile and email.
2. **Complete KYC** - upload PAN, Aadhaar and bank proof; verify via Aadhaar OTP.
3. **In-person verification (IPV)** - a short video step, done online.
4. **e-Sign** the agreement using your Aadhaar-linked mobile.
5. **Account activated** - usually within 1–2 working days.

## What charges should you know about?

- **Account opening fee** - ₹0 at Parasram India.
- **Annual Maintenance Charge (AMC)** - a small yearly fee to maintain the account.
- **Brokerage** - charged per trade (use a [brokerage calculator](/brokerage-calculator) to estimate it).
- **DP charges** - a small fee when you sell shares.

## Why a Demat account matters

Without a Demat account you simply cannot buy or hold shares, apply for IPOs, or invest in most mutual funds and bonds in India. It is the foundation of your entire investment journey - secure, paperless, and instantly accessible from your phone.

> Ready to start? You can [open a free Demat account with Parasram India](/open-account) - SEBI-registered since 1970, with a real branch in Panipat for in-person help.`,
  },

  "pe-ratio": {
    slug: "pe-ratio",
    title: "P/E Ratio Explained: How to Tell if a Stock is Cheap or Expensive",
    metaDescription:
      "The P/E ratio is the most-used stock valuation metric. Learn how to calculate it, what a good P/E is, its limits, and how Indian investors use it wisely.",
    category: "analysis",
    difficulty: "Beginner",
    readTime: 7,
    updated: "2026-07-01",
    keyTakeaways: [
      "P/E ratio = Share Price ÷ Earnings Per Share (EPS). It shows how much you pay for ₹1 of profit.",
      "A high P/E can mean an expensive stock or high growth expectations; a low P/E can mean value or hidden problems.",
      "Always compare a company's P/E to its own history and to its sector peers - never in isolation.",
      "P/E is useless for loss-making companies and can be distorted by one-off profits.",
    ],
    related: ["financial-statements", "fundamental-vs-technical", "mutual-funds-guide"],
    content: `## What is the P/E ratio?

The **Price-to-Earnings (P/E) ratio** is the single most popular way to judge whether a stock is cheaply or expensively priced. It answers a simple question: *how many rupees am I paying for every ₹1 of the company's annual profit?*

## The formula

$$P/E = \\frac{\\text{Market Price per Share}}{\\text{Earnings per Share (EPS)}}$$

For example, if a stock trades at **₹500** and its EPS is **₹25**, the P/E is:

\`\`\`
₹500 ÷ ₹25 = 20
\`\`\`

A P/E of **20** means investors are willing to pay ₹20 today for every ₹1 the company earns in a year.

## What is a "good" P/E ratio?

There's no universal magic number - it depends entirely on context:

| P/E range | Often signals |
|-----------|---------------|
| Below 15 | Potentially undervalued - or a struggling business |
| 15–25 | Fairly valued for a stable Indian large-cap |
| Above 30 | High growth expectations - or overvaluation |

A fast-growing IT or FMCG company routinely trades at a P/E of 40+, while a mature PSU bank might sit below 10. **Comparing an IT stock's P/E to a bank's tells you nothing** - you must compare like with like.

## Two ways to use P/E correctly

1. **Against its own history** - if a company usually trades at a P/E of 18 but is now at 28, ask *why*. Has growth accelerated, or is it just hype?
2. **Against sector peers** - a bank at a P/E of 12 when its peers average 18 may be a bargain (or may have a bad loan book).

## The limits of P/E - read this before you rely on it

- **Loss-making companies** have no meaningful P/E (you can't divide by negative or zero earnings).
- **One-off gains** - a company that sold a building this year shows inflated earnings and a misleadingly low P/E.
- **Debt is invisible** - two companies with the same P/E can have wildly different debt levels.
- **It's backward-looking** - trailing P/E uses last year's profit, which may not repeat.

This is why seasoned investors pair P/E with other metrics like **ROE**, **debt-to-equity**, and the **PEG ratio** (P/E adjusted for growth).

## The bottom line

The P/E ratio is a brilliant *first filter*, not a *final verdict*. Use it to shortlist stocks, then dig into the [financial statements](/learn/financial-statements) and business quality before investing.

> Want to screen Indian stocks by P/E instantly? Try the free [Parasram Stock Screener](/screener) with live NSE/BSE data.`,
  },

  "sip-vs-lumpsum": {
    slug: "sip-vs-lumpsum",
    title: "SIP vs Lumpsum: Which Investment Strategy Actually Wins?",
    metaDescription:
      "Should you invest via SIP or a one-time lumpsum? Compare rupee-cost averaging, risk, and returns across market cycles to choose the right strategy in India.",
    category: "investing",
    difficulty: "Beginner",
    readTime: 8,
    updated: "2026-07-01",
    keyTakeaways: [
      "A SIP invests a fixed amount at regular intervals; a lumpsum invests the whole amount at once.",
      "SIPs use rupee-cost averaging to reduce the risk of bad timing - ideal for salaried investors.",
      "Lumpsum can outperform when markets are near a bottom, but requires a large idle corpus and strong nerves.",
      "For most Indian investors building wealth from monthly income, a disciplined SIP wins on consistency.",
    ],
    related: ["mutual-funds-guide", "power-of-compounding", "portfolio-diversification"],
    content: `## Two ways to invest the same money

Say you have **₹1,20,000** to invest in a mutual fund this year. You have two choices:

- **Lumpsum** - invest the entire ₹1,20,000 today, in one go.
- **SIP (Systematic Investment Plan)** - invest **₹10,000 every month** for 12 months.

Both are valid. Which is better depends on market conditions and - more importantly - on *you*.

## How a SIP reduces timing risk

The magic of a SIP is **rupee-cost averaging**. Because you invest a fixed rupee amount each month, you automatically buy **more units when prices are low** and **fewer units when prices are high**:

| Month | NAV | ₹10,000 buys |
|-------|-----|--------------|
| Jan | ₹100 | 100 units |
| Feb (dip) | ₹80 | 125 units |
| Mar (rally) | ₹125 | 80 units |

Over time, your average purchase price smooths out - you never bet everything on a single day's price. This is why SIPs suit **salaried investors** who invest from monthly income and can't predict market tops or bottoms.

## When lumpsum wins

Lumpsum investing puts your full corpus to work immediately, so it captures more upside **when markets rise steadily** from the moment you invest. Historically, because markets rise more often than they fall, lumpsum *can* beat SIP over long periods - **if** you invest near a low and don't panic during dips.

The catch: lumpsum requires (a) a large amount of idle money and (b) the emotional discipline to stay invested when the market drops 20% right after you buy. Few investors have both.

## A simple decision framework

- **You earn a monthly salary** → SIP. It matches your cash flow and builds discipline.
- **You received a bonus, maturity, or windfall** → consider a **staggered lumpsum** (a "STP") - park it in a liquid fund and move it into equity over 3–6 months.
- **Markets have just crashed and you have cash** → a lumpsum can be powerful, but only invest money you won't need for 5+ years.

## The real winner: consistency

The most important factor isn't SIP vs lumpsum - it's **staying invested for the long term**. A SIP wins for most people simply because it removes emotion and keeps you investing through every market mood. Combined with the [power of compounding](/learn/power-of-compounding), a modest monthly SIP can grow into a substantial corpus over 15–20 years.

> Start a SIP from as little as ₹500/month. [Talk to Parasram India](/contact) or [open a free account](/open-account) to begin.`,
  },

  "power-of-compounding": {
    slug: "power-of-compounding",
    title: "The Power of Compounding: Why Starting Early Beats Investing More",
    metaDescription:
      "Compounding turns small, regular investments into large sums over time. Learn how it works, the Rule of 72, and why starting early matters most in India.",
    category: "investing",
    difficulty: "Beginner",
    readTime: 5,
    updated: "2026-07-01",
    keyTakeaways: [
      "Compounding means your returns start earning their own returns - growth accelerates over time.",
      "Time in the market matters more than the amount: starting 10 years earlier can double your final corpus.",
      "The Rule of 72 estimates how long money takes to double: 72 ÷ annual return %.",
      "Small monthly SIPs, left untouched for decades, can grow into crores.",
    ],
    related: ["sip-vs-lumpsum", "mutual-funds-guide", "portfolio-diversification"],
    content: `## What is compounding?

Albert Einstein reportedly called compound interest the *"eighth wonder of the world."* Whether or not he said it, the idea is powerful: **compounding is when your investment returns start generating their own returns.**

In year one you earn a return on your money. In year two you earn a return on your *original money plus year one's return*. Repeat for 20–30 years and the growth becomes exponential, not linear.

## A simple example

Invest **₹1,00,000** at a 12% annual return:

| Years | Value |
|-------|-------|
| 5 | ₹1.76 lakh |
| 10 | ₹3.11 lakh |
| 20 | ₹9.65 lakh |
| 30 | ₹29.96 lakh |

Notice how the money barely triples in the first 10 years - but grows nearly **10×** over 30 years. The last decade does the heaviest lifting. **That's why starting early is everything.**

## Starting early vs. investing more

Consider two investors:

- **Priya** starts at age 25, invests ₹5,000/month for 10 years, then stops.
- **Rahul** starts at age 35, invests ₹5,000/month for 25 years.

Even though Rahul invests **more than twice as much money over more years**, Priya often ends up with a comparable or larger corpus at 60 - purely because her money had an extra decade to compound. **Time beats amount.**

## The Rule of 72

Want a quick estimate of how long your money takes to **double**? Divide 72 by your expected annual return:

\`\`\`
72 ÷ 12% = 6 years to double
72 ÷ 8%  = 9 years to double
\`\`\`

At a 12% return, ₹1 lakh becomes ₹2 lakh in 6 years, ₹4 lakh in 12 years, ₹8 lakh in 18 years - without adding a single rupee.

## How to put compounding to work

1. **Start now** - even a small amount today beats a large amount later.
2. **Stay invested** - every withdrawal resets the compounding clock.
3. **Reinvest returns** - choose growth options over dividend payouts.
4. **Be patient** - the biggest gains come in the final years.

> A disciplined [monthly SIP](/learn/sip-vs-lumpsum) is the easiest way for most Indians to harness compounding. [Get started with Parasram India](/open-account).`,
  },

  "mutual-funds-guide": {
    slug: "mutual-funds-guide",
    title: "Mutual Funds Explained: Types, Benefits & How to Invest in India",
    metaDescription:
      "A complete beginner's guide to mutual funds in India - equity, debt, hybrid and index funds, NAV, expense ratio, SEBI categories, and how to start investing.",
    category: "basics",
    difficulty: "Beginner",
    readTime: 8,
    updated: "2026-07-01",
    keyTakeaways: [
      "A mutual fund pools money from many investors and a professional manager invests it in stocks, bonds or both.",
      "Main types: equity (growth), debt (stability), hybrid (mix) and index funds (low-cost, passive).",
      "NAV is the per-unit price; expense ratio is the annual fee - lower is better for long-term returns.",
      "Direct plans have lower fees than regular plans because they skip distributor commission.",
    ],
    related: ["sip-vs-lumpsum", "index-vs-active", "power-of-compounding"],
    content: `## What is a mutual fund?

A **mutual fund** pools money from thousands of investors and hands it to a professional **fund manager**, who invests it across a basket of stocks, bonds or other assets. When you buy a mutual fund, you own a small slice of that entire basket - instant diversification, even with just ₹500.

It's the simplest way for a beginner to invest in the market **without picking individual stocks**.

## The main types of mutual funds

| Type | Invests in | Best for |
|------|-----------|----------|
| **Equity funds** | Company shares | Long-term growth (5+ years) |
| **Debt funds** | Bonds, government securities | Stability, lower risk |
| **Hybrid funds** | Mix of equity + debt | Balanced, moderate risk |
| **Index funds** | Copy an index (e.g. Nifty 50) | Low-cost passive investing |

**Equity funds** carry the most risk but the highest long-term return potential. **Debt funds** are steadier and suit short-term goals. **Hybrid funds** balance the two. **Index funds** simply mirror an index like the Nifty 50 at very low cost - a great default for beginners.

## Key terms every investor must know

- **NAV (Net Asset Value)** - the per-unit price of the fund, updated daily. Buying at ₹100 NAV gets you 10 units for ₹1,000.
- **Expense ratio** - the annual fee the fund charges, as a % of your investment. A 0.5% ratio is excellent; 2%+ eats into long-term returns significantly.
- **AUM (Assets Under Management)** - the total money the fund manages.
- **Exit load** - a small penalty for withdrawing too soon (often within a year).

## Direct vs. regular plans - an easy way to earn more

Every mutual fund comes in two versions:

- **Regular plan** - includes a distributor's commission in the expense ratio.
- **Direct plan** - you invest directly, skipping the commission, so the expense ratio is lower.

Over 15–20 years, that seemingly small fee difference can add up to **lakhs of rupees** thanks to compounding. Direct plans are worth it if you're comfortable choosing funds yourself.

## How SEBI protects you

The Securities and Exchange Board of India (**SEBI**) strictly regulates every mutual fund - standardising categories, mandating disclosures, and capping fees. This makes Indian mutual funds one of the safest, most transparent ways to invest.

## How to start investing in mutual funds

1. **Complete your KYC** (one-time, via PAN + Aadhaar).
2. **Pick a fund** that matches your goal and risk appetite.
3. **Choose SIP or lumpsum** - a [monthly SIP](/learn/sip-vs-lumpsum) suits most beginners.
4. **Stay invested** and review once or twice a year.

> Parasram India offers direct and regular mutual funds with SIPs from ₹500/month. [Open a free account](/open-account) or [explore our services](/services).`,
  },

  "ipo-guide": {
    slug: "ipo-guide",
    title: "IPO Guide for Beginners: Process, Allotment & Listing in India",
    metaDescription:
      "Understand how IPOs work in India - DRHP, price bands, lot size, ASBA/UPI application, GMP, allotment and listing day. A clear beginner's guide for 2026.",
    category: "basics",
    difficulty: "Beginner",
    readTime: 9,
    updated: "2026-07-01",
    keyTakeaways: [
      "An IPO is when a private company sells shares to the public and lists on the NSE/BSE for the first time.",
      "You apply through your bank's ASBA/UPI - money is only blocked, not debited, until shares are allotted.",
      "Applications are in lots; oversubscribed IPOs allot via a lottery, so you may get partial or no allotment.",
      "Grey Market Premium (GMP) is an unofficial signal of demand - informative but never a guarantee.",
    ],
    related: ["demat-account", "mutual-funds-guide", "fundamental-vs-technical"],
    content: `## What is an IPO?

An **IPO (Initial Public Offering)** is the moment a private company offers its shares to the general public for the first time and gets **listed on a stock exchange** like the NSE or BSE. The company raises money to grow, and everyday investors get a chance to own a piece of it.

## The IPO journey - from filing to listing

1. **DRHP** - the company files a *Draft Red Herring Prospectus* with SEBI, disclosing its financials, risks and how it will use the money.
2. **Price band** - a range is announced (e.g. ₹100–₹105 per share). You bid within this band.
3. **Subscription window** - the IPO is open for applications, usually for **3 working days**.
4. **Allotment** - shares are allocated. If demand exceeds supply, a computerised **lottery** decides who gets them.
5. **Listing** - the stock debuts on the exchange and starts trading freely.

## Key terms you'll encounter

- **Lot size** - you can't buy a single share in an IPO; you apply in fixed *lots* (e.g. 1 lot = 100 shares).
- **ASBA / UPI** - the application method where your money is **blocked** in your bank account, not debited. It's only taken if you actually get shares.
- **GMP (Grey Market Premium)** - an unofficial, unregulated indicator of demand before listing. Useful as a *sentiment gauge*, never a promise.
- **Cut-off price** - retail investors can select this to automatically bid at the final decided price.

## How to apply for an IPO (step by step)

1. Ensure you have an active **Demat + trading account** ([here's how to open one](/learn/demat-account)).
2. Open the IPO in your broker's app or your bank's net-banking.
3. Enter the **number of lots** and your **UPI ID** (or select ASBA).
4. **Approve the mandate** on your UPI app - the amount is blocked.
5. Wait for allotment. If allotted, shares appear in your Demat account before listing day.

## Understanding allotment

When an IPO is **oversubscribed** (more applications than shares), retail investors are allotted through a lottery - you might get one lot, or none at all. Applying for more lots does **not** improve your odds in the retail category beyond a point, so bid sensibly.

## Should you invest in every IPO?

No. A listing "pop" is never guaranteed - many IPOs list flat or below their issue price. Treat an IPO like any other investment: read the DRHP, understand the business, check the valuation ([P/E ratio](/learn/pe-ratio)), and only apply if the company looks genuinely worth owning.

> Parasram India helps you apply for IPOs seamlessly via UPI/ASBA. [Open a free Demat account](/open-account) to get started, or [see our services](/services).`,
  },
};

export const LEARN_SLUGS = Object.keys(LEARN_ARTICLES);
