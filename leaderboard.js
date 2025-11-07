/**
 * OOLONG Benchmark Leaderboard
 * Reproduces the exact plots from the paper using Plotly
 */

// Create leaderboard table
function createLeaderboardTable() {
    const synthData = [
        ['gemini-2.5-pro', 0.8854, 0.8447, 0.8774, 0.8813, 0.6984, 0.5683, 0.3656, 0.2506, 0.1329, null, null],
        ['gpt-5-nano', 0.8683, 0.8137, 0.7733, 0.7096, 0.5453, 0.4781, 0.4102, 0.3931, 0.3648, null, null],
        ['gpt-5-mini', 0.8701, 0.8457, 0.8457, 0.8513, 0.7765, 0.6464, 0.5014, 0.4085, 0.4005, null, null],
        ['gpt-5', 0.8654, 0.8429, 0.8550, 0.8556, 0.8445, 0.7612, 0.6124, 0.4636, 0.4003, null, null],
        ['o4-mini', 0.8186, 0.8064, 0.8197, 0.8307, 0.6510, 0.5186, 0.4415, 0.3953, null, null, null],
        ['o3', 0.8629, 0.8468, 0.8655, 0.8680, 0.7952, 0.6323, 0.4486, 0.3745, null, null, null],
        ['claude-sonnet-4', null, null, null, null, null, null, null, null, null, null, null],
        ['llama-4-maverick', null, null, null, null, null, null, null, null, null, null, null],
        ['deepseek-r1-0528', null, null, null, null, null, null, null, null, null, null, null],
        ['random-baseline', 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25]
    ];

    const realData = [
        ['gemini-2.5-pro', 0.6012, 0.5081, 0.4793, 0.4129, 0.3790, 0.3428, 0.3411, 0.2958, 0.2984, null],
        ['gpt-5', 0.5874, 0.4572, 0.3653, 0.2795, 0.2129, 0.1973, null, null, null, null],
        ['gpt-5-mini', 0.4986, 0.2990, 0.2389, 0.2135, 0.1775, 0.1536, null, null, null, null],
        ['gpt-5-nano', 0.4309, 0.2682, 0.2323, 0.2037, 0.1651, 0.1687, null, null, null, null],
        ['o3', 0.5057, 0.3357, 0.2599, 0.2289, null, null, null, null, null, null],
        ['o4-mini', 0.4169, 0.2177, 0.1793, 0.1462, null, null, null, null, null, null],
        ['claude-sonnet-4', 0.5058, 0.3298, 0.2670, 0.2700, 0.2423, 0.2211, 0.2377, 0.2058, 0.1897, 0.1455],
        ['llama-4-maverick', null, null, null, null, null, null, null, null, null, null],
        ['deepseek-r1-0528', 0.4785, 0.2735, 0.2081, null, null, null, null, null, null, null],
        ['random-baseline', 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25]
    ];

    // Calculate average scores for ranking
    const modelScores = {};
    
    synthData.forEach(row => {
        const model = row[0];
        const scores = row.slice(1).filter(score => score !== null);
        if (scores.length > 0) {
            const avgSynth = scores.reduce((a, b) => a + b, 0) / scores.length;
            modelScores[model] = { synth: avgSynth, real: 0, count: 1 };
        }
    });

    realData.forEach(row => {
        const model = row[0];
        const scores = row.slice(1).filter(score => score !== null);
        if (scores.length > 0) {
            const avgReal = scores.reduce((a, b) => a + b, 0) / scores.length;
            if (modelScores[model]) {
                modelScores[model].real = avgReal;
                modelScores[model].count = 2;
            } else {
                modelScores[model] = { synth: 0, real: avgReal, count: 1 };
            }
        }
    });

    // Calculate overall average and sort
    const sortedModels = Object.entries(modelScores)
        .map(([model, scores]) => ({
            model,
            synthAvg: scores.synth,
            realAvg: scores.real,
            overallAvg: (scores.synth + scores.real) / (scores.count === 2 ? 2 : 1)
        }))
        .filter(item => item.model !== 'random-baseline')
        .sort((a, b) => b.overallAvg - a.overallAvg);

    // Create HTML table
    let tableHTML = `
        <div class="leaderboard-table-wrapper">
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th class="rank-col">Rank</th>
                        <th class="model-col">Model</th>
                        <th class="score-col">OOLONG-synth Avg</th>
                        <th class="score-col">OOLONG-real Avg</th>
                        <th class="score-col">Overall Avg</th>
                    </tr>
                </thead>
                <tbody>
    `;

    sortedModels.forEach((item, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? `rank-${rank}` : '';
        
        tableHTML += `
            <tr class="model-row ${rankClass}">
                <td class="rank-cell">
                    ${rank <= 3 ? `<i class="fas fa-medal rank-icon"></i>` : ''}
                    ${rank}
                </td>
                <td class="model-cell">${item.model}</td>
                <td class="score-cell">${item.synthAvg > 0 ? item.synthAvg.toFixed(3) : '—'}</td>
                <td class="score-cell">${item.realAvg > 0 ? item.realAvg.toFixed(3) : '—'}</td>
                <td class="score-cell overall-score">${item.overallAvg.toFixed(3)}</td>
            </tr>
        `;
    });

    // Add random baseline at the bottom
    tableHTML += `
            <tr class="model-row baseline-row">
                <td class="rank-cell">—</td>
                <td class="model-cell">random-baseline</td>
                <td class="score-cell">0.250</td>
                <td class="score-cell">0.250</td>
                <td class="score-cell overall-score">0.250</td>
            </tr>
        </tbody>
    </table>
    </div>
    `;

    document.getElementById('leaderboard-table-container').innerHTML = tableHTML;
}

