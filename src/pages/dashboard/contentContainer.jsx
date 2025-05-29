import './contentContainer.css';
import {Routes, Route} from 'react-router';

import { ChillerManagement } from '../chillerManagement';

function ContentContainer(){

    return (
        <div className="content-container">
            <Routes>
                <Route index element={<ChillerManagement />} />
                <Route path='ChillerManagement' element={<ChillerManagement />} />
            </Routes>
        </div>
    )

}

export default ContentContainer;