import './VisualGraph.css';

import ReactECharts from 'echarts-for-react';

function VisualGraph({graphData}){

    let graphSettings = "Hello";
    if(graphData){
        graphSettings = BuildGraphSettings(graphData);
    }

    return (
        <div className="visual-graph">
            {graphSettings && (
                <ReactECharts option={graphSettings} style={{ width: '100%', height: '100%'}} />
            )}
        </div>
    )
}

export default VisualGraph;

export function BuildGraphSettings(graphData, XDevisionDegree = 20, YDvisionDegree = 30) {
    let globalMaxY = 0;
    let globalMaxSpanSec = 0;

    const series = [];
    const lineColors = ['#00bfff', '#ff6600', '#33cc33', '#9933ff', '#ff3366'];

    const start = new Date(graphData.start);
    const end = new Date(graphData.end);
    const spanSec = Math.ceil((end - start) / 1000);
    if (spanSec > globalMaxSpanSec) globalMaxSpanSec = spanSec;

    graphData.graphLines.forEach((line, index) => {
        const points = line.graphRecords.map(record => {
            const t = new Date(record.timeStamp);
            const secondsFromStart = (t - start) / 1000;
            const y = record.pointValue;
            if (y > globalMaxY) globalMaxY = y;
            return [secondsFromStart, y];
        });

        const color = lineColors[index % lineColors.length]; // cycle through colors

        series.push({
            name: line.lineName,
            type: 'line',
            data: points,
            showSymbol: true,
            smooth: false,
            lineStyle: {
                color: color
            },
            itemStyle: {
                color: color
            }
        });
    });


    // Round X span and Y max up to nearest 10
    const roundedX = Math.ceil(globalMaxSpanSec / 10) * 10;
    const roundedY = Math.ceil(globalMaxY * 1.1 * 100) / 100; // rounds up to 2 decimals

    // Extract control mode areas (use first line only)
    const markAreas = [];

    const timestamps = [...graphData.controlModeTimeStamps]
        .sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));

    for (let i = 0; i < timestamps.length; i++) {

        const current = timestamps[i];
        const next = timestamps[i + 1];
        const mode = current.mode;

        const startSec = (new Date(current.timeStamp) - start) / 1000;
        const endSec = next
            ? (new Date(next.timeStamp) - start) / 1000
            : (end - start) / 1000;

        const color = mode === 1 ? 'rgb(255, 255, 0)' : 'rgba(0, 255, 0, 1)';

        markAreas.push([
            {
                xAxis: startSec,
                itemStyle: {
                    color,
                    opacity: 0.15
                }
            },
            {
                xAxis: endSec
            }
        ]);
    }
    

    // Add background color overlays using markArea
    if (markAreas.length > 0) {
        series.push({
            type: 'line',
            data: [],
            markArea: {
                silent: true,
                data: markAreas
            }
        });
    }

    return {
        title: {
            text: graphData.graphName,
            textStyle: {
                color: '#fff', // ← Your desired title color
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            type: 'scroll',
            data: graphData.graphLines.map(line => line.lineName)
        },
        xAxis: {
            type: 'value',
            name: 'Time (s)',
            min: 0,
            max: roundedX,
            interval: roundedX / XDevisionDegree,
            axisLabel: {
                formatter: '{value}s',
                color: '#fff'
            },
            axisLine: {
                lineStyle: {
                color:  '#fff'      // Axis line color
                }
            },
            axisTick: {
                lineStyle: {
                color:  '#fff'      // Tick color
                }
            },
            itemStyle: {
                color: '#fff'
            }
        },
        yAxis: {
            type: 'value',
            name: graphData.graphUnit,
            min: 0,
            max: roundedY,
            interval: roundedY / YDvisionDegree,
            axisLabel: {
                formatter: function (value) {
                    return value.toFixed(2); 
                },
                color: '#fff'
            },
            axisLine: {
                lineStyle: {
                color:  '#fff'      // Axis line color
                }
            },
            axisTick: {
                lineStyle: {
                color:  '#fff'      // Tick color
                }
            },
        },
        grid: {
            left: '8%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        series
    };
}

