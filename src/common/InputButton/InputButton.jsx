import './InputButton.css';

function InputButton({title, field, value, onChange, useStartStop = false}){
    
    function handleInput(){
        onChange && onChange(field, !value);
    }
    
    function GetValue(){
        if(!useStartStop){
            return value ? "ON" : "OFF";
        }else{
            return value ? "STOP" : "START"
        }
    }

    return (
        <div className="input-button">
            <label><b>{title}</b></label>   
            <div className={`value-input ${value  ? "on" : ""}`}
                onClick={handleInput}
            >
                <h3>{GetValue()}</h3>
            </div>
        </div>
    )
};

export default InputButton;