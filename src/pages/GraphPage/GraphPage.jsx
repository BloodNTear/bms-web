import './GraphPage.css';

import { useState, useEffect, useCallback } from 'react';
import { useAxiosWithMyBE } from '../../api/useAxioWithMyBE';

import { SearchBar } from '../../common/SearchBar';
import { VisualGraph } from './VisualGraph';

function GraphPage(){

    const axiosInstance = useAxiosWithMyBE();
    const [graphs, setGraphs] = useState([]);
    const [selectedGraph, setSelectedGraph] = useState({});

    const FetchGraphs = useCallback( async (searchName) => {
        const API_ENDPOINT = "SessionGraph/GetGraphs?nameSearch=" + searchName;

        try{
            const response = await axiosInstance.get(API_ENDPOINT);
            if(response?.data?.status){
                setGraphs(response?.data?.data);
            }else{
                console.error(response?.data?.errorMessage);
            }
        }catch(err){
            console.error(err);
        }
    }, []);


    function changeSelectedGraph(id){
        const targetGraph = graphs.find(g => g.sessionGraphID === id);
        setSelectedGraph(targetGraph);
    }

    return (
        <div className="graph-page">
            <div className="graph-selection">
                <SearchBar placeholderText={"Tìm kiếm biểu đồ"} onSubmit={FetchGraphs}/>
                <div className="graph-list">
                    {graphs.map((graph, index) => {
                        return(                    
                            <GraphCard 
                                key={index}
                                graphName={graph.graphName}
                                clickHandle={() => changeSelectedGraph(graph.sessionGraphID)}
                            />
                        )
                    })}
                </div>
            </div>
            <div className="graph-container">
                {selectedGraph.graphName && (
                    <VisualGraph graphData={selectedGraph}/>
                )}
            </div>
        </div>
    )
}

function GraphCard({graphName, clickHandle}){
    return(
        <div className="graph-card"
             onClick={clickHandle}
        >
            <h3>{graphName}</h3>
        </div>
    )
}

export default GraphPage;