// Color scheme from pre.tex - EXACT RGB values
const colors = {
    'gemini-2.5-pro': 'rgb(240,228,66)',      // cbYellow
    'gpt-5-nano': 'rgb(0,114,178)',           // cbBlue
    'gpt-5-mini': 'rgb(0,114,178)',           // cbBlue
    'gpt-5': 'rgb(0,114,178)',                // cbBlue
    'o4-mini': 'rgb(230,159,0)',              // cbOrange
    'o3': 'rgb(230,159,0)',                   // cbOrange
    'claude-sonnet-4-20250514': 'rgb(0,158,115)',  // cbGreen
    'Llama-4-Maverick-17B-128E-Instruct-FP8': 'rgb(86,180,233)',  // cbPurple
    'deepseek-r1-0528': 'rgb(204,121,167)',   // cbRed
    'random-baseline': 'rgb(0,0,0)'           // black
};

// Marker styles from results.tex
const markers = {
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
};

// Model order from results.tex (same order for legend)
const synthModels = [
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
];

// Real data - same models except random-baseline
const realModels = [
    'gemini-2.5-pro',
    'gpt-5-nano',
    'gpt-5-mini',
    'gpt-5',
    'o4-mini',
    'o3',
    'claude-sonnet-4-20250514',
    'deepseek-r1-0528',
    'Llama-4-Maverick-17B-128E-Instruct-FP8'
];

// Parse CSV data
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row = {};
        for (let j = 0; j < headers.length; j++) {
            row[headers[j]] = values[j];
        }
        data.push(row);
    }
    return data;
}

// Load CSV files and create plots
async function initializeLeaderboard() {
    try {
        // Load both CSV files
        const [synthResponse, realResponse] = await Promise.all([
            fetch('synth_results.csv'),
            fetch('real_results.csv')
        ]);
        
        const synthText = await synthResponse.text();
        const realText = await realResponse.text();
        
        const synthData = parseCSV(synthText);
        const realData = parseCSV(realText);
        
        // Create the plots
        createOolongPlots(synthData, realData);
        
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('leaderboard-chart').innerHTML = 
            '<p style="color: red; text-align: center;">Error loading leaderboard data. Please try again later.</p>';
    }
}

