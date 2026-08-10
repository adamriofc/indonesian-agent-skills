# Changelog

All notable changes to this project are documented here in reverse chronological order. Regulatory/statutory changes are additionally tracked per-rule in [REGULATORY_CHANGELOG.md](./REGULATORY_CHANGELOG.md); provenance of every rule in [PROVENANCE.md](./PROVENANCE.md); release cadence in [REGULATORY_PIPELINE.md](./REGULATORY_PIPELINE.md).

## [1.1.0] - 2026-08-10

### Added
- **Release Trust Anchor**: `SHA256SUMS.txt` + `scripts/sha256sums.sh generate|verify`, diverifikasi otomatis di CI setiap push.
- **Benchmark harness**: `scripts/benchmark.js` (deterministic accuracy vs golden corpus, determinism 3×, ops/detik, opsi LLM baseline via OpenAI-compatible endpoint) + `docs/BENCHMARK.md` (no-fiction policy: hanya angka hasil run aktual).
- **PROVENANCE.md diperluas**: kolom Access Path (`DIRECT_DOCUMENT` / `REGISTRY_ENTRY` / `OFFICIAL_PAGE` / `SECONDARY_MIRROR`), section Audit Scope Statement & Non-Claims, dan Provenance Change Log.
- **15 skill terpendek diperkaya** dengan Scope & Safety + Worked Example (script-reels-tiktok, press-release-id, lokalisasi-slang-indonesia, tokopedia-seo-optimizer, linkedin-x-thread-id, spt-tahunan-guide, shopee-live-script, whatsapp-broadcast, buyer-negotiator, shopee-video-creator, bpjs-tenagakerja-admin, klaim-logistik-retur, tiktok-shop-affiliate, interview-id, gmb-local-seo).
- Community files: `CODE_OF_CONDUCT.md`, `.github/ISSUE_TEMPLATE/regulatory-update.md`; GitHub topics (regtech, taxtech, legaltech, dsb.).

### Fixed
- **Link sumber rusak (404)** diganti dengan tautan resmi terverifikasi: UU 7/2021 (JDIH Kemenkeu download → BPK JDIH `Details/185162`), PP 55/2022 (JDIH Kemenkeu download → `jdih.kemenkeu.go.id/dok/pp-55-tahun-2022`).
- **Presisi provenance**: BPJS-KES (portal arsip root → Peraturan.go.id Perpres 64/2020), BPJS-JP-2015 (FAQ root → BPK JDIH PP 45/2015), BPJS-JP-2026 (FAQ root → mirror PDF SE terverifikasi), OSS-PP5 (oss.go.id root → Peraturan.go.id PP 5/2021), PDP (Kominfo timeout → Peraturan.go.id UU 27/2022).
- **README**: quickstart <60 detik, output engine aktual (bukan dugaan), tabel compatibility + kolom Verification Method & Last Verified, klaim "synced via Cloud API" dihapus (jujur: schema-validated, bukan E2E cloud).

### Changed
- `engines/rules/bpjs.json`: source URL eksak per ruleset (BPJS-2015, BPJS-2025, BPJS-2026); checksum `integrity.js` diperbarui.
- CI: langkah `sha256sums.sh verify` sebelum `npm test`.

### Benchmark (run aktual 2026-08-10)
- Akurasi golden corpus: PPh 21 100%, BPJS 100%, PHK 100% — determinisme 3× OK; throughput 17.373 / 1.921 / 16.450 ops/detik (Node v26.5.1).

## [1.0.0] - 2026-08-10

### Added
- 42 enterprise skills across 5 domain plugins, all carrying `risk_level` and `rule_type` frontmatter metadata.
- 8 deterministic calculation engines (PPh21, BPJS, THR, PHK, PPh23/26, UMKM final tax, marketplace fee, PKWT compensation).
- SSOT temporal rulesets with lifecycle status (`engines/rules/pph21.json`, `bpjs.json`); SHA-256 integrity checksums regenerated for lifecycle-enriched rulesets.
- Trust Envelope (confidence contract) appended to 8 flagship engine-driven skills.
- `REGULATORY_PIPELINE.md` operational procedure, granular provenance register with direct source URLs & article citations, community governance docs (`CONTRIBUTING.md`, `ROADMAP.md`).
- Deepened unit test coverage: boundary, negative, rounding, fallback and determinism assertions across the 4 newer engines.

### Changed
- Ruleset lifecycle fields (`status`, `verified_at`, `verified_by`, `review_interval_months`, `superseded_by`) added to every ruleset entry; `source.article` populated for gazette-level tracing.
- `tests/units/new-engines.test.js` replaced with an expanded 4-module boundary/matrix suite.

### Security
- Runtime integrity verifier unchanged; checksums updated to match lifecycle-enriched rulesets (any ruleset mutation outside the pipeline is detected at load time).