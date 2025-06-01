import './ManualControl.css';

import { useState, useEffect } from 'react';
import { useAxiosWithAuth } from '../../../api/useAxiosWithAuth';

import { InputButton } from '../../../common/InputButton';
import { InputCase } from '../../../common/InputCase';

function ManualControl({currentManualData, triggerReload}){

    const axiosInstance = useAxiosWithAuth();

    const [manualData, setManualData] = useState(currentManualData);
    useEffect(() => {
        setManualData(currentManualData);
    }, [currentManualData]);


    //#region Functions
    async function PressPumpButton(field, value) {
        const API_ENDPOINT = "points/save";
        const api_model = {
            slug: "onoff-bien-tan-dieu-khien-may-bom",
            excerpt: "4|HR|360|0|W",
            description: "Override Value DO 02",
            thumbnail: "",
            point_value: value ? 1 : 0,
            calib: "0",
            point_value_type: "1",
            default_value: "0",
            access_type: "write",
            updated_date: "2025-06-01T04:17:05.672Z",
            status: "active",
            is_featured: 1,
            created_date: 946686632221,
            device_id: "67377d59a814500731ce2da4",
            unit_id: "670e351354eba1071f4d2b53",
            schedule_id: null,
            title: "on/off bien tan ( dieu khien may bom)",
            company_id: "5cf4eb1557a81c267803c398",
            author_id: "5cf5013557a81c267803c3a3",
            id: "386d4aa831c5dd071c6fe25b"
        };

        if(!value && manualData.pumpState){
            await PressPumpStartButton("pumpState", false);
        }

        try {
            const response = await axiosInstance.post(API_ENDPOINT, api_model);
            if(response?.data?.status){
                triggerReload && triggerReload();
            }else{
                console.error("Set Pump On Off: " + response?.data?.MESSAGE);
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function PressPumpStartButton(field, value) {
        const API_ENDPOINT = "points/save";
        const api_model = {
            slug: "run-command_w",
            excerpt: "4|HR|372|0|W",
            description: "0= dừng, 1=chạy thuận",
            thumbnail: "",
            point_value: value ? 1 : 0,
            calib: "0",
            point_value_type: "1",
            default_value: "1",
            access_type: "write",
            updated_date: "2025-06-01T03:53:08.124Z",
            status: "active",
            is_featured: 1,
            created_date: 946688191089,
            device_id: "67377d59a814500731ce2da4",
            unit_id: "670e351354eba1071f4d2b53",
            schedule_id: null,
            title: "Run Command_W",
            company_id: "5cf4eb1557a81c267803c398",
            author_id: "5cf5013557a81c267803c3a3",
            id: "386d50bf4eb911071abac779"
        };

        try {
            const response = await axiosInstance.post(API_ENDPOINT, api_model);
            if(response?.data?.status){
                triggerReload && triggerReload();
            }else{
                console.error("Set Pump Start Stop: " + response?.data?.MESSAGE);
            }
        } catch (error) {
            console.error(error)
        }
    }

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
                triggerReload && triggerReload();
            }else{
                console.error("Set Pump Start Stop: " + response?.data?.MESSAGE);
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function ChangePumpFreq(field, value) {
        const API_ENDPOINT = "points/save";
        const api_model = {
            slug: "frequency-reference_w",
            excerpt: "4|HR|627|0|W",
            description: "viết tần số xuống Override Value AO 02",
            thumbnail: "",
            point_value: value || 0,
            calib: "0",
            point_value_type: "VALUE",
            default_value: "35",
            access_type: "write",
            updated_date: "2025-06-01T03:33:07.176Z",
            status: "active",
            is_featured: 1,
            created_date: 946687908825,
            device_id: "67377d59a814500731ce2da4",
            unit_id: "670e351354eba1071f4d2b53",
            schedule_id: null,
            title: "Frequency Reference_W",
            company_id: "5cf4eb1557a81c267803c398",
            author_id: "5cf5013557a81c267803c3a3",
            id: "386d4fa44eb911071abac775"
        };

        try {
            const response = await axiosInstance.post(API_ENDPOINT, api_model);
            if(response?.data?.status){
                triggerReload && triggerReload();
            }else{
                console.error("Set Pump Start Stop: " + response?.data?.MESSAGE);
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function ChangeValvePercentage(field, value) {
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
                triggerReload && triggerReload();
            }else{
                console.error("Set Pump Start Stop: " + response?.data?.MESSAGE);
            }
        } catch (error) {
            console.error(error)
        }
    }
    //#endregion

    return(
        <div className="control-wrapper"
            tabIndex={0}
        >
            <div className="control-title">
                <h2>Manual Control</h2>
            </div>
            <div className="input-buttons">
                <InputButton 
                    title={"PUMP"}
                    field={"pump"}
                    value={manualData.pump}
                    onChange={PressPumpButton}
                />
                {
                    manualData.pump && (
                        <InputButton 
                            title={"PUMP State"}
                            field={"pumpState"}
                            value={manualData.pumpState}
                            onChange={PressPumpStartButton}
                            useStartStop={true}
                        />
                    )
                }
                <InputButton 
                    title={"COMP"}
                    field={"comp"}
                    value={manualData.comp}
                    onChange={PressCompButton}
                />
            </div>
            <div className="statistic-inputs">
                <InputCase 
                    title={"Tần số cài (Hz)"}
                    field="frequency"
                    value={manualData.frequency}
                    onSubmit={ChangePumpFreq}
                />
                <InputCase 
                    title={"Độ mở van (%)"}
                    field="valvePercentage"
                    value={manualData.valvePercentage}
                    onSubmit={ChangeValvePercentage}
                />
            </div>
        </div>
    );
};

export default ManualControl;