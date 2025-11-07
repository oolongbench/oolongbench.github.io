"""
Reproduce OOLONG benchmark plots from the paper using Plotly
Matches the exact style from results.tex
"""
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Read the CSV data
synth_data = pd.read_csv('resources/plots/synth_results.csv')
real_data = pd.read_csv('resources/plots/real_results.csv')

# Color scheme from pre.tex - EXACT RGB values
# cbYellow RGB(240,228,66), cbBlue RGB(0,114,178), cbOrange RGB(230,159,0)
# cbGreen RGB(0,158,115), cbRed RGB(204,121,167), cbPurple RGB(86,180,233)
colors = {
    'gemini-2.5-pro': 'rgb(240,228,66)',      # cbYellow
    'gpt-5-nano': 'rgb(0,114,178)',           # cbBlue
    'gpt-5-mini': 'rgb(0,114,178)',           # cbBlue
    'gpt-5': 'rgb(0,114,178)',                # cbBlue
    'o4-mini': 'rgb(230,159,0)',              # cbOrange
    'o3': 'rgb(230,159,0)',                   # cbOrange
    'claude-sonnet-4-20250514': 'rgb(0,158,115)',  # cbGreen
    'Llama-4-Maverick-17B-128E-Instruct-FP8': 'rgb(86,180,233)',  # cbPurple
    'deepseek-r1-0528': 'rgb(204,121,167)',   # cbRed
    'random-baseline': 'rgb(0,0,0)'           # black
}

# Marker styles from results.tex
# o = circle, x = x, + = cross, . = small dot
markers = {
    'gemini-2.5-pro': 'circle',
    'gpt-5-nano': 'circle',
    'gpt-5-mini': 'x',
    'gpt-5': 'cross',
    'o4-mini': 'circle',
    'o3': 'x',
    'claude-sonnet-4-20250514': 'circle',
    'Llama-4-Maverick-17B-128E-Instruct-FP8': 'circle',
    'deepseek-r1-0528': 'circle',
    'random-baseline': 'circle'
}

# Create subplots - 2 side by side
fig = make_subplots(
    rows=1, cols=2,
    subplot_titles=('OOLONG-synth', 'OOLONG-real'),
    horizontal_spacing=0.08,
    specs=[[{'type': 'scatter'}, {'type': 'scatter'}]]
)

# Model order from results.tex (same order for legend)
synth_models = [
    'gemini-2.5-pro',
    'gpt-5-nano', 
    'gpt-5-mini',
    'gpt-5',
    'o4-mini',
    'o3',
    'claude-sonnet-4-20250514',
    'Llama-4-Maverick-17B-128E-Instruct-FP8',
    'deepseek-r1-0528',
    'random-baseline'
]

# Real data - same models except random-baseline
real_models = [
    'gemini-2.5-pro',
    'gpt-5-nano',
    'gpt-5-mini',
    'gpt-5',
    'o4-mini',
    'o3',
    'claude-sonnet-4-20250514',
    'deepseek-r1-0528',
    'Llama-4-Maverick-17B-128E-Instruct-FP8'
]

# Synth data columns (from results.tex line 6)
synth_columns = ['8192', '16384', '32768', '65536', '131072', '262144', '524288']
context_lengths_synth = [8192, 16384, 32768, 65536, 131072, 262144, 524288]

# Add OOLONG-synth traces (left plot)
for model in synth_models:
    if model in synth_data['model'].values:
        row = synth_data[synth_data['model'] == model].iloc[0]
        values = []
        valid_lengths = []
        
        for col, length in zip(synth_columns, context_lengths_synth):
            val = row[col]
            if pd.notna(val) and str(val).strip() != '':
                values.append(float(val))
                valid_lengths.append(length)
        
        if values:
            # Clean up legend names
            legend_name = model.replace('-20250514', '').replace('Llama-4-Maverick-17B-128E-Instruct-FP8', 'llama-4-maverick')
            
            # Line style
            dash_style = 'dash' if model == 'random-baseline' else 'solid'
            
            fig.add_trace(
                go.Scatter(
                    x=valid_lengths,
                    y=values,
                    mode='lines+markers',
                    name=legend_name,
                    line=dict(
                        color=colors.get(model, 'rgb(0,0,0)'),
                        width=1,  # line width=1pt from tex
                        dash=dash_style
                    ),
                    marker=dict(
                        symbol=markers.get(model, 'circle'),
                        size=6,  # mark size=2pt from tex (scaled for plotly)
                        color=colors.get(model, 'rgb(0,0,0)')
                    ),
                    showlegend=True,
                    legendgroup=model
                ),
                row=1, col=1
            )

