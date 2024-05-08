import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Loginpage from './Loginpage'
// import Form from './Form'
import HomePage from './Homepage'
// import Resume from './Resume';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
// import HomeResume from './HomeResume';
import FirstPage from './FirstPage';
import Welcomepage from './Welcome';
const App = () => {
    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomePage />} />
          <Route path='/LoginPage' element={<Loginpage />} />
          {/* <Route path='/data' element={<Form />} /> */}
          {/* <Route path='/resume' element={<Resume />} /> */}
          {/* <Route path='/Home' element={<HomeResume />} /> */}
          <Route path='/FirstPage' element={<FirstPage />} />
          <Route path='/Welcome' element={<Welcomepage />} />
          <Route path='*' element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App;