import './systemStatus.css';

import { useState, useEffect } from 'react';

import {useAxiosWithAuth} from '../../../api/useAxiosWithAuth';
import {InfoDisplayCase} from './InfoDisplayCase';
import { mockData } from '../../../mocks/mockData';

function SystemStatus({sytemData}){

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
    },[axiosInstance])

    function GetValue(unitID){
        const targetUnit = systemData?.find(unit => unit?.unit_id === unitID);
        if(targetUnit){
            return targetUnit?.point_value;
        }else{
            return "Unit not found <!>";
        }
    }

    return(
        <div className="system-status-wrapper">
            <div className="title">
                <h2>Hệ thống</h2>
            </div>
            <div className="control-buttons">
                <div className="control-button"
                     style={{backgroundColor: 'rgba(255, 0, 0, 0.5)'}}
                >
                    <h3>OFF</h3>
                </div>
                <div className="control-button"
                    style={{backgroundColor: 'rgba(255, 234, 0, 0.5)'}}
                >
                    <h3>MAN</h3>
                </div>
                <div className="control-button"
                    style={{backgroundColor: 'rgba(0, 255, 8, 0.5)'}}
                >
                    <h3>AUTO</h3>
                </div>
            </div>
            <div className="info-display">
                <InfoDisplayCase 
                    title="Áp suất nước cấp:"
                    info={GetValue("386d46c29340f70714423592")}
                />
                <InfoDisplayCase 
                    title="Áp suất nước hồi:"
                    info={GetValue("386d4ea1a30e03071cec3db5")}
                />
                <InfoDisplayCase 
                    title="Nhiệt độ nước cấp:"
                    info={GetValue("386d48cda30e03071cec3da5")}
                />
                <InfoDisplayCase 
                    title="Nhiệt độ nước hồi:"
                    info={GetValue("386d46c29340f70714423592")}
                />
                <InfoDisplayCase 
                    title="Chênh lệch áp suất:"
                    info={GetValue("")}
                />
                <InfoDisplayCase 
                    title="Tần số bơm:"
                    info={GetValue("386d5df0fadcf8071c95403a")}
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