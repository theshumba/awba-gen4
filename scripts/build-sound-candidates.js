#!/usr/bin/env node
/* ============================================================================================
   build-sound-candidates.js  ·  Awba Gen-4 v2.2 (E3) — the sound AUDITION kit generator
   --------------------------------------------------------------------------------------------
   Synthesizes the 9 candidate cue WAVs (3 families × correct/incorrect/complete) into
   docs/sound-audition/ for the owner to audition via docs/sound-audition.html. CANDIDATES
   ONLY — nothing is wired; the app stays silent (D-52 remains owner-gated) and shared/sfx
   does not exist until a family is chosen.

   Laws (DESIGN-V2.2 E3):
     - zero dependencies (Node core fs/path only); 16-bit PCM, mono, 44.1 kHz,
     - DETERMINISTIC — pure sample math, no entropy, no clock (the provenance stamp is a
       passed-in constant: --date=YYYY-MM-DD, default 2026-07-16),
     - single dignified sound events — never melodies, never chimes-as-music, never a fanfare,
     - correct ≤180 ms · incorrect ≤140 ms AND quieter + lower (a soft downward acknowledgement,
       not a buzzer) · complete ≤350 ms (a touch fuller, still one event),
     - normalized LOW: peak ≤ -12 dBFS (≈0.251); incorrect quieter still (≈ -16 dBFS, ≈0.158),
     - a tiny linear fade-in/out (~3 ms) kills click/pop at the edges; no clipping, ever.

   Run:  node scripts/build-sound-candidates.js            → writes docs/sound-audition/*.wav
   ============================================================================================ */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const SR = 44100;                                    // sample rate, Hz
const OUT_DIR = path.join(__dirname, '..', 'docs', 'sound-audition');
const dateArg = process.argv.find((a) => a.startsWith('--date='));
const STAMP = dateArg ? dateArg.slice('--date='.length) : '2026-07-16';   // provenance constant — never a clock

/* ---- synthesis: a sum of decaying sine partials, each with an optional downward pitch glide.
   Phase accumulates per-sample so a glide never clicks. Pure math — same input, byte-identical
   output. ---- */
function synth(durSec, partials) {
  const n = Math.round(durSec * SR);
  const out = new Float64Array(n);
  for (const p of partials) {
    let phase = 0;
    const f1 = (p.glideTo != null) ? p.glideTo : p.freq;
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      const f = p.freq + (f1 - p.freq) * (t / durSec);   // linear glide (or flat when glideTo absent)
      phase += (2 * Math.PI * f) / SR;
      out[i] += p.amp * Math.exp(-t / p.tau) * Math.sin(phase);
    }
  }
  return out;
}

/* ---- a tiny linear fade at both edges (~3 ms) — removes click/pop ---- */
function fadeEdges(samples, ms) {
  const k = Math.min(Math.round((ms / 1000) * SR), Math.floor(samples.length / 2));
  for (let i = 0; i < k; i++) {
    const g = i / k;
    samples[i] *= g;
    samples[samples.length - 1 - i] *= g;
  }
  return samples;
}

/* ---- normalize so the PEAK sits exactly at the target magnitude (≤ -12 dBFS by law) ---- */
function normalizeTo(samples, peakTarget) {
  let peak = 0;
  for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]));
  if (peak > 0) {
    const g = peakTarget / peak;
    for (let i = 0; i < samples.length; i++) samples[i] *= g;
  }
  return samples;
}

/* ---- 44-byte canonical RIFF/WAVE header + little-endian int16 samples ---- */
function toWav(samples) {
  const dataLen = samples.length * 2;
  const buf = Buffer.alloc(44 + dataLen);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataLen, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);                 // fmt chunk size
  buf.writeUInt16LE(1, 20);                  // PCM
  buf.writeUInt16LE(1, 22);                  // mono
  buf.writeUInt32LE(SR, 24);                 // sample rate
  buf.writeUInt32LE(SR * 2, 28);             // byte rate (SR × blockAlign)
  buf.writeUInt16LE(2, 32);                  // block align (1 ch × 16 bit)
  buf.writeUInt16LE(16, 34);                 // bits per sample
  buf.write('data', 36);
  buf.writeUInt32LE(dataLen, 40);
  for (let i = 0; i < samples.length; i++) {
    const f = Math.max(-1, Math.min(1, samples[i]));   // clamp — no clipping, ever
    buf.writeInt16LE(Math.round(f * 32767), 44 + i * 2);
  }
  return buf;
}

