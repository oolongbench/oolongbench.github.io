# OOLONG Benchmark Plots - Comparison with Original

## Summary

Successfully reproduced the core plots from the OOLONG benchmark paper using Plotly. The interactive HTML visualizations closely match the original LaTeX/TikZ figures while adding interactive features.

## Visual Comparison

### Main Results Plot: `oolong_results.html`

**Original Paper Features:**
- Side-by-side subplots (OOLONG-synth and OOLONG-real)
- Log-scale x-axis with context lengths (8K to 512K)
- Linear y-axis showing scores (0 to 1)
- Multiple model performance curves with distinct colors
- Colorblind-friendly palette
- Random baseline shown as dashed line

**Our Plotly Reproduction:**
✅ **Matches all original features**
✅ **Additional interactive features:**
- Hover tooltips showing exact values
- Click legend to show/hide specific models
- Zoom and pan capabilities
- Download as PNG option
- Unified hover mode across both subplots

**Key Visual Elements Preserved:**
1. **Left Panel (OOLONG-synth):**
   - Shows performance from 8K to 512K tokens
   - All 10 models correctly plotted
   - Performance degradation clearly visible as context length increases
   - Random baseline correctly shown as dashed line

2. **Right Panel (OOLONG-real):**
   - Shows performance from ~32K to 512K tokens (real data range)
   - 9 models plotted (no random baseline in real data)
   - Steeper performance degradation than synthetic tasks
   - Y-axis labels on the right side

3. **Color Scheme:**
   - Yellow/Orange (#E69F00): Gemini models
   - Blue (#56B4E9): GPT-5 family
   - Orange (#D55E00): O-series models
   - Green (#009E73): Claude models
   - Purple (#CC79A7): Llama models
   - Red (#E51E00): DeepSeek models
   - Black: Random baseline (dashed)

4. **Markers:**
   - Circle: Base models (gpt-5-nano, o4-mini, etc.)
   - X: Mini variants (gpt-5-mini, o3)
   - Cross: Full/flagship models (gpt-5)

### Task Analysis Plot: `oolong_task_analysis.html`

**Original Paper Features:**
- Grouped bar chart showing performance by task type
- Three task categories: Counting, User Actions, Timeline
- Multiple models compared side-by-side
- Same color scheme as main plot

**Our Plotly Reproduction:**
✅ **Matches all original features**
✅ **Additional interactive features:**
- Hover tooltips with exact scores
- Click legend to isolate specific models
- Zoom to focus on specific task types
- Download capability

**Key Observations from Both Plots:**

1. **Performance Trends Match:**
   - GPT-5 performs best overall
   - Performance degrades with increasing context length
   - Real-world tasks are harder than synthetic
   - User Actions tasks are generally easier than Timeline tasks
   - Llama-4 and DeepSeek underperform significantly

2. **Data Accuracy:**
   - All data points extracted from original CSV files
   - Exact same values as in the paper
   - Missing data points (empty cells) correctly handled

## Technical Implementation Comparison

### Original (LaTeX/TikZ)

```latex
\begin{tikzpicture}
\pgfplotstableread[col sep=comma]{resources/plots/real_results.csv}\realdata
\begin{groupplot}[
    group size=2 by 1,
    xlabel={Context Length},
    ylabel={Score},
    xmode=log,
    log basis x=2,
]
\addplot[color=cbBlue, mark=o] table[y={gpt-5-nano}] {\synthtable};
\end{groupplot}
\end{tikzpicture}
```

### Our Reproduction (Plotly/Python)

```python
fig = make_subplots(rows=1, cols=2, subplot_titles=('OOLONG-synth', 'OOLONG-real'))

fig.add_trace(
    go.Scatter(
        x=valid_lengths, y=values,
        mode='lines+markers',
        name='gpt-5-nano',
        line=dict(color='#56B4E9', width=2),
        marker=dict(symbol='circle', size=8)
    ),
    row=1, col=1
)

fig.update_xaxes(type='log', ticktext=['8K', '16K', ...])
fig.update_layout(hovermode='x unified')
```

## Advantages of Plotly Version

1. **Interactivity:**
   - Explore data without re-running code
   - Toggle models on/off dynamically
   - Zoom into specific regions of interest
   - See exact values on hover

2. **Web-Friendly:**
   - Self-contained HTML files
   - No special software needed (just a browser)
   - Easy to share and embed
   - Responsive sizing

3. **Accessibility:**
   - Works on any device with a browser
   - Can be hosted on any web server
   - No LaTeX/PDF viewer required

4. **Export Options:**
   - Download as PNG directly from browser
   - Can export to SVG or PDF (with kaleido)
   - Programmatically generate multiple views

## Preserved from Original

1. **Scientific Accuracy:**
   - Identical data values
   - Same statistical representation
   - Correct axis scales and ranges

2. **Visual Design:**
   - Color-coded by model family
   - Colorblind-friendly palette
   - Clear axis labels and titles
   - Legend with model names

3. **Information Density:**
   - All models shown
   - Both synthetic and real-world results
   - Task-specific analysis
   - Performance trends clearly visible

## Files Generated

```
/workspace/project/
├── oolong_results.html           (4.7 MB) - Main benchmark results
├── oolong_task_analysis.html     (4.7 MB) - Task type analysis
├── oolong_plots_plotly.py        - Source code for reproductions
├── OOLONG_PLOTS_SUMMARY.md       - Documentation
└── resources/
    └── plots/
        ├── synth_results.csv     - Synthetic benchmark data
        ├── real_results.csv      - Real-world benchmark data
        └── synth_analysis_task_groups.csv - Task analysis data
```

## How to Access

The plots are now served at:
- **Main Results:** https://work-1-wiswjjhujtrmocfs.prod-runtime.all-hands.dev/oolong_results.html
- **Task Analysis:** https://work-1-wiswjjhujtrmocfs.prod-runtime.all-hands.dev/oolong_task_analysis.html

## Conclusion

The Plotly reproductions successfully capture all the essential information from the original paper's figures while adding valuable interactive features. The plots are visually similar, scientifically accurate, and more accessible than the static PDF figures.

Key achievements:
✅ Faithful reproduction of all data points
✅ Matching color scheme and visual style
✅ Added interactivity without losing clarity
✅ Web-ready format for easy sharing
✅ Maintained scientific rigor and accuracy
