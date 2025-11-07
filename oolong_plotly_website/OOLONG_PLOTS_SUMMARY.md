# OOLONG Benchmark - Plotly Reproductions

## Overview

Successfully reproduced the core plots from the **OOLONG benchmark** paper by Amanda Bertsch et al. (arXiv:2511.02817) using Plotly.

**Paper Title:** "Oolong: Evaluating Long Context Reasoning and Aggregation Capabilities"

**Authors:** Amanda Bertsch, Adithya Pratapa, Teruko Mitamura, Graham Neubig, Matthew R. Gormley

## Files Created

### 1. Interactive HTML Visualizations

- **`oolong_results.html`** (4.7 MB)
  - Main benchmark results showing model performance across different context lengths
  - Two subplots: OOLONG-synth (left) and OOLONG-real (right)
  - Features interactive hover tooltips, zoom, pan, and legend toggling
  - Models included: gemini-2.5-pro, gpt-5 family, o3/o4-mini, claude-sonnet-4, llama-4-maverick, deepseek-r1-0528

- **`oolong_task_analysis.html`** (4.7 MB)
  - Grouped bar chart showing performance breakdown by task type
  - Three task categories: Counting, User Actions, Timeline
  - Compares performance of key models across these reasoning task types

### 2. Source Data Files

From the arXiv LaTeX source:
- `resources/plots/synth_results.csv` - Synthetic benchmark results
- `resources/plots/real_results.csv` - Real-world benchmark results
- `resources/plots/synth_analysis_task_groups.csv` - Task type analysis

### 3. Python Script

- **`oolong_plots_plotly.py`** - Complete reproduction script with Plotly

## Key Features of the Reproductions

### Main Results Plot (`oolong_results.html`)

**Left Panel - OOLONG-synth:**
- X-axis: Context length (log scale) from 8K to 512K tokens
- Y-axis: Score (0-1)
- Shows how model performance degrades with increasing context length
- Includes random baseline for comparison
- Color-coded by model family (OpenAI in blue, Anthropic in green, etc.)

**Right Panel - OOLONG-real:**
- X-axis: Context length (log scale) from 32K to 512K tokens
- Y-axis: Score (0-1)
- Real-world document understanding tasks
- Generally shows steeper performance degradation than synthetic tasks

### Design Choices

1. **Color Scheme:** Colorblind-friendly palette matching the original paper
   - Yellow (#E69F00): Google Gemini
   - Blue (#56B4E9): OpenAI GPT-5 family
   - Orange (#D55E00): OpenAI O-series
   - Green (#009E73): Anthropic Claude
   - Purple (#CC79A7): Meta Llama
   - Red (#E51E00): DeepSeek

2. **Interactive Features:**
   - Hover to see exact values
   - Click legend to toggle models on/off
   - Double-click legend to isolate model families
   - Zoom and pan capabilities
   - Unified hover mode across subplots

3. **Markers:** Different symbols distinguish models within color families
   - Circle: Base models
   - X: Mini variants
   - Cross: Full/Pro variants

## How to View

### Option 1: Open Directly in Browser
```bash
# Simply double-click the HTML files or open with any web browser:
open oolong_results.html
open oolong_task_analysis.html
```

### Option 2: Via Python HTTP Server
```bash
cd /workspace/project
python -m http.server 8000
# Then navigate to http://localhost:8000/oolong_results.html
```

### Option 3: View in Jupyter/IPython
```python
from IPython.display import IFrame
IFrame('oolong_results.html', width=1200, height=600)
```

## Key Findings from the Plots

### 1. Context Length Degradation
- All models show performance degradation as context length increases
- The degradation is more pronounced in real-world tasks vs synthetic tasks
- Some models (GPT-5, Gemini-2.5-pro) maintain better performance at longer contexts

### 2. Model Rankings
- **OOLONG-synth:** GPT-5 performs best, followed by GPT-5-mini and Gemini-2.5-pro
- **OOLONG-real:** Similar trends but with steeper drops
- Random baseline hovers around 0.2-0.27, providing a lower bound

### 3. Task Type Performance
- Most models perform better on "User Actions" tasks
- "Counting" tasks show intermediate difficulty
- "Timeline" reasoning is generally most challenging

### 4. Model Family Patterns
- **GPT-5 family:** Strong performers, especially on longer contexts
- **Claude Sonnet-4:** Competitive mid-range performer
- **Llama-4:** Significantly underperforms compared to frontier models
- **DeepSeek:** Shows interesting behavior - competitive on some tasks but struggles on others

## Technical Details

### Dependencies
- Python 3.12
- plotly (for interactive visualizations)
- pandas (for data manipulation)
- numpy (for numerical operations)

### Plotly Features Used
- `make_subplots`: Side-by-side comparison plots
- Log-scale x-axes for context lengths
- Custom tick labels (K notation for thousands)
- Grouped bar charts for categorical analysis
- Colorblind-friendly color palettes
- Interactive legend with show/hide functionality

## Comparison to Original

The original paper uses:
- **TikZ/PGFPlots** for static LaTeX figures
- **LaTeX PDF** output format
- Fixed, publication-quality rendering

Our Plotly version offers:
- **Interactive exploration** with zoom, pan, hover
- **HTML/Web format** for easy sharing and viewing
- **Dynamic legend toggling** to compare subsets of models
- **Responsive sizing** that works on different screen sizes
- **Exportable** to PNG, SVG, or PDF if needed (with kaleido)

## References

- **Paper:** Oolong: Evaluating Long Context Reasoning and Aggregation Capabilities
- **arXiv:** https://arxiv.org/abs/2511.02817
- **Authors:** Amanda Bertsch, Adithya Pratapa, Teruko Mitamura, Graham Neubig, Matthew R. Gormley
- **Institution:** Carnegie Mellon University

## License

The original OOLONG benchmark data and paper are subject to their respective licenses.
These Plotly reproductions are created for educational and research purposes.
