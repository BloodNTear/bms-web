import './RealTimeGraph.css';
import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import {v4 as uuidv4} from 'uuid';

function RealTimeVisualGraph({ initialGraphData, newRecords, autoScrollWindowSeconds = 300 }) {
  const [graphLines, setGraphLines] = useState(initialGraphData.graphLines || []);
  const [startTime, setStartTime] = useState(new Date(initialGraphData.start).getTime());
  const [endTime, setEndTime] = useState(new Date(initialGraphData.end).getTime());

  useEffect(() => {
    if (!newRecords || newRecords.length === 0) return;

    // Group incoming records by graphLineID
    const groupedRecords = new Map();
    newRecords.forEach(r => {
      if (!groupedRecords.has(r.graphLineID)) {
        groupedRecords.set(r.graphLineID, []);
      }
      groupedRecords.get(r.graphLineID).push(r);
    });

    setGraphLines(prevLines => {
      const updatedLines = prevLines.map(line => {
        const incoming = groupedRecords.get(line.lineID);
        if (!incoming) return line;

        const combinedRecords = [...line.graphRecords, ...incoming];

        // Deduplicate by recordID
        const uniqueRecordsMap = new Map();
        combinedRecords.forEach(r => {
          uniqueRecordsMap.set(r.recordID, r);
        });

        const uniqueRecords = Array.from(uniqueRecordsMap.values()).sort(
          (a, b) => new Date(a.timeStamp) - new Date(b.timeStamp)
        );

        return { ...line, graphRecords: uniqueRecords };
      });

      // Update time window
      const allNewTimes = newRecords.map(r => new Date(r.timeStamp).getTime());
      if (allNewTimes.length > 0) {
        const maxNewTime = Math.max(...allNewTimes);
        setEndTime(maxNewTime);
        setStartTime(maxNewTime - autoScrollWindowSeconds * 1000);
      }

      return updatedLines;
    });
  }, [newRecords, autoScrollWindowSeconds]);

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

  return (
    <div className="real-time-graph">
      <ReactECharts option={option} style={{ height: 400, width: '100%' }} />
    </div>
  );
}

export default RealTimeVisualGraph;



const initialGraphDataModel = {
  graphName: "SampleGraph",
  graphUnit: "Pressure (Pa)",
  currentControlMode: 1,
  lineData: [
    {
      lineName: "Sample Line 1",
      pointerID: uuidv4()
    },
    {
      lineName: "Sample Line 2",
      pointerID: uuidv4()
    }
  ],
  currentPointerData: []
}

export function CreateInitialGraphData(createGraphData = initialGraphDataModel){
  
  const graphID = uuidv4();
  
  let graph = {
      sessionGraphID: graphID,
      graphName: createGraphData.graphName,
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      graphUnit: createGraphData.graphUnit,
      controlModeTimeStamps: [
        {
            timeStampID: uuidv4(),
            timeStamp: new Date().toISOString(),
            mode: createGraphData.currentControlMode,
            sesstionGraphID: graphID,
            sessionGraph: null
        }
      ],
      graphLines: createGraphData.lineData.map((line) => {
                    return {
                      lineID: uuidv4(),
                      sessionGraphID: graphID,
                      pointerID: line.pointerID,
                      lineName: line.lineName,
                      sessionGraph: null,
                      graphRecords: []
                    }
                  })
  }

  createGraphData.currentPointerData.forEach((pointerData) => {
      graph.graphLines.forEach((line) => {
        if(line.pointerID === pointerData.id){
          line.graphRecords.push({
            recordID: uuidv4(),
            pointValue: pointerData.point_value,
            timeStamp: new Date().toISOString(),
            graphLineID: line.lineID,
            graphLine: null
          });
        }
      })
  });

  return graph;
}

/**
 * Data = Pointer Data At that time
 * @param {*} data 
 */
export function MapDataToGraphPoint(intialData, newPointerData){
  let result = [];

  newPointerData.forEach((pointerData) => {
      intialData.graphLines.forEach((line) => {
        if(line.pointerID === pointerData.id){
          result.push({
            recordID: uuidv4(),
            pointValue: pointerData.point_value,
            timeStamp: new Date().toISOString(),
            graphLineID: line.lineID,
            graphLine: null
          });
        }
      })
  });

  return result;
}
