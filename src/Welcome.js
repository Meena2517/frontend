import React from 'react'
import { useNavigate } from 'react-router-dom';
import './index.css'
import axios from 'axios';


const App = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        let valid = window.confirm('Are you sure you want to logout?');
        if (valid) {
          delete axios.defaults.headers.common['Authorization'];
          localStorage.clear();
          window.history.replaceState(null, null, '/');
          window.location.replace('/');
          try {
            navigate('/');
          } catch (error) {
            console.log(error);
          }
        }
      };
    return (
      <div className='bgImage'>
            <div className='bgImagedark'>
                <div className='d-flex flex-column align-items-center justify-content-center vh-100 text-center'>
                    <h3 className='m-0 text-white'>HEY, HAI {localStorage.getItem('username') && localStorage.getItem('username').toUpperCase()},<br/>WELCOME TO MY WEBSITE</h3>
                    <div>
                        <p className='p-0 m-0 text-white'>Website is under progress.....</p>
                    </div>
                    <div className='mt-3'>
                        <button className='btn btn-light' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
    </div>
  )
}
export default App;