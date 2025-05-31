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
                {
                    manualData.pump && (
                        <InputButton 
                            title={"PUMP State"}
                            field={"pumpState"}
                            value={manualData.pumpState}
                            onChange={handleInput}
                            useStartStop={true}
                        />
                    )
                }
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
                    title={"Độ mở van (%)"}
                    field="valvePercentage"
                    value={manualData.valvePercentage}
                    onChange={handleInput}
                />
            </div>
        </div>
    );
};

export default ManualControl;