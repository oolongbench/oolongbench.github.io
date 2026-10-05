/** Oolong results from the October 5, 2026 paper source. */
// Explicit paper roster excludes label/reasoning ablations and synth-only models.
const models = [
    ['gemini-3-pro', 'Gemini-3-Pro', 'closed', '#b08b00', 'diamond'],
    ['gpt-5', 'GPT-5', 'closed', '#0072b2', 'cross'],
    ['gemini-2.5-pro', 'Gemini-2.5-Pro', 'closed', '#b08b00', 'circle'],
    ['o3', 'o3', 'closed', '#e69f00', 'x'],
    ['gpt-5-mini', 'GPT-5-mini', 'closed', '#0072b2', 'x'],
    ['claude-sonnet-4-20250514', 'Claude-Sonnet-4', 'closed', '#009e73', 'circle'],
    ['o4-mini', 'o4-mini', 'closed', '#e69f00', 'circle'],
    ['Gemma4-31B', 'Gemma-4-31B', 'open', '#887600', 'cross'],
    ['gpt-5-nano', 'GPT-5-nano', 'closed', '#0072b2', 'circle'],
    ['gpt-5.2', 'GPT-5.2', 'closed', '#0072b2', 'diamond'],
    ['Qwen3-4B-instruct', 'Qwen3-4B-Instruct', 'open', '#800000', 'circle'],
    ['Olmo3.1-Think-32B', 'Olmo-3.1-Think-32B', 'open', '#cc79a7', 'square'],
    ['deepseek-r1-0528', 'Deepseek-R1', 'open', '#666666', 'circle'],
    ['Olmo3-Think-7B', 'Olmo-3-Think-7B', 'open', '#cc79a7', 'cross'],
    ['Olmo3.1-Instruct-32B', 'Olmo-3.1-Instruct-32B', 'open', '#cc79a7', 'circle'],
    ['Olmo3-Instruct-7B', 'Olmo-3-Instruct-7B', 'open', '#cc79a7', 'x'],
    ['Llama3-3B', 'Llama-3-3B', 'open', '#56b4e9', 'x'],
    ['Llama3-8B', 'Llama-3-8B', 'open', '#56b4e9', 'square'],
    ['Qwen3-4B-thinking', 'Qwen3-4B-Thinking', 'open', '#800000', 'x'],
    ['Llama-4-Maverick-17B-128E-Instruct-FP8', 'Llama-4-Maverick', 'open', '#56b4e9', 'circle']
].map(([id, name, category, color, marker]) => ({ id, name, category, color, marker }));
const synthAverageColumns = ['8192', '16384', '32768', '65536', '131072'];
const realAverageColumns = ['55124', '118711', '175571'];

// These source CSVs have unquoted, comma-separated numeric fields.
function parseCSV(text) {
    const [header, ...lines] = text.trim().split(/\r?\n/);
    const columns = header.split(',').map(value => value.trim());
    return lines.filter(line => line.trim()).map(line => {
        const values = line.split(',').map(value => value.trim());
        return Object.fromEntries(columns.map((column, i) => [column, values[i] ?? '']));
    });
}

function averageScore(row, columns) {
    if (!row) throw new Error('Missing model results');
    let limited = false;
    const total = columns.reduce((sum, column) => {
        if (!(column in row)) throw new Error(`Missing context column: ${column}`);
        if (row[column] === '') { limited = true; return sum; }
        const score = Number(row[column]);
        if (!Number.isFinite(score) || score < 0 || score > 1) throw new Error('Invalid score');
        return sum + score;
    }, 0);
    return { score: total * 100 / columns.length, limited };
}

function leaderboardScores(synthData, realData) {
    return models.map(model => {
        const synth = averageScore(synthData.find(row => row.model === model.id), synthAverageColumns);
        const real = averageScore(realData.find(row => row.model === model.id), realAverageColumns);
        return { ...model, synth, real, overall: (synth.score + real.score) / 2 };
    }).sort((a, b) => b.overall - a.overall);
}

function createLeaderboardTable(scores) {
    const dagger = '<sup title="Unsupported context lengths count as zero">†</sup>';
    const format = split => split.score.toFixed(2) + (split.limited ? dagger : '');
    document.getElementById('leaderboard-table-container').innerHTML = `
        <div class="leaderboard-table-wrapper"><table class="leaderboard-table">
            <thead><tr><th class="rank-col" scope="col">Rank</th><th class="model-col" scope="col">Model</th>
            <th class="score-col" scope="col">OOLONG-synth</th><th class="score-col" scope="col">OOLONG-real</th>
            <th class="score-col" scope="col">Overall</th></tr></thead>
            <tbody>${scores.map((model, index) => `<tr class="model-row ${index < 3 ? `rank-${index + 1}` : ''}">
                <td class="rank-cell">${index + 1}</td>
                <td class="model-cell">${model.name}</td><td class="score-cell">${format(model.synth)}</td>
                <td class="score-cell">${format(model.real)}</td>
                <td class="score-cell overall-score">${model.overall.toFixed(2)}${model.synth.limited || model.real.limited ? dagger : ''}</td>
            </tr>`).join('')}</tbody>
        </table></div>
        <div class="leaderboard-info-box">
            <p>OOLONG-synth averages five context lengths (8K, 16K, 32K, 64K, 128K); OOLONG-real averages three (approximately 55K, 118K, 175K). Overall is the average of the two scores. Scores are shown out of 100.</p>
            <p>† Context lengths beyond a model’s maximum count as zero in the leaderboard average. Missing measurements are not plotted.</p>
        </div>
        `;
}

