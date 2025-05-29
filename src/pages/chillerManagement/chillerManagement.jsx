import './chillerManagement.css';

import { SystemStatus } from './systemStatus';

function ChillerManagement(){
    return(
        <div className="chiller-management-wrapper">
            <div className="page-header">
                <h2>Hệ thống điều khiển và giám sát Chiller</h2>
                <h3>Đồ án tốt nghiệp</h3>
            </div>
            <div className="page-body">
                <div className="control-display">
                    <SystemStatus />
                </div>
                <div className="image-and-inputs">
                    <div className="image-container">

                    </div>
                    <div className="inputs-container">
                        <div className="statistic-input">

                        </div>
                        <div className="statistic-input">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChillerManagement;