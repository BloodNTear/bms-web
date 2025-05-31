import './ManualControl.css';

import { useState } from 'react';

import { InputButton } from '../../../common/InputButton';
import { InputCase } from '../../../common/InputCase';

function ManualControl({currentManualData, onSubmit}){

    const [manualData, setManualData] = useState(currentManualData);
   
    function handleInput(field, value){
        setManualData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    function handleSubmit(){
        onSubmit && onSubmit(manualData);
    };

    return(
        <div className="control-wrapper"
            tabIndex={0}
            onBlur={handleSubmit}
        >
            <div className="control-title">
                <h2>Manual Control</h2>
            </div>
            <div className="input-buttons">
                <InputButton 
                    title={"PUMP"}
                    field={"pump"}
                    value={manualData.pump}
                    onChange={handleInput}
                />
                <InputButton 
                    title={"COMP"}
                    field={"comp"}
                    value={manualData.comp}
                    onChange={handleInput}
                />
            </div>
            <div className="statistic-inputs">
                <InputCase 
                    title={"Tần số cài (Hz)"}
                    field="frequency"
                    value={manualData.frequency}
                    onChange={handleInput}
                />
                <InputCase 
                    title={"Thời gian khởi động"}
                    field="frequency"
                    value={manualData.bootTime}
                    onChange={handleInput}
                />
                <InputCase 
                    title={"Thời gian dừng"}
                    field="frequency"
                    value={manualData.stopTime}
                    onChange={handleInput}
                />
            </div>
        </div>
    );
};

export default ManualControl;