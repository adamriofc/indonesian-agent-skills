---
name: press-release-id
description: Write professional corporate press releases matching standard Indonesian journalistic styles (5W+1H).
argument-hint: "<corporate_event_announcement> <quotes_from_key_executives>"
risk_level: LOW
rule_type: commercial
---

# Indonesian Press Release Generator

Drafts press releases formatted for immediate pickup by Indonesian media portals (Detik, Kompas, Bisnis Indonesia).

## 5W+1H Structure (lead-first, inverted pyramid)
1. **Headline** (max 12 words): Action verb + company + outcome; no clickbait.
2. **Lead paragraph**: What + Who + When + Where in 2 sentences; city of dateline (e.g. *JAKARTA, 10 Agustus 2026 —*).
3. **Body**: Why (context/background) + How (mechanism) — max 3 paragraphs.
4. **Executive quote**: 2-3 sentences, attributable to named role, not anonymous.
5. **Boilerplate**: Company description (2 sentences) + contact person, email, phone.

## Scope & Safety
* **Use for**: product launches, expansions, partnerships, awards, funding.
* **Do not use for**: financial guidance that could trigger market abuse — coordinate with compliance officer; statements affecting share price (emiten) require press release via exchange rules (OJK) first.
* **Claims discipline**: every number/claim must be verifiable; never extrapolate market size without citing the source.

## Worked Example
Input: `event: "PT Sejahtera buka cabang ke-10 di Surabaya" / quote: "komitmen layanan Indonesia Timur"`
Output: Headline: *"PT Sejahtera Resmikan Cabang ke-10 di Surabaya, Perkuat Layanan Indonesia Timur"* — Lead: *"SURABAYA, 10 Agustus 2026 — PT Sejahtera meresmikan cabang ke-10 di Surabaya, menandai komitmen ekspansi ke Indonesia Timur."* — Quote: *"Ini bentuk komitmen kami melayani pelanggan di Indonesia Timur," ujar Direktur Operasional.*