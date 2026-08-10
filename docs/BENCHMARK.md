# Benchmark Report — `indonesian-business-agent-skills`

Metodologi dan hasil pengukuran resmi. **Aturan: tidak ada angka yang ditulis tanpa pernah diukur.** Dokumen ini hanya memuat angka dari run aktual; setiap run baru yang berbeda wajib memperbarui tabel di bawah.

---

## 1. Lingkup Pengukuran

| Lapis | Pertanyaan | Tool |
|---|---|---|
| 1. Deterministic Accuracy | Apakah engine cocok dengan golden corpus? | `scripts/benchmark.js` |
| 2. Determinism | Apakah output identik pada eksekusi berulang? | `scripts/benchmark.js` (3× eksekusi) |
| 3. Performance | Berapa operasi per detik per engine? | `scripts/benchmark.js` |
| 4. LLM Baseline (opsional) | Bagaimana model LLM umum dibandingkan dengan engine? | `scripts/benchmark.js --llm` |

Corpus yang dipakai:
- Golden corpus statis (`tests/golden/`): 6 kasus PPh 21, 3 kasus BPJS, 3 kasus PHK, 11 kasus Finance (8 engine) — batch cepat, deterministik, bebas key.
- Matrix deepen di CI: 425 kasus PPh 21, 225 kasus PHK, 20 asersi integrasi, 12 modul engine (4 statutory + 8 finance), suite keamanan (lihat `npm test`).

Run: `node scripts/benchmark.js [--llm] [--json-report path]`

---

## 2. Hasil Terakhir — Run Deterministik

**Tanggal: 2026-08-10 — Node.js v26.5.1 — `scripts/benchmark.js` v2.0.0 (harness update: domain finance + deep-array match + parser `--json-report` space-tolerant)**

| Engine | Kasus | Akurasi | Determinisme (3×) | Throughput |
|---|---|---|---|---|
| PPh 21 (TER PP 58/2023) | 6 | **100,00%** | OK, identik | 3.907 ops/detik |
| BPJS (Perpres 64/2020 + PP 45/2015) | 3 | **100,00%** | OK, identik | 13.100 ops/detik |
| PHK (PP 35/2021) | 3 | **100,00%** | OK, identik | 22.083 ops/detik |
| Finance (8 engine: BE, DEP, NPV, IRR, LOAN, RAT, WC, EOQ) | 11 | **100,00%** | OK, identik | 6.391 ops/detik |

Catatan metodologi:
- Toleransi numerik 1% atau Rp 1 (mana yang lebih besar) — standar yang lebih longgar daripada toleransi ketat repo (0) di `npm test`.
- `ops/detik` noisy antar run pada mesin yang sama (variasi 3×–5×); hanya bandingkan dalam satu run yang sama. JSON report tiap run menyimpan angka aktual (`--json-report path`).
- Determinism diukur 3× eksekusi per kasus; 0 pelanggaran pada semua domain (termasuk array multibaris seperti jadwal depresiasi, berkat deep-array match).

---

## 3. Perbandingan LLM Baseline (cara menjalankan)

Harness membandingkan engine deterministik vs model LLM umum pada kasus yang sama, dengan prompt natural-language dan toleransi yang sama (1% / Rp 1).

```bash
# OpenAI-compatible endpoint apa pun (termasuk router/agregator)
LLM_BENCH_KEY=sk-... \
LLM_BENCH_BASE=https://api.openai.com/v1 \
LLM_BENCH_MODEL=gpt-4o-mini \
node scripts/benchmark.js --llm --llm-sample 15
```

Prompt yang dipakai (per kasus): deskripsi kasus + input JSON + instruksi "jawab hanya satu baris JSON berisi field: ..." dengan `temperature: 0`. Kegagalan parsing JSON dihitung sebagai kegagalan model.

**Status saat ini**: belum pernah dijalankan dengan key eksternal — tabel di bawah hanya terisi setelah run nyata (no fiction policy).

| Tanggal | Model | Domain | Engine pass | LLM pass | Note |
|---|---|---|---|---|---|
| _(belum ada run)_ | — | — | — | — | Jalankan dengan perintah di atas |

---

## 4. Batas & Non-Claims

- Benchmark ini mengukur **akurasi hitung deterministik**, bukan kualitas drafting/analisis kontrak (di luar lingkup numeric engine).
- Golden corpus run cepat memakai 23 kasus; claim 100% merujuk corpus + matrix deepen CI (±680 kasus) yang dijalankan setiap push.
- Throughput bergantung hardware; hanya bandingkan run pada mesin yang sama.
- Mode LLM tidak dijalankan secara default (butuh key) — angka yang muncul di README/PROVENANCE hanya berasal dari tabel di atas.