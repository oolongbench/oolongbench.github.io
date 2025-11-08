/**
 * OOLONG Benchmark Leaderboard
 * Reproduces the exact plots from the paper using Plotly
 */

// Create leaderboard table
function createLeaderboardTable() {
    // Table 4 data from the Oolong paper - EXACT values from the paper
    // Using OOLONG-synth Avg. and OOLONG-real Avg. columns from Table 4
    // Overall is calculated as simple average of synth and real scores
    const table4Data = [
        { model: 'GPT-5', synthScore: 70.75, realScore: 47.00, overall: 58.88 },
        { model: 'Gemini-2.5-Pro', synthScore: 55.29, realScore: 52.95, overall: 54.12 },
        { model: 'o3', synthScore: 62.37, realScore: 36.71, overall: 49.54 },
        { model: 'GPT-5-mini', synthScore: 63.68, realScore: 34.55, overall: 49.11 },
        { model: 'Claude-Sonnet-4', synthScore: 58.18, realScore: 36.75, overall: 47.47 },
        { model: 'o4-mini', synthScore: 56.74, realScore: 27.13, overall: 41.94 },
        { model: 'GPT-5-nano', synthScore: 50.73, realScore: 31.05, overall: 40.89 },
        { model: 'Deepseek-R1', synthScore: 13.11, realScore: 32.00, overall: 22.55 },
        { model: 'Llama-4-Maverick', synthScore: 16.37, realScore: 2.07, overall: 9.22 }
    ];
    
    // Data is already sorted by overall average from the paper
    
    // Generate table HTML with info box
    let tableHTML = `
    <div class="leaderboard-info-box">
        <p>For a single leaderboard result, we report scores averaged over 8K-175K inputs. The leaderboard is sorted by the average between Oolong-synth and Oolong-real score.</p>
    </div>
    <div class="leaderboard-table-wrapper">
    <table class="leaderboard-table">
        <thead>
            <tr>
                <th class="rank-col">Rank</th>
                <th class="model-col">Model</th>
                <th class="score-col">OOLONG-synth</th>
                <th class="score-col">OOLONG-real</th>
                <th class="score-col">Overall</th>
            </tr>
        </thead>
        <tbody>
    `;
    
    table4Data.forEach((modelData, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? `rank-${rank}` : '';
        const rowClass = `model-row ${rankClass}`;
        
        const medalIcon = rank <= 3 ? `<i class="fas fa-medal rank-icon"></i>` : '';
        
        const formatScore = (score) => score.toFixed(2);
        
        tableHTML += `
            <tr class="${rowClass}">
                <td class="rank-cell">
                    ${medalIcon}
                    ${rank}
                </td>
                <td class="model-cell">${modelData.model}</td>
                <td class="score-cell">${formatScore(modelData.synthScore)}</td>
                <td class="score-cell">${formatScore(modelData.realScore)}</td>
                <td class="score-cell overall-score">${formatScore(modelData.overall)}</td>
            </tr>
        `;
    });
    
    tableHTML += `
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