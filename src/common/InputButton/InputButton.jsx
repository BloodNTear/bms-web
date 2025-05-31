import './InputButton.css';

function InputButton({title, field, value, onChange}){
    
    function handleInput(){
        onChange && onChange(field, !value);
    }
    
    return (
        <div className="input-button">
            <label><b>{title}</b></label>   
            <div className={`value-input ${value ? "on" : ""}`}
                onClick={handleInput}
            >
                <h3>{value ? "ON" : "OFF"}</h3>
            </div>
        </div>
    )
};

export default InputButton;