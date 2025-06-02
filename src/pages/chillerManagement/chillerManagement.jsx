import './chillerManagement.css';

import { useEffect, useState } from 'react';

import { useAxiosWithAuth } from '../../api/useAxiosWithAuth';

import { SystemStatus } from './systemStatus';
import { VisualGraph } from './VisualGraph';
import { AutoControl } from './AutoControl';
import { ManualControl } from './ManualControl';

import { POINT_ID } from '../../mocks/PointIDs';

function ChillerManagement(){

    const axiosInstance = useAxiosWithAuth();

    //#region Get API Info 
    const [globalState, setGlobalState] = useState(() => {
        const initialState = {
            autoControl: {
                volumePressure: 0,
                minInputWaterTemp: 0,
            },
            manualControl: {
                valvePercentage: 0,
                pump: false,
                pumpState: false,
                comp: false,
                frequency: 0,
            },
            pointerData: []
        };

        return initialState;
    });

    const [reloadKey, setReloadKey] = useState(0);
    function callReload(){
        setReloadKey((prev) => (prev + 1));
    };

    useEffect(() => {
        function SetNewGlobalState(responseData){
            const valveOpen = GetPropValue(responseData, POINT_ID["Độ mở van"], "point_value");
            const pumpOn = GetPropValue(responseData, POINT_ID["On Off Pump"], "point_value");
            const pumpStart = GetPropValue(responseData, POINT_ID["Start Stop Pump"], "point_value");
            const compOn = GetPropValue(responseData, POINT_ID["On Off Comp"], "point_value");
            const pumpFreq = GetPropValue(responseData, POINT_ID["Tần số bơm"], "point_value");

            setGlobalState((prev) => ({
                ...prev,
                manualControl: {
                    valvePercentage: Number(valveOpen) || 0,
                    pump: Number(pumpOn) === 1,
                    pumpState: Number(pumpStart) === 1,
                    comp: Number(compOn) === 1,
                    frequency: Number(pumpFreq) || 0,
                },
                pointerData: responseData
            }));
        };

        function GetPropValue(objectArray, id, propName){
            const target = objectArray.find(o => o.id === id);
            if(target){
                return target[propName];
            }else{
                return undefined;
            }
        };

        async function fetchData(){
            const GET_URL = "points/list?page=1&ppp=100&device_id=&company_id=5cf4eb1557a81c267803c398";
            try{
                const response  = await axiosInstance.get(GET_URL);
                if(response?.data){
                    SetNewGlobalState(response?.data?.data);
                }else{
                    console.error("Error <!>");
                }
            }catch(err){
                console.error(err);
            }

        };
        fetchData();
    },[axiosInstance, reloadKey]);

    //#endregion

    //#region Control Mode
    //True for auto, false for manual
    const [controlMode, setControlMode] = useState("off");

    function GetControlElement(){
        switch(controlMode){
            case "auto": return (
                <AutoControl 
                    currentAutoData={globalState.autoControl}
                    triggerReload={callReload}
                />
            );

            case "manual": return (
                <ManualControl
                    currentManualData={globalState.manualControl} 
                    triggerReload={callReload}
                />
            );

            default: return (
                <div className="control-wrapper">
                    <h2>Please Turn On First</h2>
                </div>
            );
        }
    };

    function TurnOff(){
        setGlobalState((prev) => ({
            ...prev,
            manualControl: {
                ...prev.manualControl,
                pump: false,
                pumpState: false,
                comp: false,
            }
        }));

        setControlMode("off");
    };
    function TurnManual(){
        setControlMode("manual")
    };
    function TurnAuto(){
        setControlMode("auto");
    }
    //#endregion

    //#region Handle Child Submit
    function handleManualStateChange(manualStateData){
        setGlobalState((prev) => ({
            ...prev,
            manualControl: manualStateData
        }));
    }

    function handleAutoStateChange(autoStateData){
        setGlobalState((prev) => ({
            ...prev,
            autoControl: autoStateData
        }));
    }
    //#endregion

    return(
        <div className="chiller-management-wrapper">
            <div className="page-header">
                <h2>Hệ thống điều khiển và giám sát Chiller</h2>
                <h3>Đồ án tốt nghiệp</h3>
            </div>
            <div className="page-body">
                <div className="control-display">
                    <SystemStatus 
                        currentState={globalState}
                        currentMode={controlMode}
                        onOff={TurnOff}
                        onManual={TurnManual}
                        onAuto={TurnAuto}
                    />
                </div>
                <div className="image-and-inputs">

                    <VisualGraph 
                        pumpState={globalState.manualControl.pumpState}
                        compState={globalState.manualControl.comp}
                        valveState={globalState.manualControl.valvePercentage}
                    />

                    {GetControlElement()}

                </div>
            </div>
        </div>
    );
}

export default ChillerManagement;