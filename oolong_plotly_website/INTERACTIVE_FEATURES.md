# Interactive Features Guide - OOLONG Plotly Visualizations

## Overview

The Plotly version of the OOLONG benchmark results includes interactive features that allow you to explore the data dynamically while maintaining the exact visual styling from the original paper.

## How to Select/Hide Models

### Method 1: Click Legend Items (Recommended)

**Single Click** on any legend item:
- Toggles that model on/off
- Both plots update simultaneously (since traces are in legend group)
- Other models remain visible
- Click again to show the model again

**Example use cases:**
- Hide the random baseline to focus on model performance
- Hide low-performing models to see top performers more clearly
- Compare just 2-3 models by hiding all others

### Method 2: Double-Click Legend Items

**Double Click** on a legend item:
- **Isolates** that model (hides all others)
- Useful for examining a single model's performance
- Double-click any legend item again to restore all models

**Example use cases:**
- Examine GPT-5's performance across context lengths in detail
- See how a single model compares to the baseline
- Focus on one model without distractions

### Method 3: Show All / Hide All Buttons

Located in the **top-right corner** above the plots:

**"Show All" button:**
- Makes all models visible
- Useful for resetting after hiding multiple models

**"Hide All" button:**
- Hides all models
- Start with a blank canvas and selectively enable models
- Useful for custom comparisons

## Interactive Workflow Examples

### Example 1: Compare Top 3 Models

1. Click "Hide All" button
2. Click on "gpt-5" in legend
3. Click on "gemini-2.5-pro" in legend
4. Click on "claude-sonnet-4" in legend
5. Now only these three models are visible

### Example 2: Examine GPT Family

1. Start with all models visible
2. Hide each non-GPT model by clicking their legend items:
   - Click "gemini-2.5-pro" (hide)
   - Click "o4-mini" (hide)
   - Click "o3" (hide)
   - Click "claude-sonnet-4" (hide)
   - Click "llama-4-maverick" (hide)
   - Click "deepseek-r1-0528" (hide)
   - Click "random baseline" (hide)
3. Now only GPT-5 variants (nano, mini, full) are visible

### Example 3: Compare Model to Baseline

1. Double-click "gpt-5-nano" (isolates this model)
2. Click "random baseline" in legend (adds baseline back)
3. Now you see just GPT-5-nano vs. the baseline

### Example 4: See Performance Degradation Patterns

1. Hide all smaller/lower-performing models
2. Keep only: gpt-5, gemini-2.5-pro, claude-sonnet-4
3. Observe how different top models handle increasing context length

## Other Interactive Features

### Hover Tooltips

- **Move mouse** over any data point or line
- See exact model name, context length, and score
- "Unified hover mode" shows all models' values at that x-position
- Helpful for precise comparisons

### Zoom and Pan

**Zoom in:**
- Click and drag to select a rectangular region
- Double-click to reset zoom

**Pan:**
- After zooming, click and drag to move around

**Zoom controls (toolbar):**
- Appears in top-right when hovering over plot
- Zoom in/out buttons
- Pan button
- Box select / Lasso select
- Reset axes button

### Download Plot

**Camera icon** in toolbar (top-right on hover):
- Download current view as PNG
- Includes only visible models
- Useful for presentations or papers

**Example workflow:**
1. Hide models you don't want
2. Zoom to region of interest
3. Click camera icon to download

## Tips and Tricks

### Quick Comparison

To quickly compare two models:
1. Double-click first model (isolates it)
2. Single-click second model (adds it)
3. Now you see just these two

### Reset Everything

To return to the default view:
1. Click "Show All" button
2. Double-click any white space to reset zoom
3. Everything back to original state

### Model Groups

Models are grouped by color family:
- **Yellow**: Gemini
- **Blue**: GPT-5 family (different markers: circle, x, +)
- **Orange**: O-series (o4-mini, o3)
- **Green**: Claude
- **Purple**: Llama
- **Red/Pink**: DeepSeek
- **Black dashed**: Random baseline

Hide/show by family to compare providers.

### Performance Analysis Workflows

**Identify context length breaking points:**
1. Show all models
2. Zoom x-axis to specific range (e.g., 128K-256K)
3. Observe which models maintain performance

**Compare synthetic vs. real performance:**
1. Isolate one model (double-click)
2. Compare left plot (synth) vs. right plot (real)
3. Note performance gap

**Find best model at specific context length:**
1. Zoom to narrow x-range around target length
2. Observe which model has highest y-value
3. Use hover to see exact scores

## Technical Notes

### Legend Grouping

- Each model appears only ONCE in the legend (left plot)
- Clicking legend item affects BOTH plots simultaneously
- This matches the paper's approach (shared legend)

### Data Visibility

- Hidden traces are completely removed from display
- Y-axis range may auto-adjust when models are hidden
- This is intentional for better viewing of remaining data

### Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- No plugins or extensions required

## Accessibility

### Keyboard Navigation

- Tab through interactive elements
- Enter/Space to activate buttons
- Arrows to navigate plot when focused

### Screen Readers

- All traces have proper labels
- Buttons have descriptive text
- Alternative: Export data from source CSV files

## Troubleshooting

**Legend items not responding:**
- Try clicking directly on the text (not the symbol)
- Ensure page has fully loaded (wait for plots to render)

**Can't see any models:**
- Click "Show All" button
- Refresh page if needed

**Zoom stuck:**
- Double-click plot area to reset
- Or click "Reset axes" in toolbar

**Plot looks wrong after hiding many models:**
- Click "Show All" to restore
- Axis ranges auto-scale, this is normal

## Comparison to Static Paper Figure

| Feature | Paper (Static) | Plotly (Interactive) |
|---------|---------------|---------------------|
| Visual style | ✓ Exact match | ✓ Exact match |
| Colors | ✓ From paper | ✓ Same RGB values |
| Markers | ✓ LaTeX symbols | ✓ Same shapes |
| Show/hide models | ✗ Not possible | ✓ Click legend |
| Zoom | ✗ Not possible | ✓ Click & drag |
| Exact values | ✗ Hard to read | ✓ Hover tooltip |
| Model comparison | ✗ Fixed | ✓ Flexible |
| Download view | ✗ As-is only | ✓ Custom views |

## Summary

The interactive features enhance the paper's figure while preserving its exact visual styling. You can:

✅ **Click legend** to show/hide individual models  
✅ **Double-click legend** to isolate models  
✅ **Use buttons** for Show All / Hide All  
✅ **Hover** for exact values  
✅ **Zoom** into regions of interest  
✅ **Download** custom views  

All while maintaining:
- Exact colors from the paper
- Same marker styles
- Same layout and grid
- Scientific accuracy

**Access the interactive plot:**
https://work-1-wiswjjhujtrmocfs.prod-runtime.all-hands.dev/oolong_results.html
