# OOLONG Plots - Exact Characteristics from Paper

## Figure: Results by Context Window Length

### Source Files
- **LaTeX**: `resources/plots/results.tex`
- **Data**: `resources/plots/synth_results.csv`, `resources/plots/real_results.csv`
- **Colors**: `pre.tex` (colorblind-friendly RGB values)

### Layout

**Two side-by-side plots:**
1. **Left**: OOLONG-synth (8K to 512K context)
2. **Right**: OOLONG-real (32K to 512K context)

**Dimensions** (from results.tex):
- Left plot width: 8.5cm
- Right plot width: 6cm
- Height: 6cm
- Horizontal separation: 0.5cm

### Legend

**Position**: Top center above both plots
- LaTeX: `at={(0.85,1.2)}, anchor=south`
- Layout: 5 columns, horizontal
- Font: \scriptsize

**Models shown (in order)**:
1. gemini-2.5-pro
2. gpt-5-nano
3. gpt-5-mini
4. gpt-5
5. o4-mini
6. o3
7. claude-sonnet-4
8. llama-4-maverick
9. deepseek-r1-0528
10. random baseline (OOLONG-synth only)

### Colors (Exact RGB from pre.tex)

| Model Family | LaTeX Color | RGB Value | Hex Approximation |
|--------------|-------------|-----------|-------------------|
| Gemini | cbYellow | (240, 228, 66) | #F0E442 |
| GPT-5 family | cbBlue | (0, 114, 178) | #0072B2 |
| O-series | cbOrange | (230, 159, 0) | #E69F00 |
| Claude | cbGreen | (0, 158, 115) | #009E73 |
| DeepSeek | cbRed | (204, 121, 167) | #CC79A7 |
| Llama | cbPurple | (86, 180, 233) | #56B4E9 |
| Baseline | black | (0, 0, 0) | #000000 |

### Markers and Line Styles

| Model | Marker | Line Style | Color |
|-------|--------|------------|-------|
| gemini-2.5-pro | ○ (circle) | solid | Yellow |
| gpt-5-nano | ○ (circle) | solid | Blue |
| gpt-5-mini | × (x) | solid | Blue |
| gpt-5 | + (cross) | solid | Blue |
| o4-mini | ○ (circle) | solid | Orange |
| o3 | × (x) | solid | Orange |
| claude-sonnet-4 | ○ (circle) | solid | Green |
| llama-4-maverick | ○ (circle) | solid | Purple |
| deepseek-r1-0528 | ○ (circle) | solid | Red |
| random baseline | • (small dot) | **dashed** | Black |

**Specifications from results.tex**:
- Mark size: 2pt
- Line width: 1pt

### Axes Configuration

#### X-Axis (Context Length)

**OOLONG-synth** (left):
```
xmode=log
log basis x=2
xmin=6500, xmax=550000
xtick={8192,16384,32768,65536,131072,262144,524288}
xticklabels={8K,16K,32K,64K,128K,256K,512K}
```

**OOLONG-real** (right):
```
xmode=log
log basis x=2
xmin=48000, xmax=600000
xtick={32768,65536,131072,262144,524288}
xticklabels={32K,64K,128K,256K,512K}
```

#### Y-Axis (Score)

**Both plots**:
```
ymin=0, ymax=1
ylabel={Score} (left plot only)
yticklabel pos=right (right plot only)
```

### Grid

**Configuration**:
```
grid=major
```
- Visible grid lines on both x and y axes
- Light gray color (standard)
- Grid at major tick marks

### Data

**OOLONG-synth**: 10 models × 7 context lengths (8K to 512K)
- Includes random baseline
- More data points at lower context lengths

**OOLONG-real**: 9 models × 5-6 context lengths (varies by model)
- No random baseline
- Starts at 32K or higher
- Some missing data points for certain models at certain lengths

### Key Visual Characteristics

1. **Log scale** on x-axis shows exponential growth in context length
2. **Performance degradation** clearly visible as lines slope downward
3. **Color coding** groups models by provider/family
4. **Marker shapes** distinguish models within same color family
5. **Dashed baseline** provides reference point for random performance
6. **Grid lines** aid in reading exact values
7. **Shared legend** at top avoids duplication
8. **Side-by-side** layout enables direct comparison

### Caption

"Scores by context window length for OOLONG-synth and OOLONG-real."

### Label

`\label{fig:results_by_length}`

## Implementation Notes

### Plotly Reproduction

To match the paper exactly, the Plotly version must have:

1. ✅ Exact RGB colors from `pre.tex`
2. ✅ Matching marker symbols (circle, x, cross)
3. ✅ Log scale with base 2 on x-axis
4. ✅ Tick labels as "8K", "16K" etc. (not raw numbers)
5. ✅ Y-axis from 0 to 1 with grid
6. ✅ Legend at top with horizontal layout
7. ✅ Dashed line for random baseline
8. ✅ Same model order in legend
9. ✅ Two side-by-side subplots
10. ✅ Grid lines visible on both axes
11. ✅ Right plot has y-axis labels on right side
12. ✅ Subtitle for each plot (OOLONG-synth, OOLONG-real)

### Differences from Original

**Additions in Plotly**:
- Interactive hover tooltips
- Click legend to show/hide traces
- Zoom and pan capabilities
- Download as PNG option

**Preserved from Original**:
- All visual styling
- All data points
- Color scheme
- Marker styles
- Layout and proportions
- Scientific accuracy

## Viewing

The HTML file can be opened in any modern web browser:
- File: `oolong_results.html`
- Size: ~4.7 MB (includes full Plotly.js library)
- Requirements: None (self-contained)
- Server: https://work-1-wiswjjhujtrmocfs.prod-runtime.all-hands.dev/oolong_results.html
