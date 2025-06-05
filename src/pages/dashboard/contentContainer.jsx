import './contentContainer.css';
import {Routes, Route} from 'react-router';

import { ChillerManagement } from '../chillerManagement';

import { GraphPage } from '../GraphPage';

function ContentContainer(){

    const pointerArray = ["67EFEEFA-F3EE-4E39-83AB-5D1256BC82D0"];

    return (
        <div className="content-container">
            <Routes>
                <Route index element={<ChillerManagement />} />
                <Route path='ChillerManagement' element={<ChillerManagement />} />

                <Route path="Chart" element={<GraphPage />} />
            </Routes>
        </div>
    )

}

export default ContentContainer;