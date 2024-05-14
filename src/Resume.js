import React, { useState } from 'react';
import { Col, Row, Button, Form } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';

const Resume = () => {
    const baseURL = 'https://vercel-deploy-bb8k.onrender.com'
    const [formData, setFormData] = useState({
        name : '',
        gender : 'male',
        dob : '',
        fatherName : '',
        designation : '',
        email : '',
        mobileNumber : '',
        address1 : '',
        address2 : '',
        objective : '',
        skills : [''],
        experience: [''],
        photo: null,
        declaration : '',
        place : ''
     })

     const [rows, setRows] = useState([{ year: '', degree: '', institute: '', university: '', cgpa: '' }]);

    //  const addRow = () => {
    //     setTableData(prevTableData => [
    //         ...prevTableData,
    //         { year: '', degree: '', institute: '', university: '', cgpa: '' }
    //     ]);
    //     setRows(prevRows => [
    //         ...prevRows,
    //         { year: '', degree: '', institute: '', university: '', cgpa: '' }
    //     ]);
    // };


    const addRow = () => {
        setRows([...rows, { year: '', degree: '', institute: '', university: '', cgpa: '' }]);
    };

    

    const addPoint = () => {
        setFormData(prevState => ({
            ...prevState,
            experience: [...prevState.experience, '']
        }));
    };

    const addSkillPoint = () => {
        setFormData(prevState => ({
            ...prevState,
            skills: [...prevState.skills, '']
        }));
    };

    const handlePointChange = (e, index) => {
        const { value } = e.target;
        const nameValue = /^[A-Za-z\s\-,.!?]*$/.test(value) ? value : formData.experience[index];
        setFormData(prevState => {
            const updatedExperience = [...prevState.experience];
            updatedExperience[index] = nameValue;
            return {
                ...prevState,
                experience: updatedExperience
            };
        });
    };

    const handleSkillPointChange = (e, index) => {
        const { value } = e.target
        const nameValue = /^[A-Za-z\s]*$/.test(value) ? value : formData.skills[index];
        setFormData(prevState => {
            const updatedSkills = [...prevState.skills];
            updatedSkills[index] = nameValue;
            return {
                ...prevState,
                skills: updatedSkills
            };
        });
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
    
        const isNumericField = ["mobileNumber"].includes(name);
        const numericValue = isNumericField ? /^\d*$/.test(value) ? value : formData[name] : value;
    
        const isNameField = ["name","fatherName","designation","address1","address2","place"].includes(name);
        const nameValue = isNameField ? /^[A-Za-z\s]*$/.test(value) ? value : formData[name] : value;

        const isObjectiveField = ["objective", "declaration"].includes(name);
        const objectiveValue = isObjectiveField ? /^[A-Za-z\s\-,.!?]*$/.test(value) ? value : formData[name] : value;
    
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: isNumericField ? numericValue : (isNameField ? nameValue : objectiveValue)
        }));
    };
    



 const handleTableDataChange = (e, index) => {
        const { name, value } = e.target;
        const updatedRows = [...rows];
        updatedRows[index][name] = value;
        setRows(updatedRows);
    };




    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({
                ...formData,
                photo: reader.result // Set the base64 representation of the photo
            });
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };    
     
    


      const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formData);
        const isAnyFieldEmpty = Object.values(formData).some(value => {
            if (value === '' || (Array.isArray(value) && value.some(item => item === ''))) {
                return true;
            }
            if (value === null || value === undefined) {
                return true;
            }
            return false;
        });
        const isAnyRowEmpty = rows.some(row => Object.values(row).some(value => value === ''));
        console.log(isAnyFieldEmpty,isAnyRowEmpty);
        if (isAnyFieldEmpty || isAnyRowEmpty) {
            alert('Please fill in all fields before generating the PDF.');
            return;
        }
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('photo', formData.photo);
            formDataToSend.append('gender', formData.gender);
            formDataToSend.append('dob', moment(formData.dob).format("DD-MM-YYYY"));
            formDataToSend.append('fatherName', formData.fatherName);
            formDataToSend.append('designation', formData.designation);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('mobileNumber', formData.mobileNumber);
            formDataToSend.append('address1', formData.address1);
            formDataToSend.append('address2', formData.address2);
            formDataToSend.append('objective', formData.objective);
            formDataToSend.append('skills', JSON.stringify(formData.skills));
            formDataToSend.append('experience', JSON.stringify(formData.experience));
            formDataToSend.append('tableData', JSON.stringify(rows));
            formDataToSend.append('declaration', formData.declaration);
            formDataToSend.append('place', formData.place);
            formDataToSend.append('loginEmail', localStorage.getItem('email'));
            const result = await axios.post(baseURL + '/smr/generatePDF', formDataToSend);
            if (result.data.status) {
                console.log(result.data.data.pdf);
                const binaryPdf = atob(result.data.data.pdf);
                const arrayBuffer = new ArrayBuffer(binaryPdf.length);
                const uint8Array = new Uint8Array(arrayBuffer);
                for (let i = 0; i < binaryPdf.length; i++) {
                    uint8Array[i] = binaryPdf.charCodeAt(i);
                }
                const blob = new Blob([uint8Array], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                window.open(url);
                }
                else {
                    alert('Failed to generate PDF');
                }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     try {
    //         const postData = {
    //             formData: formData, 
    //             tableData: tableData
    //         };
    //         const response = await axios.post('http://localhost:3240/smr/generatePDF', postData, {
    //             responseType: 'blob'
    //         });
    //         if (response.status === 200) {
    //             const wordBlob = response.data;
    //             saveAs(wordBlob, 'converted_document.docx');
    //             alert('PDF converted to Word successfully!');
    //         } else {
    //             console.error('Error converting PDF to Word:', response.statusText);
    //             alert('An error occurred while converting PDF to Word. Please try again.');
    //         }
    //     } catch (error) {
    //         console.error('Error converting PDF to Word:', error);
    //         alert('An error occurred while converting PDF to Word. Please try again.');
    //     }
    // };

    

    const handleDeleteRow = (index) => {
        const updatedExperience = [...formData.experience];
        updatedExperience.splice(index, 1);
        setFormData(prevFormData => ({
            ...prevFormData,
            experience: updatedExperience
        }));
    }


    const handleSkillDeleteRow = (index) => {
        const updatedSkills = [...formData.skills];
        updatedSkills.splice(index, 1);
        setFormData(prevFormData => ({
            ...prevFormData,
            skills: updatedSkills
        }));
    }


    // Function to clear a specific item from localStorage
function clearSpecificItemFromLocalStorage(itemId) {
    localStorage.removeItem(itemId);
}

// Attach event listener to the browser's popstate event (triggered when the back button is clicked)
window.addEventListener('popstate', function(event) {
    // Call the function to clear a specific item from localStorage
    clearSpecificItemFromLocalStorage('id');
    clearSpecificItemFromLocalStorage('OpenPage');
});



    // function arrayBufferToBase64(buffer) {
    //     let binary = '';
    //     const bytes = new Uint8Array(buffer);
    //     const len = bytes.byteLength;
    //     for (let i = 0; i < len; i++) {
    //       binary += String.fromCharCode(bytes[i]);
    //     }
    //     return btoa(binary);
    //   }
    



  return (
    <div className='bgImage'>
        <div className='bgImagedark p-5'>
  <div className='resumeblur text-white'>
      <div className='container p-5'>
        <div className='text-center'>
            <h3 className='text-decoration-underline'>RESUME</h3>
        </div>
      </div>

      {/* <div className='container-fluid px-5'>
        <div className='mb-4'>
            <h4 className='text-decoration-underline'>Personal Details:-</h4>
        </div>
      </div> */}

      <div className='container-fluid px-lg-5 px-md-5'>
            <Row>
                <Col lg={4} md={6} sm={12} className='d-flex align-items-center mb-4'>
                    <Col lg={4} md={4} sm={6}>
                        <label className='fw-bold'>Name:</label>
                    </Col>
                    <Col lg={8} md={8} sm={6}>
                        <input className='form-control' type='text' placeholder='Enter the Name' name='name' value={formData.name} onChange={(e) => handleChange(e, 0)}/>
                    </Col>
                </Col>
                <Col lg={4} md={6} sm={12} className='d-flex align-items-center mb-4'>
                    <Col lg={4} md={4} sm={6}>
                        <label className='fw-bold'>Gender:</label>
                    </Col>
                    <Col lg={8} md={8} sm={6} className='d-flex justify-content-evenly'>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="gender" id="male" value="male" checked={formData.gender === 'male'} onChange={(e) => handleChange(e, 0)}/>
                            <label className="form-check-label" htmlFor="male">Male</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="gender" id="female" value="female" checked={formData.gender === 'female'} onChange={(e) => handleChange(e, 0)}/>
                            <label className="form-check-label" htmlFor="female">Female</label>
                        </div>
                    </Col>
                </Col>
                <Col lg={4} md={6} sm={12} className='d-flex align-items-center mb-4'>
                    <Col lg={4} md={4} sm={6}>
                        <label className='fw-bold'>Date of Birth:</label>
                    </Col>
                    <Col lg={8} md={8} sm={6}>
                        <input className='form-control' type='date' placeholder='Enter the Date of Birth' max={(moment(moment().toDate())).format("YYYY-MM-DD")} name='dob' value={formData.dob} onChange={handleChange}/>
                    </Col>
                </Col>
                <Col lg={4} md={6} sm={12} className='d-flex align-items-center mb-4'>
                    <Col lg={4} md={4} sm={6}>
                        <label className='fw-bold'>Father Name:</label>
                    </Col>
                    <Col lg={8} md={8} sm={6}>
                        <input className='form-control' type='text' placeholder='Enter the Father Name' name='fatherName' value={formData.fatherName} onChange={handleChange}/>
                    </Col>
                </Col>
                <Col lg={4} md={6} sm={12} className='d-flex align-items-center mb-4'>
                    <Col lg={4} md={4} sm={6}>
                        <label className='fw-bold'>Designation:</label>
                    </Col>
                    <Col lg={8} md={8} sm={6}>
                        <input className='form-control' type='text' placeholder='Enter the Designation' name='designation' value={formData.designation} onChange={handleChange}/>
                    </Col>
                </Col>
                <Col lg={4} md={6} sm={12} className='d-flex align-items-center mb-4'>
                    <Col lg={4} md={4} sm={6}>
                        <label className='fw-bold'>Email:</label>
                    </Col>
                    <Col lg={8} md={8} sm={6}>
                        <input className='form-control' type='email' placeholder='Enter the Email id' name='email' value={formData.email} onChange={handleChange}/>
                    </Col>
                </Col>
                <Col lg={4} md={6} sm={12} className='d-flex align-items-center mb-4'>
                    <Col lg={4} md={4} sm={6}>
                        <label className='fw-bold'>Mobile Number:</label>
                    </Col>
                    <Col lg={8} md={8} sm={6}>
                        <input className='form-control' type='text' placeholder='Enter the Mobile Number' name='mobileNumber' maxLength={10} value={formData.mobileNumber} onChange={handleChange}/>
                    </Col>
                </Col>
                <Col lg={4} md={6} sm={12} className='d-flex align-items-center mb-4'>
                    <Col lg={4} md={4} sm={6}>
                        <label className='fw-bold'>Address 1:</label>
                    </Col>
                    <Col lg={8} md={8} sm={6}>
                        <input className='form-control' type='text' placeholder='Enter the Address 1' name='address1' value={formData.address1} onChange={handleChange}/>
                    </Col>
                </Col>
                <Col lg={4} md={6} sm={12} className='d-flex align-items-center mb-4'>
                    <Col lg={4} md={4} sm={6}>
                        <label className='fw-bold'>Address 2:</label>
                    </Col>
                    <Col lg={8} md={8} sm={6}>
                        <input className='form-control' type='text' placeholder='Enter the Address 2' name='address2' value={formData.address2} onChange={handleChange}/>
                    </Col>
                </Col>
                <Col lg={4} md={6} sm={12} className=' mb-4'>
                <Col lg={4} md={4} sm={6}>
                    <label className='fw-bold'>Skills:</label>
                </Col>
                <Col lg={8} md={8} sm={6}>
                <ul>
            {formData.skills.map((point, index) => (
                <div key={index}>
                <li className='mt-3'>
                    <textarea
                        className='form-control'
                        placeholder={`Skill ${index + 1}`}
                        value={point}
                        onChange={(e) => handleSkillPointChange(e, index)}
                    />
                </li>
                <Button className='bg-danger mt-2' onClick={() => handleSkillDeleteRow(index)}>Delete</Button> 
                </div>
            ))}
        </ul>
        <div className='d-flex justify-content-end'><Button onClick={addSkillPoint}>Add Skill</Button></div>
                </Col>
            </Col>
            <Col lg={4} md={6} sm={12} className='d-flex flex-column align-items-center mb-4'>
            {formData.photo != null ? <div>
                <img src={`${formData.photo}`} alt="150x150" width="150px" height="150px"/>
            </div> : <div className='d-flex justify-content-center align-items-center  fw-bold' style={{border : '1px solid black', width : '150px', height : '150px'}}>Add Photo</div>}
            <div className='d-flex align-items-center mt-3'>
    <Col lg={4} md={4} sm={6}>
        <label className='fw-bold'>Photo:</label>
    </Col>
    <Col lg={8} md={8} sm={6}>
        <input className='form-control' type='file' accept='image/*' onChange={(e) => handlePhotoChange(e)} />
    </Col>
    </div>
</Col>
<Col lg={4} md={6} sm={12} className='d-flex align-items-center mb-4'>
                    <Col lg={4} md={4} sm={6}>
                        <label className='fw-bold'>Place:</label>
                    </Col>
                    <Col lg={8} md={8} sm={6}>
                        <input className='form-control' type='text' placeholder='Enter the Place' name='place' value={formData.place} onChange={handleChange}/>
                    </Col>
                </Col>
                <Col lg={12} md={12} sm={12} className='mb-4'>
                    <Col lg={4} md={4} sm={12}>
                        <label className='fw-bold'>Educational Qualification:</label>
                    </Col>
                    <Col lg={12} md={12} sm={12} className='mt-2'>
    <table className='table table-bordered table-responsive'>
        <thead className='table-primary'>
            <tr className='text-center'>
                <th>Year</th>
                <th>Degree / Examination</th>
                <th>Institute</th>
                <th>Board / University</th>
                <th>% / CGPA</th>
            </tr>
        </thead>
       <tbody>
    {rows.map((row, index) => (
        <tr key={index}>
            <td><input className='form-control' type='text' name='year' value={row.year} onChange={(e) => handleTableDataChange(e, index)} /></td>
            <td><input className='form-control' type='text' name='degree' value={row.degree} onChange={(e) => handleTableDataChange(e, index)} /></td>
            <td><input className='form-control' type='text' name='institute' value={row.institute} onChange={(e) => handleTableDataChange(e, index)} /></td>
            <td><input className='form-control' type='text' name='university' value={row.university} onChange={(e) => handleTableDataChange(e, index)} /></td>
            <td><input className='form-control' type='text' name='cgpa' value={row.cgpa} onChange={(e) => handleTableDataChange(e, index)} /></td>
        </tr>
    ))}
</tbody>
    </table>
    <div className='d-flex justify-content-end'><Button onClick={addRow}>Add Row</Button></div>
</Col>

                </Col>
                <Col lg={12} md={12} sm={12} className=' mb-4'>
                <Col lg={4} md={4} sm={6}>
                    <label className='fw-bold'>Experience:</label>
                </Col>
                <Col lg={12} md={12} sm={12}>
                <ul>
            {formData.experience.map((point, index) => (
                <div key={index} className=''>
                <li className='mt-3'>
                    <textarea
                        className='form-control'
                        placeholder={`Experience ${index + 1}`}
                        value={point}
                        onChange={(e) => handlePointChange(e, index)}
                    />
                </li>
                                                <Button className='bg-danger mt-2' onClick={() => handleDeleteRow(index)}>Delete</Button> 
                                                </div>   
            ))}
        </ul>   
        <div className='d-flex justify-content-end'><Button onClick={addPoint}>Add Experience</Button></div>
                </Col>
            </Col>
                <Col lg={12} md={12} sm={12} className='mb-4'>
                    <Col lg={4} md={4} sm={6}>
                        <label className='fw-bold'>Objective:</label>
                    </Col>
                    <Col lg={12} md={12} sm={12} className='mt-3'>
                        <textarea className='form-control' placeholder='Enter the Objective' name='objective' value={formData.objective} onChange={handleChange}/>
                    </Col>
                </Col>
                <Col lg={12} md={12} sm={12} className='mb-4'>
                    <Col lg={4} md={4} sm={6}>
                        <label className='fw-bold'>Declaration:</label>
                    </Col>
                    <Col lg={12} md={12} sm={12} className='mt-3'>
                        <textarea className='form-control' placeholder='Enter the Declaration' name='declaration' value={formData.declaration} onChange={handleChange}/>
                    </Col>
                </Col>
            </Row>
            <Form onSubmit={handleSubmit}>
            <div className='text-center pb-3'>
            <Button type='submit'>ADD RESUME</Button>
        </div>
        </Form>
      </div>
      </div>
    </div>
    </div>
  )
}

export default Resume
