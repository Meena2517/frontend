import React, { useEffect, useState } from 'react';
import axios from 'axios';
import rplogo from './images/rplogo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [postData, setPostData] = useState({
    name: '',
    number: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://vercel-deploy-bb8k.onrender.com/api/mongodb-data');
      setData(response.data.documents);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('An error occurred while fetching data.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://vercel-deploy-bb8k.onrender.com/api/postmongodb-data', postData);
      console.log('Data posted successfully:', response.data);
      if (response.data) {
        fetchData();
        setPostData({
          name : '',
          number : ''
        })
      }
      setError(null);
    } catch (err) {
      console.error('Error posting data:', err);
      setError('An error occurred while posting data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  // const handleDelete = async (id) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.delete(`http://localhost:3001/api/deleteData/${id}`);
  //     console.log('Data deleted successfully:', response.data);
  //     if (response.data) {
  //       fetchData();
  //     }
  //     setError(null);
  //   } catch (err) {
  //     console.error('Error posting data:', err);
  //     setError('An error occurred while posting data. Please try again later.');
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return (
    <div>
      <div className='p-2'>
        <img src={rplogo} alt='rplogo' width='70px' /> 
      </div>
      <form onSubmit={handleSubmit}>
        <div className='d-flex align-items-center'>
          <div className='col-lg-2 fw-bold'>Employee Name:</div>
          <div className='col-lg-2'>
            <input className='form-control' type='text' name='name' value={postData.name} onChange={handleChange} />
          </div>
          <div className='col-lg-2 fw-bold ms-3'>Employee ID:</div>
          <div className='col-lg-2'>
            <input className='form-control' type='text' name='number' value={postData.number} onChange={handleChange} />
          </div>
          <div className='ms-3'>
            <button type='submit' className='btn btn-primary' disabled={loading}>Add</button>
          </div>
        </div>
      </form>
      {error && <div>Error: {error}</div>}
      <div className='fw-bold mt-3 fs-4'>
        Employees List
      </div>
      {data.length > 0 && 
        <table className='table table-striped table-hover w-50'>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Employee ID</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.number}</td>
                {/* <td><button className='btn btn-danger' onClick={() => {handleDelete(item._id)}}>Delete</button></td> */}
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
};

export default App;