function createOolongPlots(synthData, realData) {
    // Synth data columns (from results.tex line 6)
    const synthColumns = ['8192', '16384', '32768', '65536', '131072', '262144', '524288'];
    const contextLengthsSynth = [8192, 16384, 32768, 65536, 131072, 262144, 524288];
    
    const traces = [];
    
    // Add OOLONG-synth traces (left plot)
    synthModels.forEach(model => {
        const modelData = synthData.find(row => row.model === model);
        if (modelData) {
            const values = [];
            const validLengths = [];
            
            synthColumns.forEach((col, idx) => {
                const val = modelData[col];
                if (val && val.trim() !== '') {
                    values.push(parseFloat(val));
                    validLengths.push(contextLengthsSynth[idx]);
                }
            });
            
            if (values.length > 0) {
                // Clean up legend names
                let legendName = model.replace('-20250514', '').replace('Llama-4-Maverick-17B-128E-Instruct-FP8', 'llama-4-maverick');
                
                // Line style
                const dashStyle = model === 'random-baseline' ? 'dash' : 'solid';
                
                traces.push({
                    x: validLengths,
                    y: values,
                    mode: 'lines+markers',
                    name: legendName,
                    line: {
                        color: colors[model] || 'rgb(0,0,0)',
                        width: 2,
                        dash: dashStyle
                    },
                    marker: {
                        symbol: markers[model] || 'circle',
                        size: 8,
                        color: colors[model] || 'rgb(0,0,0)'
                    },
                    xaxis: 'x',
                    yaxis: 'y',
                    legendgroup: model,
                    showlegend: true
                });
            }
        }
    });
    
    // Add OOLONG-real traces (right plot)
    const realColumns = Object.keys(realData[0]).filter(col => col !== 'model');
    
    realModels.forEach(model => {
        const modelData = realData.find(row => row.model === model);
        if (modelData) {
            const values = [];
            const validLengths = [];
            
            realColumns.forEach(col => {
                const val = modelData[col];
                if (val && val.trim() !== '') {
                    values.push(parseFloat(val));
                    validLengths.push(parseInt(col));
                }
            });
            
            if (values.length > 0) {
                traces.push({
                    x: validLengths,
                    y: values,
                    mode: 'lines+markers',
                    name: model,
                    line: {
                        color: colors[model] || 'rgb(0,0,0)',
                        width: 2
                    },
                    marker: {
                        symbol: markers[model] || 'circle',
                        size: 8,
                        color: colors[model] || 'rgb(0,0,0)'
                    },
                    xaxis: 'x2',
                    yaxis: 'y2',
                    legendgroup: model,
                    showlegend: false  // Legend only in first plot
                });
            }
        }
    });
    
    // Layout configuration
    const layout = {
        title: {
            text: 'Scores by context window length for OOLONG-synth and OOLONG-real',
            x: 0.45,
            font: { size: 16 }
        },
        height: 500,
        width: 1150,
        
        // Left plot (OOLONG-synth)
        xaxis: {
            title: 'Context Length',
            type: 'log',
            domain: [0, 0.4],
            ticktext: ['8K', '16K', '32K', '64K', '128K', '256K', '512K'],
            tickvals: [8192, 16384, 32768, 65536, 131072, 262144, 524288],
            range: [Math.log10(6500), Math.log10(550000)],
            gridcolor: 'lightgray',
            showgrid: true,
            gridwidth: 1
        },
        yaxis: {
            title: 'Score',
            range: [0, 1],
            domain: [0, 1],
            gridcolor: 'lightgray',
            showgrid: true,
            gridwidth: 1
        },
        
        // Right plot (OOLONG-real)
        xaxis2: {
            title: 'Context Length',
            type: 'log',
            domain: [0.5, 0.75],
            ticktext: ['32K', '64K', '128K', '256K', '512K'],
            tickvals: [32768, 65536, 131072, 262144, 524288],
            range: [Math.log10(48000), Math.log10(600000)],
            gridcolor: 'lightgray',
            showgrid: true,
            gridwidth: 1
        },
        yaxis2: {
            title: '',
            range: [0, 1],
            domain: [0, 1],
            anchor: 'x2',
            side: 'right',
            gridcolor: 'lightgray',
            showgrid: true,
            gridwidth: 1
        },
        
        // Legend on the right side
        legend: {
            orientation: 'v',
            yanchor: 'middle',
            y: 0.5,
            xanchor: 'left',
            x: 0.8,
            font: { size: 10 },
            tracegroupgap: 0
        },
        
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        hovermode: 'x unified',
        
        // Add annotations for subplot titles
        annotations: [
            {
                text: 'OOLONG-synth',
                x: 0.2,
                y: 1.05,
                xref: 'paper',
                yref: 'paper',
                showarrow: false,
                font: { size: 14, color: 'black' }
            },
            {
                text: 'OOLONG-real',
                x: 0.625,
                y: 1.05,
                xref: 'paper',
                yref: 'paper',
                showarrow: false,
                font: { size: 14, color: 'black' }
            }
        ]
    };
    
    // Configuration
    const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'autoScale2d'],
        displaylogo: false
    };
    
    // Create the plot
    Plotly.newPlot('leaderboard-chart', traces, layout, config);
}



// Make functions available globally
window.initializeLeaderboard = initializeLeaderboard;
window.createLeaderboardTable = createLeaderboardTable;