# oolong.github.io
Website template based on the [NoCha](novelchallenge.github.io) website


## Results data

The root `synth_results.csv` and `real_results.csv` are copied verbatim from
`resources/plots/` in the October 5, 2026 Oolong LaTeX export
(`dmtjptjszkkqjhgqjhvpbxzqwbnbccqd.zip`). The active page uses these files for
both its leaderboard and plots; `oolong_plotly_website/` is a separate legacy
prototype and is not loaded by `index.html`.

`leaderboard.js` explicitly lists the 20 models in the paper's
`resources/tables/leaderboard.tex`, excluding ablations and synth-only rows.
Synth scores average the 8192, 16384, 32768, 65536, and 131072 columns; real
scores average 55124, 118711, and 175571. Unsupported lengths count as zero,
with affected averages marked †. Overall averages the two unrounded split
scores; rounding to two decimals happens only for display. Plot scores stay
on the source 0–1 scale and omit unsupported lengths.

Llama display names follow the paper's leaderboard (Llama-3-3B and Llama-3-8B);
the paper's plot labels use inconsistent version names, so no more specific
checkpoint version is inferred here.
