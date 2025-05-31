import './AutoControl.css';

import { useState } from 'react';

import { InputCase } from '../../../common/InputCase';

function AutoControl({currentAutoData, onSubmit}){
    
    const [autoData, setAutoData] = useState(currentAutoData);

    function handleInput(field, value){
        setAutoData((prev) => ({
            ...prev,
            [field]: value
        }));
    };
    
    function handleSubmit(){
        onSubmit && onSubmit(autoData);
    }

    return (
        <div className="control-wrapper"
             tabIndex={0}
             onBlur={handleSubmit}
        >
            <div className="control-title">
                <h2>Auto Control</h2>
            </div>
            <div className="statistic-inputs">
                <InputCase 
                    title={"Van mở (%)"}
                    field="valvePercentage"
                    value={autoData.valvePercentage}
                    onChange={handleInput}
                />
                <InputCase 
                    title={"Chỉnh lưu lượng áp (bar)"}
                    field="volumePressure"
                    value={autoData.volumePressure}
                    onChange={handleInput}
                />
                <InputCase 
                    title={"Tần số bơm min"}
                    field="minFrequency"
                    value={autoData.minFrequency}
                    onChange={handleInput}
                />
            </div>
        </div>
    )
};

export default AutoControl;