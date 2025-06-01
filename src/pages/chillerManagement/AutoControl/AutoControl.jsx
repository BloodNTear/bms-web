import './AutoControl.css';

import { useEffect, useState } from 'react';

import { InputCase } from '../../../common/InputCase';
import { DisplayCase } from '../../../common/DisplayCase';

function AutoControl({currentAutoData, triggerReload}){
    
    const [autoData, setAutoData] = useState(() =>{
        return currentAutoData;
    });
    useEffect(() => {
        setAutoData(currentAutoData);
    },[currentAutoData]);
    
    return (
        <div className="control-wrapper"
        >
            <div className="control-title">
                <h2>Auto Control</h2>
            </div>
            <div className="statistic-inputs">
                <InputCase 
                    title={"Chỉnh lưu lượng áp (bar)"}
                    field="volumePressure"
                    value={autoData.volumePressure}
                />
                <DisplayCase
                    title={"Tần số bơm min"}
                    value={"25 (Hz)"}
                />
            </div>
        </div>
    )
};

export default AutoControl;