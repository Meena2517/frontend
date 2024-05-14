import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Loginpage from './Loginpage';
import HomePage from './Homepage';
import FirstPage from './FirstPage';
import Welcomepage from './Welcome';
import Resume from './Resume';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/LoginPage' element={<Loginpage />} />
          <Route path='/FirstPage' element={<FirstPage />} />
          <Route path='/Welcome' element={<Welcomepage />} />
          <Route path='/Resume' element={<ResumeWithViewport />} /> {/* Render ResumeWithViewport instead of Resume */}
          <Route path='*' element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

// Custom component to conditionally render viewport settings for desktop mode
const ResumeWithViewport = () => {
  React.useEffect(() => {
    const setViewportForDesktop = () => {
      if (window.innerWidth >= 1024) {
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=1024');
      }
    };
    setViewportForDesktop();

    return () => {
      // Reset viewport settings when component unmounts
      document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1');
    };
  }, []);

  return <Resume />;
};

export default App;