import './App.css';

import { useLoading } from "./utilities/loadingContext";
import Loading from './utilities/loadingScreen.jsx';
import { Routes, Route } from "react-router";

import {LoginPage} from './pages/loginPage';
import ContentContainer from './pages/dashboard/contentContainer.jsx';

function App() {

  //#region Set up Loading screen
  const { loading } = useLoading();
  //#endregion
  
  return (
    <div className='app'>
      {loading && <Loading />}
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path='/App/*' element={<ContentContainer />} />
      </Routes>
    </div>
  );
}

export default App;
