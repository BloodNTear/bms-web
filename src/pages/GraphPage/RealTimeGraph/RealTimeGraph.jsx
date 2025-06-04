import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

function RealTimeVisualGraph({ initialGraphData, newRecords, autoScrollWindowSeconds = 300 }) {
  const [graphLines, setGraphLines] = useState(initialGraphData.graphLines || []);
  const [startTime, setStartTime] = useState(new Date(initialGraphData.start).getTime());
  const [endTime, setEndTime] = useState(new Date(initialGraphData.end).getTime());

  useEffect(() => {
    if (!newRecords || newRecords.length === 0) return;

    setGraphLines(prevLines => {
      // Clone previous lines
      const updatedLines = prevLines.map(line => {
        // Find new data for this line
        const incomingLine = newRecords.find(nr => nr.lineID === line.lineID);
        if (!incomingLine) return line;

        // Merge existing records with new records
        const combinedRecords = [...line.graphRecords, ...incomingLine.records];

        // Remove duplicates and sort by timestamp
        const uniqueRecordsMap = new Map();
        combinedRecords.forEach(r => {
          uniqueRecordsMap.set(r.recordID, r);
        });
        const uniqueRecords = Array.from(uniqueRecordsMap.values()).sort(
          (a, b) => new Date(a.timeStamp) - new Date(b.timeStamp)
        );

        return { ...line, graphRecords: uniqueRecords };
      });

      // Update endTime based on latest timestamp among new data
      const allNewTimes = newRecords.flatMap(nr =>
        nr.records.map(r => new Date(r.timeStamp).getTime())
      );
      if (allNewTimes.length > 0) {
        const maxNewTime = Math.max(...allNewTimes);
        setEndTime(maxNewTime);
        // Optionally, update startTime to maintain autoScrollWindowSeconds
        setStartTime(maxNewTime - autoScrollWindowSeconds * 1000);
      }

      return updatedLines;
    });
  }, [newRecords, autoScrollWindowSeconds]);

  // Prepare series for echarts option
  const series = graphLines.map(line => ({
    name: line.lineName,
    type: 'line',
    showSymbol: false,
    data: line.graphRecords.map(r => [new Date(r.timeStamp).getTime(), r.pointValue]),
  }));

  const option = {
    title: { text: initialGraphData.graphName },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'time',
      min: startTime,
      max: endTime,
    },
    yAxis: { type: 'value', name: initialGraphData.graphUnit },
    series,
  };

  return <ReactECharts option={option} style={{ height: 400, width: '100%' }} />;
}

export default RealTimeVisualGraph;
