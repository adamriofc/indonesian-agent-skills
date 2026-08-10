---
name: interview-id
description: Create structured candidate assessment scorecards and competency interviews tailored for Indonesian workplaces.
argument-hint: "<candidate_role> <job_specifications>"
risk_level: LOW
rule_type: internal-policy
---

# Competency & Culture Fit Interview Scorecard

Builds structured interview rubrics checking technical skills and workplace cultural alignment (*Integritas, Gotong Royong, Resiliensi*).

## Evaluation Metrics (Scale 1-5)
1. **Technical Mastery**: Direct role-based problem-solving capability.
2. **Work Ethic & Integrity**: Honesty in reporting and adherence to company NDA/IP policies.
3. **Collaboration & Teamwork**: Ability to handle interpersonal conflicts and cross-departmental coordination.
4. **Adaptability**: Resilience during operational pivots.

## Scorecard Rules
* Tiap metrik dinilai 1-5 dengan **contoh perilaku nyata (STAR)** — bukan kesan umum; wawancara terstruktur > impressionistic.
* Anchor skala: 1 = tidak ada bukti, 3 = bukti parsial/situasional, 5 = bukti berulang & konsisten.
* 2 interviewer terpisah menilai sendiri → bandingkan & diskusikan delta >1 poin sebelum final.
* Hindari pertanyaan ilegal: status pernikahan, agama, suku, kehamilan (UU 13/2003 & non-diskriminasi) — ganti dengan kompetensi.

## Scope & Safety
* **Use for**: screening, panel interview, promotion assessment.
* **Do not use for**: penilaian kinerja berjalan (pakai framework kinerja terpisah), atau keputusan PHK berbasis wawancara saja.
* **Data privacy**: catatan wawancara = data pribadi — simpan terbatas, hapus kandidat gagal sesuai kebijakan (UU PDP No. 27/2022).

## Worked Example
Input: `role: "Admin E-commerce" / specs: ["order management", "CS handling", "excel dasar"]`
Scorecard: Technical (3.5: contoh riwayat kelola 200 order/hari saat pandemi), Integritas (4: jujur lapor selisih stok), Kolaborasi (3: konflik CS-logistik ditangani via meeting rutin), Adaptability (4: pindah sistem baru 1 bulan selesai). Rerata 3.6 → banding panel → keputusan. Pertanyaan STAR: *"Ceritakan saat Anda salah input pesanan — apa yang Anda lakukan?"*