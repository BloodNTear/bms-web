import './InputCase.css';



function InputCase({title, field, value, onChange}){
    
    function handleInput(inputValue){
        onChange && onChange(field, inputValue);
    }

    return(
        <div className="input-case">
            <label>{title}</label>
            <input 
                type='number'
                value={value}
                onChange={(e) => handleInput(e.target.value)}
            />
        </div>
    )
};

export default InputCase;