async function initializeLeaderboard() {
    const filter = document.getElementById('model-filter');
    const category = () => filter.querySelector('input:checked').value;
    try {
        const responses = await Promise.all(['synth_results.csv', 'real_results.csv'].map(file => fetch(file)));
        if (responses.some(response => !response.ok)) throw new Error('Unable to fetch results');
        const [synthData, realData] = await Promise.all(responses.map(async response => parseCSV(await response.text())));
        createLeaderboardTable(leaderboardScores(synthData, realData));
        await createOolongPlots(synthData, realData, category());
        filter.disabled = false;
        const render = () => createOolongPlots(synthData, realData, category());
        filter.addEventListener('change', render);
        window.matchMedia('(max-width: 700px)').addEventListener('change', render);
    } catch (error) {
        console.error('Error loading results:', error);
        document.getElementById('leaderboard-table-container').innerHTML = '<p role="alert">Unable to load results. Please refresh to try again.</p>';
        document.getElementById('leaderboard-chart').textContent = 'Results are unavailable.';
    }
}

function createOolongPlots(synthData, realData, category = 'all') {
    const selected = models.filter(model => category === 'all' || model.category === category);
    const baseline = { id: 'random-baseline', name: 'Random baseline', color: '#000000', marker: 'circle' };
    const traces = [];
    [synthData, realData].forEach((data, split) => {
        const columns = Object.keys(data[0]).filter(column => column !== 'model' && Number(column) >= 8192).sort((a, b) => Number(a) - Number(b));
        (split === 0 ? [...selected, baseline] : selected).forEach(model => {
            const row = data.find(row => row.model === model.id);
            if (!row) throw new Error(`Missing results for ${model.id}`);
            const points = columns.filter(column => row[column] !== '');
            traces.push({
                x: points.map(Number), y: points.map(column => Number(row[column])),
                mode: 'lines+markers', name: model.name, legendgroup: model.id,
                showlegend: split === 0, connectgaps: false,
                line: { color: model.color, width: 2, dash: model.id === baseline.id ? 'dash' : 'solid' },
                marker: { color: model.color, symbol: model.marker, size: 7 },
                xaxis: split === 0 ? 'x' : 'x2', yaxis: split === 0 ? 'y' : 'y2',
                hovertemplate: '%{x:,} tokens<br>Score: %{y:.4f}<extra>%{fullData.name}</extra>'
            });
        });
    });
    const compact = window.matchMedia('(max-width: 700px)').matches;
    // Layout configuration
    const layout = {
        font: { family: 'Arial, sans-serif', color: '#51483e', size: 12 },
        height: compact ? 1100 : 720,
        autosize: true,
        
        // Left plot (OOLONG-synth)
        xaxis: {
            title: 'Context Length',
            type: 'log',
            domain: compact ? [0, 1] : [0, 0.43],
            ticktext: ['8K', '16K', '32K', '64K', '128K', '256K', '512K'],
            tickvals: [8192, 16384, 32768, 65536, 131072, 262144, 524288],
            range: [Math.log10(6500), Math.log10(550000)],
            gridcolor: '#eee9e0',
            showgrid: true,
            gridwidth: 1
        },
        yaxis: {
            title: 'Score',
            range: [0, 1],
            domain: compact ? [0.60, 1] : [0, 1],
            gridcolor: '#eee9e0',
            showgrid: true,
            gridwidth: 1
        },
        
        // Right plot (OOLONG-real)
        xaxis2: {
            title: 'Context Length',
            anchor: 'y2',
            type: 'log',
            domain: compact ? [0, 1] : [0.55, 1],
            ticktext: ['64K', '128K', '256K', '512K', '916K'],
            tickvals: [65536, 131072, 262144, 524288, 916174],
            range: [Math.log10(48000), Math.log10(1000000)],
            gridcolor: '#eee9e0',
            showgrid: true,
            gridwidth: 1
        },
        yaxis2: {
            title: '',
            range: [0, 1],
            domain: compact ? [0, 0.40] : [0, 1],
            anchor: 'x2',
            side: compact ? 'left' : 'right',
            gridcolor: '#eee9e0',
            showgrid: true,
            gridwidth: 1
        },
        
        margin: { l: 48, r: compact ? 16 : 35, t: 45, b: compact ? 380 : 220 },

        // Shared legend below the plots
        legend: {
            orientation: 'h',
            yanchor: 'top',
            y: compact ? -0.14 : -0.22,
            xanchor: 'left',
            x: 0,
            font: { size: 11 },
            tracegroupgap: 0
        },
        
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        hovermode: 'x unified',
        
        // Add annotations for subplot titles
        annotations: [
            {
                text: 'OOLONG-synth',
                x: compact ? 0.5 : 0.2,
                y: 1.05,
                xref: 'paper',
                yref: 'paper',
                showarrow: false,
                font: { size: 14, color: '#51483e' }
            },
            {
                text: 'OOLONG-real',
                x: compact ? 0.5 : 0.775,
                y: compact ? 0.45 : 1.05,
                xref: 'paper',
                yref: 'paper',
                showarrow: false,
                font: { size: 14, color: '#51483e' }
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
    return Plotly.react('leaderboard-chart', traces, layout, config);
}
