import React, { useState } from 'react'
import { useEffect, useRef } from 'react'
import axios from 'axios'
// import RPlogo from './images/rp_logo-removebg-preview.png'
import { useNavigate } from 'react-router-dom'
// import LoginComponents from './LoginComponents'
import Loginloading from './Loginloading'
import PopUpMessage from './PopUpMessage'

const Loginpage = () => {

    const baseURL = 'https://vercel-deploy-bb8k.onrender.com'
    const navigate = useNavigate();
    useEffect(() => {
        let logout = sessionStorage.getItem('LoggedIn');
        if (logout === 'true') {
            navigate('/data')
        }
    }, [navigate])


    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const initialState = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        loginEmail: '',
        loginPassword: '',
        generatedCaptcha: '',
        userCaptcha: '',
        otp: ['', '', '', ''],
        enteredOTP: '',
        showLogin: true,
        showRegister: false,
        showForgotPassword: false,
        Showforgototpinput: true,
        showOtpInput: false,
        showPasswordInput: false,
        showInputFields: false,
        showSendOtpButton: true,
        showVerifyButton: false,
        isLoading: false,
        modal: false,
        modalregister: false,
        modalforgotpassword: false,
}

    const [logindatas, setLogindatas] = useState(initialState);

  const updateLogindatas = (newData) => {
    setLogindatas((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };



    //Signup functionality
    //store the data
    const handleSignupdata = (col, value) => {
        updateLogindatas({[col]: value})
    }
    //check all validations
    const validateForm = () => {
        const { username, email, password, confirmpassword } = logindatas;
        const usernameValid = username !== ''
        const emailValid = email !== ''
        const passwordValid = password !== ''
        const confirmPasswordValid = confirmpassword !== ''
        let alphabetpattern = /[A-za-z]/
        let numberspattern = /[0-9]/;
        let emailpattern = /^[a-zA-Z0-9._-]+@(gmail\.com|criticalriver\.com)$/;
        let charpattern = /[!@#$%^&*()_+-={}|[;':",./<>?]/;
        let upperCase = /[A-Z]/
        let lowerCase = /[a-z]/
        let usernamevalidation = alphabetpattern.test(username) && !numberspattern.test(username)
        let emailvalidation = emailpattern.test(email);
        let passwordValidations = password.length > 8 && lowerCase.test(password) && upperCase.test(password) && numberspattern.test(password) && charpattern.test(password)
        let samepassword = password === confirmpassword


        !usernameValid && !emailValid && !passwordValid && !confirmPasswordValid && alert('Please fill all the fields')
        let namemessage = usernameValid ? (usernamevalidation ? document.getElementById('AddNameError').innerHTML = '' : document.getElementById('AddNameError').innerHTML = 'enter valid Username') : document.getElementById('AddNameError').innerHTML = 'fill the input field'
        let emailmessage = emailValid ? (emailvalidation ? document.getElementById('AddEmailError').innerHTML = '' : document.getElementById('AddEmailError').innerHTML = 'enter valid Email') : document.getElementById('AddEmailError').innerHTML = 'fill the input field'
        let passwordmessgae = passwordValid ? (passwordValidations ? document.getElementById('AddPasswordError').innerHTML = '' : document.getElementById('AddPasswordError').innerHTML = 'Password must be have minimum length 8 characters, one uppercase, one character, one number, lowecase') : document.getElementById('AddPasswordError').innerHTML = 'fill the input field'
        let confirmpasswordmessage = confirmPasswordValid ? samepassword ? document.getElementById('AddConfirmPasswordError').innerHTML = '' : document.getElementById('AddConfirmPasswordError').innerHTML = 'password must be same' : document.getElementById('AddConfirmPasswordError').innerHTML = 'fill the input field'

        const isFormValid = namemessage === '' && emailmessage === '' && passwordmessgae === '' && confirmpasswordmessage === '';

        return isFormValid;
    };

    const handleVerifyButton = async () => {
        let emailpattern = /^[a-zA-Z0-9._-]+@(gmail\.com|criticalriver\.com)$/;
        let emailvalidation = emailpattern.test(logindatas.email);
        let emailmessage = logindatas.email ? (emailvalidation ? document.getElementById('AddEmailError').innerHTML = '' : document.getElementById('AddEmailError').innerHTML = 'enter valid Email') : document.getElementById('AddEmailError').innerHTML = 'fill the input field'
        if (emailmessage === '') {
            updateLogindatas({isLoading : true})
            try {
                const response = await axios.post(baseURL + '/smr/sendotp', {
                    email: logindatas.email,
                });
                if (response.data.status) {
                    updateLogindatas({showSendOtpButton : false, showOtpInput : true, showVerifyButton : true})
                } else {
                    response.data.message === 'Email already exists'
                        ? (document.getElementById('AddEmailError').innerHTML = 'Already Exist')
                        : (document.getElementById('AddEmailError').innerHTML = '');
                    }
            } catch (error) {
                console.error('API Error:', error);
            } finally {
                updateLogindatas({isLoading : false})
            }
        } else {
            updateLogindatas({showOtpInput : false})
        }
    }

    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newOTP = [...logindatas.otp];
            newOTP[index] = value;
            if (newOTP.every((digit) => digit !== '')) {
                const enteredOTP = newOTP.join(''); // Combine the OTP digits
                updateLogindatas({enteredOTP : enteredOTP})
            }
            if (value.length === 1 && index < 3) {
                inputRefs[index + 1].current.focus();
            }
            updateLogindatas({otp : newOTP})
        }
    };

    const handleVerifyOtp = () => {
        const { email, enteredOTP } = logindatas
        axios
            .post(baseURL + "/smr/verifyotp", { email, otp: enteredOTP })
            .then((response) => {
                if (response.data.status) {
                    updateLogindatas({otp : ['','','',''], showOtpInput : false, showInputFields: true})
                } else {
                    alert('invalid otp')
                }
            });
    };

    //handle the register 
    const handleRegister = (e) => {
        e.preventDefault();
        const { username, email, password } = logindatas
        try {
            if (validateForm()) {
                axios.post(baseURL + '/smr/signupdata', {
                    username: username,
                    email: email,
                    password: password,
                }).then(() => {
                    updateLogindatas({username: '',
                    email: '',
                    password: '',
                    confirmpassword: '',
                    showVerifyButton : false,
                    showSendOtpButton : true,
                    showOtpInput : false,
                    showInputFields : false
                    })
                })
                setRegisterPopup(true);
                setTimeout(() => {
                    updateLogindatas({showLogin : true})
                }, 2000)
            }
        }
        catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred while logging in. Please try again later.');
        }
        finally {
            updateLogindatas({isLoading : false})

        }
    }












    //For Login functionality   
    const handleLogindata = (e) => {
        const {name, value} = e.target;
        setLogindatas(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    



    const loginvalidations = () => {
        const { loginEmail, loginPassword } = logindatas
        // const { loginEmail, loginPassword, generatedCaptcha, userCaptcha } = logindatas
        const emailValid = loginEmail !== ''
        const passwordValid = loginPassword !== ''
        if (!loginEmail && !loginPassword) {
            alert('Please fill in all inputs');
            document.getElementById('emailError').innerHTML = 'fill the input field';
            document.getElementById('passwordError').innerHTML = 'fill the input field';
            // document.getElementById('captchaerror').innerHTML = 'fill the input field'
        }
        else {
            let emailmessage = emailValid ? document.getElementById('emailError').innerHTML = '' : document.getElementById('emailError').innerHTML = 'fill the input field'
            let passwordmessage = emailValid ? passwordValid ? document.getElementById('passwordError').innerHTML = '' : document.getElementById('passwordError').innerHTML = 'fill the input field' : document.getElementById('passwordError').innerHTML = ''
            // let captchamessage = generatedCaptcha === userCaptcha ? document.getElementById('captchaerror').innerHTML = '' : document.getElementById('captchaerror').innerHTML = 'invalid Captcha'
            let validfield = emailmessage === '' && passwordmessage === '' ;
            // && captchamessage === ''
            return validfield
        }
    }

    const handlelogin = async (e) => {
        e.preventDefault();
        loginvalidations();
        const { loginEmail, loginPassword } = logindatas;
        // const { loginEmail, loginPassword, generatedCaptcha, userCaptcha } = logindatas;
        if (loginEmail) {
            console.log('Current time:', new Date());
            updateLogindatas({isLoading : true})
            try {
                const response = await axios.post(baseURL + '/smr/checklogin', {
                    email: loginEmail,
                    password: loginPassword,
                });
                if (response.data.status === true) {
                    setLoginPopup(true);
                    const token = response.data.data.token;
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    localStorage.setItem('LoggedIn', 'true');
                    localStorage.setItem('username', `${response.data.data.username}`);
                    localStorage.setItem('lastlogintime', `${response.data.data.lastLoginTime}`)
                    localStorage.setItem('email', `${response.data.data.email}`);
                    localStorage.setItem('authToken', token);
                    navigate(localStorage.getItem('page'))
                } else {
                    loginEmail !== '' ? response.data.message === 'Invalid email' ? document.getElementById('emailError').innerHTML = 'Invalid email' : document.getElementById('emailError').innerHTML = '' : document.getElementById('emailError').innerHTML = 'fill the input field'
                    loginPassword !== '' ? response.data.message === 'Invalid password' ? document.getElementById('passwordError').innerHTML = 'Invalid password' : document.getElementById('passwordError').innerHTML = '' : document.getElementById('passwordError').innerHTML = 'fill the input field'
                }
            } catch (error) {
                console.error('Error logging in:', error);
                alert('An error occurred while logging in. Please try again later.');
            }
            finally {
                updateLogindatas({isLoading : false})
            }
        }
    };

    //Forgot password functionality
    const handleForgotpasswordChange = (col1, value) => {
        updateLogindatas({[col1] : value})
    }

    const handleForgotpassword = async (e) => {
        e.preventDefault();
        updateLogindatas({isLoading : true})
        const { email } = logindatas;
        console.log(email);
        try {
            const response = await axios.post(baseURL + '/smr/checkforgotpassword', {
                email: email,
            });
            console.log(response.data.status);
            if (response.data.status) {
                document.getElementById('emailError').innerHTML = ''
                updateLogindatas({_id: response.data.data._id,
                    showOtpInput : true,
                    Showforgototpinput : false,})
            } else {
                email !== '' ? response.data.message === 'Invalid email' ? document.getElementById('emailError').innerHTML = 'Invalid email' : document.getElementById('emailError').innerHTML = '' : document.getElementById('emailError').innerHTML = 'fill the input field'
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred while logging in. Please try again later.');
        }
        finally {
            updateLogindatas({isLoading : false})
        }
    }

    const handleForgotVerifyOtp = async (e) => {
        e.preventDefault();
        updateLogindatas({isLoading : true})
        try {
            const { email, enteredOTP } = logindatas;
            const response = await axios.post(baseURL + "/smr/Forgotverifyotp", { email, otp: enteredOTP });
            if (response.data.status) {
                updateLogindatas({otp : ['','','',''], showPasswordInput : true, showOtpInput : false})
            } else {
                alert('invalid otp');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            updateLogindatas({isLoading : false})
        }
    };

    const handleUpdatepassword = (e) => {
        e.preventDefault();
        const { password, confirmpassword, _id } = logindatas;
        let charpattern = /[!@#$%^&*()_+-={}|[;':",./<>?]/;
        let upperCase = /[A-Z]/
        let lowerCase = /[a-z]/
        let numberspattern = /[0-9]/;
        let passwordValidations = password.length > 8 && lowerCase.test(password) && upperCase.test(password) && numberspattern.test(password) && charpattern.test(password)
        password ? passwordValidations ? document.getElementById('AddPasswordError').innerHTML = '' : document.getElementById('AddPasswordError').innerHTML = 'Password must be have minimum length 8 characters, one uppercase, one character, one number, lowecase' : document.getElementById('AddPasswordError').innerHTML = 'fill the input field'
        confirmpassword ? password === confirmpassword ? document.getElementById('AddConfirmPasswordError').innerHTML = '' : document.getElementById('AddConfirmPasswordError').innerHTML = 'password must be same' : document.getElementById('AddConfirmPasswordError').innerHTML = 'fill the input field'
        if (!password) {
            alert('Please enter a new password');
        }
        if (password && confirmpassword && password === confirmpassword && passwordValidations) {
            axios.put(baseURL + `/smr/updatesignupdata/${_id}`, { password })
                .then((response) => {
                    if (response.status === 200) {
                        // updateLogindatas({modalforgotpassword : true})
                        // setTimeout(() => {
                        //     updateLogindatas({modalforgotpassword : false})
                        // })
                        setForgotPopup(true)
                        setTimeout(() => {
                            updateLogindatas({showForgotPassword : false, showPasswordInput : false, Showforgototpinput : true})
                        })
                    } else {
                        alert('Failed to update password. Please try again later.');
                    }
                })
                .catch((error) => {
                    console.error('Error updating password:', error);
                    alert('An error occurred while updating the password. Please try again later.');
                });
        }
    };

    //Captcha Functionality
    // const generateRandomCaptcha = () => {
    //     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123240789';
    //     const length = 6;
    //     let captcha = '';
    //     for (let i = 0; i < length; i++) {
    //         const randomIndex = Math.floor(Math.random() * characters.length);
    //         captcha += characters[randomIndex];
    //     }
    //     return captcha;
    // };

    // useState(() => {
    //     updateLogindatas({generatedCaptcha : generateRandomCaptcha()})
    // }, []);

    // Handle input change
    // const handleInputChange = (event) => {  
    //     updateLogindatas({userCaptcha : event.target.value})
    // };

    const [loginPopup, setLoginPopup] = useState(false);
    const [registerPopup, setRegisterPopup] = useState(false);
    const [forgotPopup, setForgotPopup] = useState(false);
    const [showPopUp, setShowPopUp] = useState(false);


  const handleClosePopUp = () => {
    setShowPopUp(false);
    setForgotPopup(false);
  };

    return (
        <div className='bgImage'>
            {/* <div className='text-end pe-3 pt-3'>
                            <img src={RPlogo} alt='CriticalRiver' width='60px' />
                        </div> */}
            <div className='container-fluid bgImagedark'>
                <div className='row m-0 d-flex justify-content-center vh-100 align-items-center'>
                    <div className='Box col-lg-4 mx-lg-5 mx-md-5 resumeblur' style={{height : '390px'}}>
                        <div className='mx-lg-5 mx-md-5'>
                            {/* Forgot Password inputs */}
                            {logindatas.showForgotPassword ? <div className='pt-4'>
                                <div className='fs-3 mt-3  text-primary' style={{ fontWeight: '600' }}>Forgot Password</div>
                                <form>
                                    <div className='mt-2 text-secondary' style={{ fontWeight: '600', fontSize: '15px' }}>Email:</div>
                                    <div>
                                        <input className='form-control mt-1' onChange={(e) => handleForgotpasswordChange('email', e.target.value)} type='email' maxLength='30' placeholder='Enter Email Id' autoComplete='off' />
                                        <div id='emailError' className='text-danger m-0' style={{ fontSize: '11px' }}></div>
                                    </div>
                                    {logindatas.showOtpInput && <div><div className='d-flex my-2 justify-content-center'>
                                        {logindatas.otp.map((digit, index) => (
                                            <input
                                                className='mx-2 form-control'
                                                style={{ width: ' 35px', textAlign: 'center' }}
                                                key={index}
                                                type="text"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(e, index)}
                                                ref={inputRefs[index]}
                                                maxLength="1"
                                            />
                                        ))}
                                    </div><div className='d-flex justify-content-between align-items-center'><div><button className='btn btn-primary' onClick={handleForgotVerifyOtp}>Verify OTP</button></div>
                                            <div><span className='btn text-light' onClick={handleForgotVerifyOtp}><strong>Resend OTP</strong></span></div></div>
                                    </div>}

                                    {logindatas.Showforgototpinput && <div className='mt-2 d-flex align-items-center justify-content-between'>
                                        <div><button className='btn btn-primary' onClick={handleForgotpassword}>Send OTP</button></div>
                                        <div><button className='btn p-0 text-primary border-0' onClick={() => { updateLogindatas({showForgotPassword : false}) }}><strong>Login</strong></button></div>
                                    </div>}

                                    {logindatas.showPasswordInput && <div><div className='mt-1 text-secondary' style={{ fontWeight: '600', fontSize: '15px' }}>New Password:</div>
                                        <div>
                                            <input className='form-control mt-1' type='password' maxLength='30' onChange={(e) => handleForgotpasswordChange('password', e.target.value)} name='password' placeholder='Enter Password' autoComplete='off' />
                                            <p id='AddPasswordError' className='text-danger m-0' style={{ fontSize: '10px' }}></p>
                                        </div>
                                        <div className='mt-1 text-secondary' style={{ fontWeight: '600', fontSize: '15px' }}>Confirm Password:</div>
                                        <div>
                                            <input className='form-control mt-1' type='password' maxLength='30' onChange={(e) => handleForgotpasswordChange('confirmpassword', e.target.value)} name='confirmpassword' placeholder='Enter Confirm Password' autoComplete='off' />
                                            <div id='AddConfirmPasswordError' className='text-danger m-0' style={{ fontSize: '10px' }}></div>
                                        </div>
                                        <div className='mt-3 d-flex justify-content-end'>
                                            <div><button className='btn btn-primary' onClick={(e) => handleUpdatepassword(e)}>Update Password</button></div>
                                        </div></div>
                                    }
                                </form>
                            </div>

                                : logindatas.showLogin ?
                                    // Login inputs
                                        <div>
                                        <div className='fs-3 mt-2 text-primary mt-lg-4 mt-md-4' style={{ fontWeight: '600' }}>Login</div>
                                        <div className='mt-2 text-secondary' style={{ fontWeight: '600', fontSize: '15px' }}>Email:</div>
                                        <div>
                                            <input className='form-control mt-1' maxLength='50' onChange={handleLogindata} name='loginEmail' value={logindatas.loginEmail} type='email' placeholder='Enter Email Id' autoComplete='off' />
                                            <div id='emailError' className='text-danger m-0' style={{ fontSize: '11px' }}></div>
                                        </div>
                                        <div className='mt-2 text-secondary' style={{ fontWeight: '600', fontSize: '15px' }}>Password:</div>
                                        <div>
                                            <input className='form-control mt-1' maxLength='30' onChange={handleLogindata} name='loginPassword' value={logindatas.loginPassword} type='password' placeholder='Enter Password' autoComplete='off' />
                                            <div id='passwordError' className='text-danger m-0' style={{ fontSize: '11px' }}></div>
                                        </div>
                                        {/* <div className='row justify-content-end mt-3 align-items-center'>
    <div className='col-lg-auto col-md-auto col-sm-4 col-12'>
        <s className='text-danger'>
            <div className='bg-black text-white py-1 px-2' style={{ fontWeight: '600', fontStyle: 'italic', userSelect: 'none', width : "80px" }}>
                {logindatas.generatedCaptcha}
            </div>
        </s>
    </div>
    <div className='col-lg-auto col-md-auto col-sm-auto col-12 mt-3 mt-sm-0'>
        <input type="text" maxLength='6' className="form-control" placeholder="Enter CAPTCHA" style={{ width: '140px' }} value={logindatas.userCaptcha} onChange={handleInputChange} />
        <div id='captchaerror' className='text-danger m-0' style={{ fontSize: '11px' }}></div>
    </div>
    <div className='col-lg-auto col-md-auto col-sm-auto col-12 mt-3 mt-sm-0'>
        <button onClick={(e) => { e.preventDefault(); updateLogindatas({generatedCaptcha : generateRandomCaptcha()}) }} className='btn p-0 border-0' style={{ outline: '0' }}>
            <i className="fa-solid fa-arrows-rotate mx-2 " style={{color: "#ffffff"}}></i>
        </button>
    </div>
</div> */}
                                        <form className='needs-validation' noValidate>
                                        <div className='d-flex align-items-center justify-content-between mt-2'>
                                            <div><button className='btn btn-primary' onClick={(e, username) => handlelogin(e, username)}>Login</button></div>
                                            <div className='d-flex flex-column align-items-end'>
                                                <small className='m-0 text-light'>Doesn't have an account?</small>
                                                <div>
                                                    <button className='btn p-0 text-primary border-0' onClick={() => {updateLogindatas({showLogin : false, loginEmail : '', loginPassword : '',email : ''}); }}>
                                                        <strong>Register</strong>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <button className='btn p-0 text-primary border-0' onClick={() => { updateLogindatas({showForgotPassword : true}) }}>
                                                <strong>Forgot password?</strong>
                                            </button>
                                        </div>
                                    </form></div> :


                                    //Signup inputs
                                    <div>
                                        <div className='fs-3 mt-2 text-primary' style={{ fontWeight: '600' }}>Create an account</div>
                                        <div className='mt-1 text-secondary' style={{ fontWeight: '600', fontSize: '15px' }}>Email:</div>
                                        <div className='input-container'>
                                            {logindatas.showVerifyButton ? <div><input className='form-control mt-1' type='text' onChange={handleSignupdata} name='email' value={logindatas.email} placeholder='Enter Email Id' autoComplete='off' disabled={true} /></div>
                                                : <input className='form-control mt-1' maxLength='50' type='text' onChange={(e) => handleSignupdata('email', e.target.value)} name='email' value={logindatas.email} placeholder='Enter Email Id' autoComplete='off' />}
                                        </div>
                                        <div id='AddEmailError' className='text-danger m-0' style={{ fontSize: '10px' }}></div>
                                        {logindatas.showSendOtpButton && <div className='mt-2 d-flex justify-content-between align-items-center'>
                                            <div><span className='btn btn-primary' onClick={handleVerifyButton}>Send OTP</span></div>
                                            <div>
                                                <button className='btn text-primary p-0 border-0' onClick={() => { updateLogindatas({showLogin : true, showVerifyButton : false, showOtpInput : false, showInputFields : false}) }}>
                                                    <strong>Login</strong>
                                                </button>
                                            </div>
                                        </div>}
                                        {logindatas.showOtpInput && <div><div className='d-flex my-2 justify-content-center'>
                                            {logindatas.otp.map((digit, index) => (
                                                <input
                                                    className='mx-2 form-control'
                                                    style={{ width: ' 35px', textAlign: 'center' }}
                                                    key={index}
                                                    type="text"
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(e, index)}
                                                    ref={inputRefs[index]}
                                                    maxLength="1"
                                                />
                                            ))}
                                        </div><div className='d-flex justify-content-between align-items-center'><div><button className='btn btn-primary' onClick={handleVerifyOtp}>Verify OTP</button></div>
                                                <div><span className='btn text-primary' onClick={handleVerifyButton}><strong>Resend OTP</strong></span></div></div>
                                        </div>}

                                        {logindatas.showInputFields && <div>  <div className='mt-1 text-secondary' style={{ fontWeight: '600', fontSize: '15px' }}>Username:</div>
                                            <div>
                                                <input className='form-control mt-1' maxLength='30' type='text' onChange={(e) => handleSignupdata('username', e.target.value)} name='username' placeholder='Enter Username' autoComplete='off' />
                                                <div id='AddNameError' className='text-danger m-0' style={{ fontSize: '10px' }}></div>
                                            </div>
                                            <div className='mt-1 text-secondary' style={{ fontWeight: '600', fontSize: '15px' }}>Password:</div>
                                            <div>
                                                <input className='form-control mt-1' maxLength='30' type='password' onChange={(e) => handleSignupdata('password', e.target.value)} name='password' placeholder='Enter Password' autoComplete='off' />
                                                <p id='AddPasswordError' className='text-danger m-0' style={{ fontSize: '10px' }}></p>
                                            </div>
                                            <div className='mt-1 text-secondary' style={{ fontWeight: '600', fontSize: '15px' }}>Confirm Password:</div>
                                            <div>
                                                <input className='form-control mt-1' maxLength='30' type='password' onChange={(e) => handleSignupdata('confirmpassword', e.target.value)} name='confirmpassword' placeholder='Enter Confirm Password' autoComplete='off' />
                                                <div id='AddConfirmPasswordError' className='text-danger m-0' style={{ fontSize: '10px' }}></div>
                                            </div>
                                            <div className='d-flex align-items-center justify-content-between mt-2'>
                                                <div>
                                                    <button className='btn btn-primary' onClick={handleRegister}>Register</button>
                                                </div>
                                                <button className='btn text-primary p-0 border-0' onClick={() => { updateLogindatas({showLogin : true, showVerifyButton : false, showOtpInput : false, showSendOtpButton : true, showInputFields : false}) }}>
                                                    <strong>Login</strong>
                                                </button>
                                            </div></div>}
                                    </div>}
                        </div>
                    </div>
                </div>
            </div>


            {logindatas.isLoading && <Loginloading />}
            {showPopUp && <PopUpMessage message="Successfully added!" onClose={handleClosePopUp} />}
            {forgotPopup && <PopUpMessage message="Password Updated!" onClose={handleClosePopUp} />}
            {registerPopup && <PopUpMessage message="Register Successfully!" onClose={handleClosePopUp} />}
            {loginPopup && <PopUpMessage message="Login Successfully!" onClose={handleClosePopUp} />}

            {/* <LoginComponents open={logindatas.modal} Header="Success" Footer="Login Successfully" /> */}
            {/* <LoginComponents open={logindatas.modalregister} Header="Success" Footer="Register Successfully" /> */}
            {/* <LoginComponents open={logindatas.modalforgotpassword} Header="Success" Footer="Password Changed Successfully" /> */}



        </div>
    )
}

export default Loginpage
