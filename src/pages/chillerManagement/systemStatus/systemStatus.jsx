import './systemStatus.css';

import { useState, useEffect } from 'react';

import { useAxiosWithAuth } from '../../../api/useAxiosWithAuth';
import { InfoDisplayCase } from './InfoDisplayCase';
import { mockData } from '../../../mocks/mockData';

function SystemStatus({currentState, currentMode, onOff, onManual, onAuto}){

    const axiosInstance = useAxiosWithAuth();

    const [systemData, setSystemData] = useState(() => {
        return mockData;
    });

    useEffect(() => {
        async function fetchData(){
            const GET_URL = "points/list?page=1&ppp=100&device_id=&company_id=5cf4eb1557a81c267803c398";
            try{
                const response  = await axiosInstance.get(GET_URL);
                if(response?.data){
                    setSystemData(response?.data?.data);
                }else{
                    console.error("Error <!>");
                }
            }catch(err){
                console.error(err);
            }

        };
        fetchData();
    },[axiosInstance]);

    //#region Parent-passed functions
    function handleTurnOff(){
        onOff && onOff();
    }
    function handleTurnManual(){
        onManual && onManual();
    }
    function handleTurnAuto(){
        if(currentState.manualControl.pump && currentState.manualControl.comp){
            onAuto && onAuto();
        }else{
            alert("PUMP and COMP in Manual Control MUST be ON to use Auto <!>");
        }
    }
    //#endregion

    //#region UI Helper Functions
    function GetValue(id){
        const targetUnit = systemData?.find(unit => unit?.id === id);
        if(targetUnit){
            return targetUnit?.point_value;
        }else{
            return "Unit not found <!>";
        }
    }

    const POINT_ID = {
        "Áp suất nước cấp": "386d4ccfa30e03071cec3daf",
        "Áp suất nước hồi": "386d4d1ea30e03071cec3db1",
        "Nhiệt độ nước cấp": "386d48cda30e03071cec3da5",
        "Nhiệt độ nước hồi": "386d4bb2a30e03071cec3dac",
        "Tần số bơm": "386d50014eb911071abac777"
    };

    function GetPressureDiff(){
        return GetValue(POINT_ID["Áp suất nước cấp"]) - GetValue(POINT_ID["Áp suất nước hồi"]);
    }
    //#endregion

    return(
        <div className="system-status-wrapper">
            <div className="title">
                <h2>Hệ thống</h2>
            </div>
            <div className="control-buttons">
                <div className={`control-button ${currentMode === "off" ? "off" : ""}`}
                     onClick={handleTurnOff}
                >
                    <h3>OFF</h3>
                </div>
                <div className={`control-button ${currentMode === "manual" ? "manual" : ""}`}
                    onClick={handleTurnManual}
                >
                    <h3>MAN</h3>
                </div>
                <div className={`control-button ${currentMode === "auto" ? "auto" : ""}`}
                    onClick={handleTurnAuto}
                >
                    <h3>AUTO</h3>
                </div>
            </div>

            <div className="info-display">
                <InfoDisplayCase 
                    title="Áp suất nước cấp:"
                    info={GetValue(POINT_ID["Áp suất nước cấp"])}
                />
                <InfoDisplayCase 
                    title="Áp suất nước hồi:"
                    info={GetValue(POINT_ID["Áp suất nước hồi"])}
                />
                <InfoDisplayCase 
                    title="Nhiệt độ nước cấp:"
                    info={GetValue(POINT_ID["Nhiệt độ nước cấp"])}
                />
                <InfoDisplayCase 
                    title="Nhiệt độ nước hồi:"
                    info={GetValue(POINT_ID["Nhiệt độ nước hồi"])}
                />
                <InfoDisplayCase 
                    title="Chênh lệch áp suất:"
                    info={GetPressureDiff()}
                />
                <InfoDisplayCase 
                    title="Tần số bơm:"
                    info={GetValue(POINT_ID["Tần số bơm"])}
                />
                <InfoDisplayCase 
                    title="Độ mở van:"
                    info={GetValue("")}
                />
            </div>
        </div>
    )
}

export default SystemStatus;