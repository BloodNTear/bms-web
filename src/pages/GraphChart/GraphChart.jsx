import './GraphChart.css';

import {useAxiosWithMyBE} from '../../api/useAxioWithMyBE';

import { useState, useEffect } from 'react';

import ReactECharts from 'echarts-for-react';

function GraphChart({pointerArray = []}){

    const axiosInstance = useAxiosWithMyBE();

    const [lines, setLines] = useState([]);

    useEffect(() => {

        async function FetchData(pointerID){
            const URL = "SessionGraph/GetPointerGraphs?pointerID=" + pointerID;

            const response = await axiosInstance.get(URL);
            if(response?.data?.status){
                setLines((prev) => ([...prev, ...response?.data?.data]));
            }else{
                console.error(response?.data?.errorMessage);
            }
        }

        pointerArray.forEach((pointerID) => {
            FetchData(pointerID);
        });
    },[]);

    let chartSettings = "Hello";
    if(lines.length > 0){
        chartSettings = BuildChartSettings("Sample Chart 22", "Temperature (°C)", lines);
    }

    console.log(lines);
    console.log(chartSettings);

    return (
        <div className="graph-chart">
            {lines.length > 0 && (
                <ReactECharts option={chartSettings} style={{ width: '100%', height: '100%'}} />
            )}
        </div>
    )
}

export default GraphChart;

export function BuildChartSettings(chartName, chartUnit, chartLines) {
    let globalMaxY = 0;
    let globalMaxSpanSec = 0;

    const series = [];

    chartLines?.forEach(line => {
        const start = new Date(line.start);
        const end = new Date(line.end);
        const spanSec = Math.ceil((end - start) / 1000);
        if (spanSec > globalMaxSpanSec) globalMaxSpanSec = spanSec;

        const points = line.graphRecords.map(record => {
            const t = new Date(record.timeStamp);
            const secondsFromStart = (t - start) / 1000;
            const y = record.pointValue;
            if (y > globalMaxY) globalMaxY = y;
            return [secondsFromStart, y];
        });

        series.push({
            name: line.lineName,
            type: 'line',
            data: points,
            showSymbol: true,
            smooth: false
        });
    });

    // Round X span and Y max up to nearest 10
    const roundedX = Math.ceil(globalMaxSpanSec / 10) * 10;
    const roundedY = Math.ceil(globalMaxY / 10) * 10;

    // Extract control mode areas (use first line only)
    const markAreas = [];
    if (chartLines.length > 0) {
        const firstLine = chartLines[0];
        const startTime = new Date(firstLine.start);
        const endTime = new Date(firstLine.end);

        const timestamps = [...firstLine.controlModeTimeStamps]
            .sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));

        for (let i = 0; i < timestamps.length; i++) {
            const current = timestamps[i];
            const next = timestamps[i + 1];
            const mode = current.mode;

            const startSec = (new Date(current.timeStamp) - startTime) / 1000;
            const endSec = next
                ? (new Date(next.timeStamp) - startTime) / 1000
                : (endTime - startTime) / 1000;

            const color = mode === 1 ? 'rgba(255, 234, 0, 1)' : 'rgba(0, 255, 8, 1)';

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
            text: chartName
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            type: 'scroll',
            data: chartLines.map(line => line.lineName)
        },
        xAxis: {
            type: 'value',
            name: 'Time (s)',
            min: 0,
            max: roundedX,
            interval: Math.ceil(roundedX / 10),
            axisLabel: {
                formatter: '{value}s'
            }
        },
        yAxis: {
            type: 'value',
            name: chartUnit,
            min: 0,
            max: roundedY,
            interval: Math.ceil(roundedY / 5)
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