/* ---- the three families × three cues. Fixed partial sets, frequencies and decay constants —
   deterministic by construction. `incorrect` is LOWER (pitch) per family and lands on the
   quieter -16 dBFS peak; `complete` is the correct note with one low partial and a longer
   tail — a single fuller event, never a rising jingle. ---- */
const PEAK_STD = 0.251;      // ≈ -12 dBFS
const PEAK_SOFT = 0.158;     // ≈ -16 dBFS — incorrect is quieter by law

const CUES = [
  /* wood — a soft wooden tap: dry, close, unhurried */
  { name: 'wood-correct',   dur: 0.18, peak: PEAK_STD,  partials: [
    { freq: 260, amp: 1, tau: 0.045 }, { freq: 520, amp: 0.18, tau: 0.030 } ] },
  { name: 'wood-incorrect', dur: 0.14, peak: PEAK_SOFT, partials: [
    { freq: 180, amp: 1, tau: 0.035 }, { freq: 360, amp: 0.12, tau: 0.025 } ] },
  { name: 'wood-complete',  dur: 0.32, peak: PEAK_STD,  partials: [
    { freq: 260, amp: 1, tau: 0.090 }, { freq: 130, amp: 0.50, tau: 0.110 }, { freq: 520, amp: 0.12, tau: 0.040 } ] },

  /* string — a single muted pluck: warm, human, one note only */
  { name: 'string-correct',   dur: 0.18, peak: PEAK_STD,  partials: [
    { freq: 220, amp: 1, tau: 0.070 }, { freq: 440, amp: 0.50, tau: 0.055 }, { freq: 880, amp: 0.25, tau: 0.040 } ] },
  { name: 'string-incorrect', dur: 0.14, peak: PEAK_SOFT, partials: [
    { freq: 165, amp: 1, tau: 0.045 }, { freq: 330, amp: 0.30, tau: 0.035 } ] },
  { name: 'string-complete',  dur: 0.35, peak: PEAK_STD,  partials: [
    { freq: 220, amp: 1, tau: 0.120 }, { freq: 110, amp: 0.45, tau: 0.140 }, { freq: 440, amp: 0.35, tau: 0.080 } ] },

  /* thump — a low warm body: felt more than heard, the quietest-feeling of the three */
  { name: 'thump-correct',   dur: 0.16, peak: PEAK_STD,  partials: [
    { freq: 140, glideTo: 100, amp: 1, tau: 0.050 } ] },
  { name: 'thump-incorrect', dur: 0.13, peak: PEAK_SOFT, partials: [
    { freq: 105, glideTo: 78,  amp: 1, tau: 0.035 } ] },
  { name: 'thump-complete',  dur: 0.32, peak: PEAK_STD,  partials: [
    { freq: 135, glideTo: 100, amp: 1, tau: 0.110 }, { freq: 270, glideTo: 200, amp: 0.12, tau: 0.050 } ] },
];

fs.mkdirSync(OUT_DIR, { recursive: true });
let failures = 0;
for (const cue of CUES) {
  const samples = normalizeTo(fadeEdges(synth(cue.dur, cue.partials), 3), cue.peak);
  const wav = toWav(samples);
  const file = path.join(OUT_DIR, cue.name + '.wav');
  fs.writeFileSync(file, wav);

  // honest self-report: real duration + real peak, re-measured from the written samples
  let peak = 0;
  for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]));
  const dbfs = (20 * Math.log10(peak)).toFixed(1);
  const ms = Math.round((samples.length / SR) * 1000);
  const kind = cue.name.split('-')[1];
  const limit = kind === 'correct' ? 180 : kind === 'incorrect' ? 140 : 350;
  const ok = ms <= limit && peak <= 0.2512;
  if (!ok) failures++;
  console.log(`${ok ? 'OK ' : 'FAIL'} ${cue.name.padEnd(17)} ${String(ms).padStart(3)} ms (≤${limit})  peak ${dbfs} dBFS  ${(wav.length / 1024).toFixed(1)} KB`);
}
console.log(`\n${CUES.length} candidate cues written to docs/sound-audition/ · stamped ${STAMP}`);
console.log('CANDIDATES ONLY — nothing is wired; the app stays silent until the owner picks a family.');
if (failures) { console.error(`\n${failures} cue(s) broke a timing/loudness law`); process.exit(1); }
