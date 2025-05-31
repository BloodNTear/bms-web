import './DisplayCase.css';

function DisplayCase({title, value}){
    return(
        <div className="display-case">
            <label><b>{title}</b></label>
            <p>{value}</p>
        </div>
    )
};

export default DisplayCase;