import './chillerManagement.css';

import { useEffect, useState, useRef } from 'react';

import { useAxiosWithAuth } from '../../api/useAxiosWithAuth';
import { useSilentAxiosWithAuth } from '../../api/useSilentAxiosWithAuth';
import { useAxiosWithMyBE } from '../../api/useAxioWithMyBE';
import {v4 as uuidv4} from 'uuid';

import { SystemStatus } from './systemStatus';
import { VisualGraph } from './VisualGraph';
import { AutoControl } from './AutoControl';
import { ManualControl } from './ManualControl';

import RealTimeVisualGraph from '../GraphPage/RealTimeGraph/RealTimeGraph.jsx';
import { CreateInitialGraphData, MapDataToGraphPoint } from '../GraphPage/RealTimeGraph/RealTimeGraph.jsx';

import { POINT_ID } from '../../mocks/PointIDs';

import FALBANNER from '../../assets/fal-banner.png';
import UNIBANNER from '../../assets/uni-banner.png';

import {mockGraphData} from '../../mocks/mockGraphData.jsx';
import InputCase from '../../common/InputCase/InputCase.jsx';

function ChillerManagement(){

    const axiosInstance = useAxiosWithAuth();
    const silentAxiosInstance = useSilentAxiosWithAuth();

    //#region Get API Info 
    const [globalState, setGlobalState] = useState(() => {
        const initialState = {
            autoControl: {
                volumePressure: 0,
                minInputWaterTemp: 0,
                currentWaterTemp: 0
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
            const waterTemp = GetPropValue(responseData, POINT_ID["Nhiệt độ nước cấp"], "point_value");

            setGlobalState((prev) => ({
                ...prev,
                autoControl: {
                    ...prev.autoControl,
                    currentWaterTemp: waterTemp
                },
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
            //const GET_URL = "SessionGraph/GetPseudoData";
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
                    currentManualData={globalState.manualControl}
                    onDataSubmit={handleAutoDataSubmit}
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

    //#region Handle Auto Data Submit

    function handleAutoDataSubmit(field, value){
        setGlobalState((prev) => ({
            ...prev,
            autoControl: {
                ...prev.autoControl,
                [field]: value
            }
        }));
    }

    //#endregion

    //#region Silent reload and Auto Control
    const [refreshRate, setRefreshRate] = useState(0.5);

    function ChangeRefreshRate(field, value){
        setRefreshRate(Number(value));
    }
    
    //Auto refresh data at refreshRate
    useEffect(() => {

        function SilentSetNewGlobalState(responseData){

            const valveOpen = GetPropValue(responseData, POINT_ID["Độ mở van"], "point_value");
            const pumpOn = GetPropValue(responseData, POINT_ID["On Off Pump"], "point_value");
            const pumpStart = GetPropValue(responseData, POINT_ID["Start Stop Pump"], "point_value");
            const compOn = GetPropValue(responseData, POINT_ID["On Off Comp"], "point_value");
            const pumpFreq = GetPropValue(responseData, POINT_ID["Tần số bơm"], "point_value");
            const waterTemp = GetPropValue(responseData, POINT_ID["Nhiệt độ nước cấp"], "point_value");

            setGlobalState((prev) => ({
                ...prev,
                autoControl: {
                    ...prev.autoControl,
                    currentWaterTemp: waterTemp
                },
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
            //const GET_URL = "SessionGraph/GetPseudoData";
            try{
                const response  = await silentAxiosInstance.get(GET_URL);
                if(response?.data){
                    SilentSetNewGlobalState(response?.data?.data);
                }else{
                    console.error("Error <!>");
                }
            }catch(err){
                console.error(err);
            }

        };

        const interval = setInterval(async () => {
            fetchData();
        }, refreshRate * 1000);
        return () => clearInterval(interval);
        
    }, [silentAxiosInstance, refreshRate]);

    //#region Auto Turn On/Off Compress in Auto Mode
    useEffect(() => {

        if(controlMode === "auto"){
            async function PressCompButton(field, value) {

                const API_ENDPOINT = "points/save";
                const api_model = {
                    slug: "onoff-may-nen",
                    excerpt: "4|HR|348|0|W",
                    description: "Override Value DO 01",
                    thumbnail: "",
                    point_value: value ? 1 : 0,
                    calib: "0",
                    point_value_type: "0",
                    default_value: "0",
                    access_type: "write",
                    updated_date: "2025-05-29T10:29:07.737Z",
                    status: "active",
                    is_featured: 1,
                    created_date: 946686541377,
                    device_id: "67377d59a814500731ce2da4",
                    unit_id: "670e351354eba1071f4d2b53",
                    schedule_id: null,
                    title: "on/off may nen",
                    company_id: "5cf4eb1557a81c267803c398",
                    author_id: "5cf5013557a81c267803c3a3",
                    id: "386d4a4d31c5dd071c6fe259"
                };

                    try {
                        const response = await axiosInstance.post(API_ENDPOINT, api_model);
                        if(response?.data?.status){
                            callReload && callReload();
                        }else{
                            console.error("Set Comp Start Stop: " + response?.data?.MESSAGE);
                        }
                    } catch (error) {
                        console.error(error)
                    }
            }

            function GetValue(id){
                const targetUnit = globalState?.pointerData?.find(unit => unit?.id === id);
                if(targetUnit){
                    return targetUnit?.point_value;
                }else{
                    return "Unit not found <!>";
                }
            };

            if(GetValue(POINT_ID["Nhiệt độ nước cấp"]) > globalState?.autoControl?.minInputWaterTemp  && !globalState.manualControl.comp){
                PressCompButton("comp", true);
            }

            if(GetValue(POINT_ID["Nhiệt độ nước cấp"]) < globalState?.autoControl?.minInputWaterTemp  && globalState.manualControl.comp){
                PressCompButton("comp", false);
            }
        }
    },[globalState.autoControl.minInputWaterTemp, globalState.autoControl.currentWaterTemp, globalState.manualControl.comp, controlMode]);
    //#endregion
    
    //#region Auto Adjust Valve open percentage in Auto Mode 
    const valveRefreshRate = 5;
    //true for up, false for down
    const [valveAdjustState, setValveAdjustState] = useState(null);
    const valveOpenRef = useRef(null);

    useEffect(() => {

    function limitValve(inputValue) {
        let result = inputValue;
        if(result > 100) return 100;
        if(result < 0) return 0;
        return result;
    }

    async function CallSaveValveValue(field, value) {
        // Your existing API call code here ...
        const API_ENDPOINT = "points/save";
        const api_model = {
            slug: "van-can-bang_w",
            excerpt: "4|HR|612|0|W",
            description: "",
            thumbnail: "",
            point_value: value,
            calib: "0",
            point_value_type: "VALUE",
            default_value: "0",
            access_type: "write",
            updated_date: "2025-06-01T03:39:59.220Z",
            status: "active",
            is_featured: 1,
            created_date: 946687484581,
            device_id: "67377d59a814500731ce2da4",
            unit_id: "386d484531c5dd071c6fe254",
            schedule_id: null,
            title: "van can bang_W",
            company_id: "5cf4eb1557a81c267803c398",
            author_id: "5cf5013557a81c267803c3a3",
            id: "386d4dfca30e03071cec3db3"
        };

        try {
            const response = await axiosInstance.post(API_ENDPOINT, api_model);
            if(response?.data?.status){
                callReload && callReload();
            } else {
                console.error("Auto Set Valve Open: " + response?.data?.MESSAGE);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Initialize ref if null
    if (valveOpenRef.current === null) {
        valveOpenRef.current = 0; // or some initial valve position
    }

    const valveInterval = setInterval(async () => {

        if(valveAdjustState === true){
            let newValue = limitValve(valveOpenRef.current + 5);
            valveOpenRef.current = newValue;  // update ref for next interval
            await CallSaveValveValue("valveOpenPercentage", newValue);
        }
        if(valveAdjustState === false){
            let newValue = limitValve(valveOpenRef.current - 5);
            valveOpenRef.current = newValue;  // update ref for next interval
            await CallSaveValveValue("valveOpenPercentage", newValue);
        }
    }, valveRefreshRate * 1000);

    return () => clearInterval(valveInterval); // clear interval on cleanup
    }, [valveAdjustState]);
    //#endregion

    useEffect(() => {

        if(controlMode === "auto"){

            function GetValue(id){
                const targetUnit = globalState?.pointerData?.find(unit => unit?.id === id);
                if(targetUnit){
                    return targetUnit?.point_value;
                }else{
                    return "Unit not found <!>";
                }
            };
            function GetPressureDiff(){
                    return GetValue(POINT_ID["Áp suất nước cấp"]) - GetValue(POINT_ID["Áp suất nước hồi"]);
            };

            valveOpenRef.current = globalState?.manualControl?.valvePercentage;
            const deltaP = GetPressureDiff();
            if(deltaP > globalState?.autoControl?.volumePressure){
                setValveAdjustState(true);
            }
            if(deltaP < globalState?.autoControl?.volumePressure){
                setValveAdjustState(false);
            }
        }

    },[globalState.autoControl.volumePressure, globalState.manualControl, globalState.controlMode]);
    //#endregion

    //#region Real Time Graph Support
    const [graphState, setGraphState] = useState(false);
    const [initialGraphData, setInitialGraphData] = useState(() => {
        return mockGraphData;
    });
    const [newGraphPoints, setNewGraphPoints] = useState(undefined);

    // temp and pressure
    const [switchGraph, setSwitchGraph] = useState('pressure');
    function switchBetweenGraph(){
        if(switchGraph === 'temp') setSwitchGraph('pressure');
        else setSwitchGraph('temp');
    }

    function CreateNewGraph(){
        
        function GetInitialGraphState(){
            switch(switchGraph){
                case 'pressure': return {
                    graphName: "Áp suất nước",
                    graphUnit: "Pressure (Pa)",
                    currentControlMode: 1,
                    lineData: [
                        {
                            lineName: "Áp suất nước cấp",
                            pointerID: POINT_ID["Áp suất nước cấp"]
                        },
                        {
                            lineName: "Áp suất nước hồi",
                            pointerID: POINT_ID["Áp suất nước hồi"]
                        }
                    ],
                    currentPointerData: globalState.pointerData
                }
                case 'temp': return {
                    graphName: "Nhiệt độ nước",
                    graphUnit: "Temperature (°C)",
                    currentControlMode: 1,
                    lineData: [
                        {
                            lineName: "Nhiệt độ nước cấp",
                            pointerID: POINT_ID["Nhiệt độ nước cấp"]
                        },
                        {
                            lineName: "Nhiệt độ nước hồi",
                            pointerID: POINT_ID["Nhiệt độ nước hồi"]
                        }
                    ],
                    currentPointerData: globalState.pointerData
                }
                default: return 'Graph name out of bound';
            }
        }

        const initialGraphDataModel = GetInitialGraphState();

        const initialGraphData = CreateInitialGraphData(initialGraphDataModel);

        setInitialGraphData(initialGraphData);
    }

    function handleRTGraph(){
        if(!graphState){
            if(controlMode === "off"){
                alert("Turn On To See Graph <!>");
                return;
            }
            CreateNewGraph()
            setGraphState(true);
        }else{
            setGraphState(false);
        }
    }

    const [graphDegree, setGraphDegree] = useState(0.5);
    function changeGraphDegree(field, value){
        setGraphDegree(Number(value));
    }
    const pointerDataRef = useRef(globalState.pointerData);

    // Keep the ref updated with the latest pointerData
    useEffect(() => {
        pointerDataRef.current = globalState.pointerData;
    }, [globalState.pointerData]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (graphState) {
                const graphPoints = MapDataToGraphPoint(initialGraphData, pointerDataRef.current);
                setNewGraphPoints(graphPoints);
            }
        }, graphDegree * 1000);

        return () => clearInterval(interval);
    }, [graphState]);
    //#endregion

    //#region Listen to key board shortcut
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.ctrlKey && event.key === '`') {
                event.preventDefault(); 
                handleRTGraph();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
        window.removeEventListener('keydown', handleKeyDown);
        };
    }, [controlMode, graphState]);

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.ctrlKey && event.key.toLowerCase() === 'q') {
                event.preventDefault(); 
                switchBetweenGraph();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
        window.removeEventListener('keydown', handleKeyDown);
        };
    }, [controlMode, graphState, switchBetweenGraph]);
    //#endregion

    return(
        <div className="chiller-management-wrapper">
            <div className="page-header">
                <img 
                    src={UNIBANNER}
                    alt="uni-banner"
                />
                <div className="header-text">
                    <h2>Hệ thống điều khiển và giám sát Chiller</h2>
                    <h3>Đồ án tốt nghiệp</h3>
                </div>
                <img 
                    src={FALBANNER}
                    alt="fal-banner"
                />
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
                    <InputCase 
                        title={"Tốc độ làm mới dữ liệu"}
                        value={refreshRate}
                        onSubmit={ChangeRefreshRate}
                    />
                    <InputCase 
                        title={"Tốc độ làm mới biểu đồ"}
                        value={graphDegree}
                        onSubmit={changeGraphDegree}
                    />
                </div>
                <div className="image-and-inputs">
                    {graphState ? (
                        <RealTimeVisualGraph 
                            initialGraphData={initialGraphData}
                            newRecords={newGraphPoints}
                            autoScrollWindowSeconds={graphDegree * 60}
                        />
                    ) : (
                        <VisualGraph 
                            pumpState={globalState.manualControl.pumpState}
                            compState={globalState.manualControl.comp}
                            valveState={globalState.manualControl.valvePercentage}
                        />
                    )}  

                    {GetControlElement()}

                </div>
            </div>
        </div>
    );
}

export default ChillerManagement;