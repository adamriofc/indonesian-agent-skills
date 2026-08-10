---
name: Regulatory update / correction
about: Usulkan perubahan regulasi, tarif, batas upah, atau tautan sumber yang rusak/berubah.
title: "[REGULATORY] <judul singkat perubahan>"
labels: ["regulatory", "provenance"]
assignees: ""
---

<!--
PENTING (no-fiction policy):
1. Semua perubahan angka WAJIB menyertakan minimal 1 tautan sumber resmi + 1 sumber pembanding (dual-source).
2. Tautan yang rusak (404/dialihkan) juga diterima dengan bukti status HTTP.
3. Tanpa bukti, issue akan ditandai `needs-evidence` dan tidak diproses.
-->

## 1. Deskripsi Perubahan
Apa yang berubah dan mengapa? (mis. batas upah JP 2027, tarif TER baru, PP baru menggantikan yang lama)

## 2. Dampak pada Ruleset
- [ ] `engines/rules/bpjs.json`
- [ ] `engines/rules/pph21.json`
- [ ] `engines/rules/marketplace.json`
- [ ] Engine JS terkait: _(sebutkan)_
- [ ] `PROVENANCE.md` register

## 3. Bukti Sumber (wajib: minimum 2)
| # | Jenis Sumber | Tautan | Status HTTP (200/404) | Tanggal Cek |
|---|---|---|---|---|
| 1 | Sumber resmi (JDIH / BPK / peraturan.go.id / lembaga) | | | |
| 2 | Sumber pembanding (resmi kedua / SE / berita kredibel) | | | |

## 4. Nilai Baru (bila angka)
| Field | Nilai Lama | Nilai Baru | Efektif Sejak |
|---|---|---|---|
| _contoh: jpCap_ | _10.547.400_ | _11.086.300_ | _2026-03-01_ |

## 5. Link Rusak yang Diganti (bila ada)
| Rule ID | Link Lama (mati) | Pengganti | Status Baru |

## 6. Checklist Sebelum Submit
- [ ] Saya mengecek tautan dengan `curl -A "Mozilla/5.0"` (atau browser untuk situs anti-bot)
- [ ] Angka dikonfirmasi minimal 2 sumber
- [ ] Saya membaca `CONTRIBUTING.md` dan `REGULATORY_PIPELINE.md`