import './AutoControl.css';

import { useEffect, useState } from 'react';

import { useAxiosWithAuth } from '../../../api/useAxiosWithAuth';

import { InputCase } from '../../../common/InputCase';
import { InputButton } from '../../../common/InputButton';
import { DisplayCase } from '../../../common/DisplayCase';

function AutoControl({currentAutoData, currentManualData,
    onDataSubmit, triggerReload
}){
    
    const axiosInstance = useAxiosWithAuth();

    const [autoData, setAutoData] = useState(() =>{
        return currentAutoData;
    });

    useEffect(() => {
        setAutoData(currentAutoData);
    },[currentAutoData]);

    const [manualData, setManualData] = useState(currentManualData);
    useEffect(() => {
        setManualData(currentManualData);
    }, [currentManualData]);

    useEffect(() => {
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

        ChangePumpFreq("pumpFreq", 70);
    },[]);

    return (
        <div className="control-wrapper"
        >
            <div className="control-title">
                <h2>Auto Control</h2>
            </div>
             <div className="input-buttons">
                <InputButton 
                    title={"PUMP"}
                    field={"pump"}
                    value={manualData?.pump}
                />
                {
                    manualData.pump && (
                        <InputButton 
                            title={"PUMP State"}
                            field={"pumpState"}
                            value={manualData?.pumpState}
                            useStartStop={true}
                        />
                    )
                }
                <InputButton 
                    title={"COMP"}
                    field={"comp"}
                    value={manualData.comp}
                />
            </div>
            <div className="statistic-inputs">
                <InputCase 
                    title={"Chỉnh lưu lượng áp (bar)"}
                    field="volumePressure"
                    value={autoData.volumePressure}
                    onSubmit={onDataSubmit}
                />
                <InputCase 
                    title={"Nhiệt độ nước cấp tối thiểu"}
                    field="minInputWaterTemp"
                    value={autoData.minInputWaterTemp}
                    onSubmit={onDataSubmit}
                />
                <DisplayCase
                    title={"Tần số bơm min"}
                    value={"35 (Hz)"}
                />
            </div>
        </div>
    )
};

export default AutoControl;