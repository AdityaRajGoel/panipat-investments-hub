// Pure technical-analysis helpers used by the screener's chart-compare view.
// All functions are side-effect free and operate on plain close-price arrays so
// they can be unit-tested in isolation.

/** Simple Moving Average. Returns an array aligned to `values`; entries before
 *  the first full window are `null`. */
export function sma(values: number[], period: number): (number | null)[] {
  if (period <= 0) return values.map(() => null);
  const out: (number | null)[] = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    out.push(i >= period - 1 ? sum / period : null);
  }
  return out;
}

/** Exponential Moving Average, aligned to `values` (null until seeded). */
export function ema(values: number[], period: number): (number | null)[] {
  if (period <= 0 || values.length === 0) return values.map(() => null);
  const k = 2 / (period + 1);
  const out: (number | null)[] = [];
  let prev: number | null = null;
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) { out.push(null); continue; }
    if (prev === null) {
      // Seed with the SMA of the first `period` values.
      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) sum += values[j];
      prev = sum / period;
    } else {
      prev = values[i] * k + prev * (1 - k);
    }
    out.push(prev);
  }
  return out;
}

/** Wilder's Relative Strength Index (0-100). Returns the latest RSI value, or
 *  null when there isn't enough data. */
export function rsi(values: number[], period = 14): number | null {
  if (values.length <= period) return null;
  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gain += diff; else loss -= diff;
  }
  let avgGain = gain / period;
  let avgLoss = loss / period;
  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    const g = diff >= 0 ? diff : 0;
    const l = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + g) / period;
    avgLoss = (avgLoss * (period - 1) + l) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

/** Rebase a price series to a common base (default 100) so multiple stocks with
 *  very different absolute prices can be overlaid and compared by % move. */
export function rebase(values: number[], base = 100): number[] {
  const first = values.find((v) => v > 0);
  if (!first) return values.map(() => base);
  return values.map((v) => (v / first) * base);
}

/** Total percentage return across a close series (first -> last). */
export function periodReturnPct(values: number[]): number | null {
  const first = values.find((v) => v > 0);
  const last = values[values.length - 1];
  if (first == null || last == null || first === 0) return null;
  return ((last - first) / first) * 100;
}

/** Human label + tone for an RSI reading. */
export function rsiZone(value: number | null): { label: string; tone: "over" | "under" | "neutral" } {
  if (value == null) return { label: "-", tone: "neutral" };
  if (value >= 70) return { label: "Overbought", tone: "over" };
  if (value <= 30) return { label: "Oversold", tone: "under" };
  return { label: "Neutral", tone: "neutral" };
}
