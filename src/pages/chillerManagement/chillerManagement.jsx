import './chillerManagement.css';

import { useEffect, useState } from 'react';

import { SystemStatus } from './systemStatus';
import { AutoControl } from './AutoControl';
import { ManualControl } from './ManualControl';

function ChillerManagement(){

    const [globalState, setGlobalState] = useState(() => {
        const initialState = {
            autoControl: {
                volumePressure: 0,
            },
            manualControl: {
                valvePercentage: 0,
                pump: false,
                pumpState: false,
                comp: false,
                frequency: 0,
            }
        };

        return initialState;
    });

    useEffect(() => {
        if(!globalState.manualControl.pump){
            setGlobalState((prev) => ({
                ...prev,
                manualControl:{
                    ...prev.manualControl,
                    pumpState: false
                }
            }));
        }
    },[globalState.manualControl.pump]);

    //#region Control Mode
    //True for auto, false for manual
    const [controlMode, setControlMode] = useState("off");

    function GetControlElement(){
        switch(controlMode){
            case "auto": return (
                <AutoControl 
                    currentAutoData={globalState.autoControl}
                    onSubmit={handleAutoStateChange}
                />
            );

            case "manual": return (
                <ManualControl
                    currentManualData={globalState.manualControl} 
                    onSubmit={handleManualStateChange}
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

                    <div className="image-container">

                    </div>

                    {GetControlElement()}

                </div>
            </div>
        </div>
    )
}

export default ChillerManagement;