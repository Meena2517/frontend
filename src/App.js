import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [postData, setPostData] = useState({
    name: '',
    number: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([])

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
      if(response.data) {
        const response = await axios.get('https://vercel-deploy-bb8k.onrender.com/api/mongodb-data')
        console.log(response.data.documents);
        setData(response.data.documents);
      }
      setError(null);
    } catch (err) {
      console.error('Error posting data:', err);
      setError('An error occurred while posting data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={postData.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Number:
          <input type="text" name="number" value={postData.number} onChange={handleChange} />
        </label>
        <br />
        <button type="submit" disabled={loading}>Submit</button>
      </form>
      {error && <div>Error: {error}</div>}
      {data.length > 0 && <table>
        <tr>
          <th>Employee Name</th>
          <th>Emplyee id</th>
        </tr>
        {data.map((item, index) => (
          <tr key={index}>
          <td>{item.name}</td>
          <td>{item.number}</td>
          </tr>
        )
      )}</table>}
    </div>
  );
};

export default App;
