import './systemStatus.css';

import { useState, useEffect } from 'react';

import { InfoDisplayCase } from './InfoDisplayCase';

import { POINT_ID } from '../../../mocks/PointIDs';

function SystemStatus({currentState, currentMode, onOff, onManual, onAuto}){

    const [systemData, setSystemData] = useState(() => {
        return currentState;
    });

    useEffect(() => {
        setSystemData(currentState);
    },[currentState]);

    //#region Parent-passed functions
    function handleTurnOff(){
        onOff && onOff();
    }
    function handleTurnManual(){
        onManual && onManual();
    }
    function handleTurnAuto(){
        if(currentState.manualControl.pump &&
             currentState.manualControl.comp &&
              currentState.manualControl.pumpState){
            onAuto && onAuto();
        }else{
            alert("PUMP and COMP in Manual Control MUST be ON to use Auto <!>");
        }
    }
    //#endregion

    //#region UI Helper Functions
    function GetValue(id){
        const targetUnit = systemData?.pointerData?.find(unit => unit?.id === id);
        if(targetUnit){
            return targetUnit?.point_value;
        }else{
            return "Unit not found <!>";
        }
    };

    function GetPressureDiff(){
        return GetValue(POINT_ID["Áp suất nước cấp"]) - GetValue(POINT_ID["Áp suất nước hồi"]);
    };

    function GetValveOpenPercentage(){
        switch(currentMode){
            case "auto": return (                
                    <InfoDisplayCase 
                        title="Độ mở van:"
                        info={alertLevel}
                    />
                );
            case "manual": return (
                    <InfoDisplayCase 
                        title="Độ mở van:"
                        info={GetValue(POINT_ID["Độ mở van"])}
                    />
                );
            case "off": return null;
            default: return (<p>Case out of bound!</p>);
        }
    }
    //#endregion

    //#region Alert
    const deltaP = GetPressureDiff() - currentState?.autoControl?.volumePressure;
    const alertLevel = (deltaP / 0.5) * 100 > 0 ? (deltaP / 0.5) * 100 : 0;

    useEffect(() => {
        if(alertLevel >= 100){
            alert("Warning, the pressure is skyrocketing, we're gonna have a whole new Chernobyl right here soon <!>");
        }
    },[alertLevel]);
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
                {GetValveOpenPercentage()}
            </div>
        </div>
    )
}

export default SystemStatus;