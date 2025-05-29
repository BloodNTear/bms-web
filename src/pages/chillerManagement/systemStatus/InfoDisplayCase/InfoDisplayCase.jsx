import './InfoDisplayCase.css';

function InfoDisplayCase({title, info}){
    return (
        <div className="info-display-case">
            <h3>{title}</h3>
            <p>{info}</p>
        </div>
    )
}

export default InfoDisplayCase;