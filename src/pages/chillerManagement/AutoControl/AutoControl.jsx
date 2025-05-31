import './AutoControl.css';

import { useState } from 'react';

import { InputCase } from '../../../common/InputCase';
import { DisplayCase } from '../../../common/DisplayCase';

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
                    title={"Chỉnh lưu lượng áp (bar)"}
                    field="volumePressure"
                    value={autoData.volumePressure}
                    onChange={handleInput}
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