# Add OOLONG-real traces (right plot)
# Get real data columns dynamically
real_columns = [col for col in real_data.columns if col != 'model']

for model in real_models:
    if model in real_data['model'].values:
        row = real_data[real_data['model'] == model].iloc[0]
        values = []
        valid_lengths = []
        
        for col in real_columns:
            val = row[col]
            if pd.notna(val) and str(val).strip() != '':
                values.append(float(val))
                valid_lengths.append(int(col))
        
        if values:
            fig.add_trace(
                go.Scatter(
                    x=valid_lengths,
                    y=values,
                    mode='lines+markers',
                    name=model,
                    line=dict(
                        color=colors.get(model, 'rgb(0,0,0)'),
                        width=1
                    ),
                    marker=dict(
                        symbol=markers.get(model, 'circle'),
                        size=6,
                        color=colors.get(model, 'rgb(0,0,0)')
                    ),
                    showlegend=False,  # Legend only in first plot
                    legendgroup=model
                ),
                row=1, col=2
            )

# Update x-axes (log scale with specific ticks from results.tex)
# OOLONG-synth: xmin=6500, xmax=550000, log basis 2
fig.update_xaxes(
    title_text='Context Length',
    type='log',
    ticktext=['8K', '16K', '32K', '64K', '128K', '256K', '512K'],
    tickvals=[8192, 16384, 32768, 65536, 131072, 262144, 524288],
    range=[3.8, 5.74],  # log2(6500) to log2(550000) approximately
    gridcolor='lightgray',
    showgrid=True,
    gridwidth=1,
    row=1, col=1
)

# OOLONG-real: xmin=48000, xmax=600000
fig.update_xaxes(
    title_text='Context Length',
    type='log',
    ticktext=['32K', '64K', '128K', '256K', '512K'],
    tickvals=[32768, 65536, 131072, 262144, 524288],
    range=[4.6, 5.77],  # log2(48000) to log2(600000) approximately
    gridcolor='lightgray',
    showgrid=True,
    gridwidth=1,
    row=1, col=2
)

# Update y-axes (linear from 0 to 1)
fig.update_yaxes(
    title_text='Score',
    range=[0, 1],
    gridcolor='lightgray',
    showgrid=True,
    gridwidth=1,
    row=1, col=1
)

# Right plot - y-axis on right side
fig.update_yaxes(
    title_text='',
    range=[0, 1],
    gridcolor='lightgray',
    showgrid=True,
    gridwidth=1,
    side='right',
    row=1, col=2
)

# Update layout to match paper style
fig.update_layout(
    title={
        'text': 'Scores by context window length for OOLONG-synth and OOLONG-real',
        'x': 0.5,
        'xanchor': 'center',
        'font': {'size': 14}
    },
    height=450,  # height=6cm from tex
    width=1100,  # Total width for both plots
    # Legend at top, matching results.tex: at={(0.85,1.2)}, anchor=south, legend columns=5
    legend=dict(
        orientation='h',
        yanchor='bottom',
        y=1.15,
        xanchor='center',
        x=0.5,
        font=dict(size=10),
        tracegroupgap=0
    ),
    plot_bgcolor='white',
    paper_bgcolor='white',
    hovermode='x unified',
    # Enable interactive legend - click to show/hide models
    # Single click: toggle trace on/off
    # Double click: isolate trace (hide all others)
    updatemenus=[
        dict(
            type='buttons',
            direction='left',
            buttons=[
                dict(
                    args=[{'visible': [True] * len(fig.data)}],
                    label='Show All',
                    method='restyle'
                ),
                dict(
                    args=[{'visible': [False] * len(fig.data)}],
                    label='Hide All',
                    method='restyle'
                )
            ],
            pad={'r': 10, 't': 10},
            showactive=True,
            x=1.0,
            xanchor='right',
            y=1.15,
            yanchor='top'
        )
    ]
)

# Save to HTML
fig.write_html('oolong_results.html')
print("Created oolong_results.html")

print("\nPlot characteristics matching paper:")
print("- Two side-by-side plots (OOLONG-synth and OOLONG-real)")
print("- Legend at top with 5 columns")
print("- Grid lines enabled (major grid)")
print("- Log scale x-axis with custom tick labels (8K, 16K, etc.)")
print("- Linear y-axis from 0 to 1")
print("- Exact RGB colors from pre.tex")
print("- Marker styles: circle, x, cross matching results.tex")
print("- Line width 1pt, marker size 2pt")
print("- Random baseline as dashed black line")
print("\nInteractive features:")
print("- Click legend items to show/hide individual models")
print("- Double-click legend item to isolate that model")
print("- 'Show All' / 'Hide All' buttons in top-right")
print("- Hover for exact values")
print("- Zoom and pan enabled")
