import React, { useState, useRef, useEffect } from 'react';
import './homepage.css';
import { Link } from 'react-router-dom'
import Screenshot1 from './images/LaptopwithLoginPage.png'
import ContactImg from './images/contactImg.png';
import axios from 'axios';
import 'animate.css';
import { motion, useInView  } from "framer-motion";
import Loginloading from './Loginloading';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import PopUpMessage from './PopUpMessage';


const Homepage = () => {
  const ref = useRef(null);
  const refAbout = useRef(null);
  const isInView = useInView(ref, { once: true });
  const isInViewAbout = useInView(refAbout, { once: true });
  const [loading ,setLoading] = useState(false)

  const [scrollProgress, setScrollProgress] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const scrollRange = document.body.scrollHeight - window.innerHeight;
    const currentScrollPosition = window.scrollY;
    const progress = currentScrollPosition / scrollRange;
    setScrollProgress(progress);
  };

  // Listen to scroll events
  window.addEventListener("scroll", handleScroll);

  // Cleanup: Remove the event listener when the component unmounts
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);


  // const navigate = useNavigate();
//   document.addEventListener("scroll", function() {
//     var scrollPosition = window.scrollY;
//     var mouse = document.querySelector('.mouse');
//     mouse.style.bottom = (20 - scrollPosition / 2) + 'px';
// });


// const handleAbout = (event) => {
//   event.preventDefault();
//   navigate('/LoginPage')
// }

const handleAbout = () => {
  const aboutSection = document.getElementById('aboutSection');
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  }
};


const handleContact = () => {
  const contactSection = document.getElementById('ContactSection');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }
};


const handleProject = () => {
  const ProjectSection = document.getElementById('ProjectSection');
  if (ProjectSection) {
    ProjectSection.scrollIntoView({ behavior: 'smooth' });
  }
};


const demoProject = [
  {
    lappyImage : Screenshot1,
    demoHeading : 'LOGIN & CRUD Operation',
    demoContent1 : 'The platform offers a seamless user experience with its Login and Signup functionalities. Users can easily create an account or log in to access the full range of features. Upon authentication, individuals are swiftly directed to the central hub of the platform: the CRUD (Create, Read, Update, Delete) operation page.',
    demoContent2 : 'Here, users have the power to interact with their data in a dynamic and intuitive manner. Whether its creating new entries, retrieving existing information, updating records, or removing obsolete data, the CRUD operation page serves as the control center for managing user content efficiently.',
    buttonLink : '/LoginPage',
    page : '/data'
  }
];


const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };



  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    // /^\d*$/.test(value) only numeric values
    const { name, value } = e.target;
    const isNumericField = ["name"].includes(name);
    const numericValue = isNumericField ? /^[A-Za-z\s]*$/.test(value) ? value : formData[name] : value;
    setFormData({ ...formData, [name]: numericValue });
    setErrors({ ...errors, [name]: '' }); // Clear previous errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    let formValid = true;
    const newErrors = { ...errors };

    if (formData.name.trim() === '') {
      newErrors.name = 'Name is required';
      formValid = false;
    }

    // Email validation (simple check for demonstration)
    // if (/^[a-zA-Z0-9._-]+@(gmail\.com)$/.test(formData.email)) {
    //   newErrors.email = 'Invalid email address';
    //   formValid = false;
    // }
    const emailParts = formData.email.split('@');
    console.log(emailParts[1] !== 'gmail.com');
    console.log(emailParts.length !== 2);
if (emailParts.length !== 2 || emailParts[1] !== 'gmail.com') {
  newErrors.email = 'Invalid email address';
      formValid = false;
}

    if (formData.message.trim() === '') {
      newErrors.message = 'Message is required';
      formValid = false;
    }

    if (!formValid) {
      setErrors(newErrors);
      return;
    }

    try {
      // Submit form data
      setLoading(true);
      await axios.post('https://vercel-deploy-bb8k.onrender.com/smr/sendFeedback', formData);
      console.log('Form submitted:', formData);
      // Clear form after successful submission if needed
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      setLoading(false);
      setShowPopUp(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error, maybe set an error state for displaying an error message to the user
    }
  };


  const [showPopUp, setShowPopUp] = useState(false);


  const handleClosePopUp = () => {
    setShowPopUp(false);
  };



  return (
    <div className='bgImage'>
      {loading && <Loginloading/>}
      {showPopUp && <PopUpMessage message="Successfully added!" onClose={handleClosePopUp} />}
      <div className='bgImagedark'>
      {/* linear-gradient(to right, rgb(255,0,255), rgb(0,255,255)) */}
      <div class="container-fluid sticky-top p-0" style={{backgroundImage:'rgb(4,59,96)'}}>
        <div className='bgImagedark1'>
         <nav className="navbar navbar-expand-lg navbar-light container-fluid">
          <div className="container-fluid">
            <a className="navbar-brand fw-bold text-white" style={{ fontSize: '14px' }} href="/">REVANTH PATNANI</a>
            <button className="navbar-toggler" type="button" onClick={toggleNav}>
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse justify-content-end me-lg-5 me-md-3 me-0 ${isNavOpen ? 'show' : ''}`} id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item mx-lg-4 mx-md-2 mx-1">
                  <Link className="nav-link fw-bold position-relative" onClick={handleAbout}>
                    ABOUT
                  </Link>
                </li>
                <li className="nav-item mx-lg-4 mx-md-2 mx-1">
                  <Link className="nav-link fw-bold position-relative" onClick={handleContact}>
                    CONTACT
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        </div>
        <motion.div className="progress-bar-container">
        <motion.div className="progress-bar" style={{ scaleX: scrollProgress, backgroundColor: 'white' }} />
      </motion.div>
              </div>

        <div className='text-white container-fluid p-0'>
          <div className=' p-lg-5 p-md-5'>
    <div className='row m-0'>
        <div className='col-lg-12 text-center py-5'>
            <motion.div
                className='name fw-bold col-lg-12 col-md-12'
                ref={ref}
                initial={{ transform: "translateY(100px)", opacity: 0 }}
                animate={{ transform: isInView ? "none" : "translateY(0)", opacity: isInView ? 1 : 0 }}
                transition={{ duration: 0.9, ease: [0.17, 0.55, 0.55, 1], delay: 0.5 }}
            >
                HEY, I'M REVANTH PATNANI
            </motion.div>
            <motion.div
                className='row m-0 mt-lg-4 mt-md-2 mt-1 px-lg-5'
                ref={ref}
                initial={{ transform: "translateY(100px)", opacity: 0 }}
                animate={{ transform: isInView ? "none" : "translateY(0)", opacity: isInView ? 1 : 0 }}
                transition={{ duration: 0.9, ease: [0.17, 0.55, 0.55, 1], delay: 0.7 }}
            >
                <motion.div className='col-lg-12 full-stack p-0 text-center px-lg-5' style={{ textAlign: 'justify' }}>
                    I'm a full-stack developer at Critical River Technologies in Vijayawada working on CARD Project for Registration & Stamps Department, Andhra Pradesh, handling both frontend and backend development in a high-pressure environment.
                </motion.div>
            </motion.div>
            <motion.div className='my-lg-4 my-md-3 my-2 col-lg-12'
                ref={ref}
                initial={{ transform: "translateY(100px)", opacity: 0 }}
                animate={{ transform: isInView ? "none" : "translateY(0)", opacity: isInView ? 1 : 0 }}
                transition={{ duration: 0.9, ease: [0.17, 0.55, 0.55, 1], delay: 0.9 }}
            >
                <button type='button' className='btn btn-lg btn-md btn-sm btn-light fw-bold py-lg-2 py-md-2 px-lg-3 px-md-3' onClick={handleProject}>DEMO PROJECTS</button>
            </motion.div>
        </div>
        {/* <div className='col-lg-6 displayImage d-flex justify-content-center align-items-center'>
    <div className='myimg-container displayImage'>
        <img src={myImage} alt='Revanth Patnani' style={{ borderRadius: '5px', margin : '35px 0px 0px 35px' }} />
    </div>
</div> */}

</div>
    </div>
</div>


<div className='container d-flex justify-content-center align-items-center mt-4 mt-lg-0'>
        <div className='mouse'></div>
    </div>




        <div className='text-center text-white py-lg-5 py-md-3 py-2 container-fluid' id='aboutSection'>
        <motion.div
    className='fw-bold mt-lg-5 mt-md-3 mt-2 mb-lg-3 mb-md-2 mb-1 textHeading'
    ref={refAbout}
    initial={{ transform: "translateY(100px)", opacity: 0 }}
    animate={{ transform: isInViewAbout ? "none" : "translateY(0)", opacity: isInViewAbout ? 1 : 0 }}
    transition={{ duration: 0.9, ease: [0.17, 0.55, 0.55, 1], delay: 0.5 }}
>
    ABOUT ME
</motion.div>
          <div className='mb-lg-3 mb-md-2 mb-1'>
            <span className='custom-hr'></span>
          </div>
          <div className='row m-0 mt-lg-3 mt-md-2 mt-1'>
            <div className='col-lg-2'></div>
            <div className='col-lg-8 mt-4'>
              <p className='full-stack'>Here you will find more information about me, what I do, and my current skills mostly in terms of programming and technology.</p>
            </div>
            <div className='col-lg-2'></div>
          </div>
        </div>


        <div className='container'>
            <div className='row m-0 text-white mx-lg-5 mx-md-5'>
                <div className='col-lg-6 p-lg-3 p-md-3'>
                    <div className='col-12 fw-bold'>
                        <h4 className='textHeading1'>Get to know me!</h4>
                    </div>
                    <div className='col-12 alignmentContent mt-lg-4 mt-md-4'>
                        <p>I'm a versatile developer skilled in both frontend and backend technologies, passionate about creating exceptional digital experiences from end to end. With expertise in frontend development, I specialize in crafting visually appealing and intuitive user interfaces that captivate audiences and enhance usability. Additionally, my proficiency in backend development allows me to architect robust systems and implement efficient server-side logic to power the core functionality of web applications. I thrive on the challenges of optimizing performance, solving complex problems, and delivering seamless user experiences across all devices. Committed to continuous learning and innovation, I'm always seeking new opportunities to leverage my skills and contribute to cutting-edge projects that push the boundaries of web development.</p>
                    </div>
                </div>
                <div className='col-lg-6 p-3'>
    <div className='col-lg-12 fw-bold'>
        <h4 className='textHeading1'>My Skills</h4>
    </div>
    <div className='col-lg-12 alignmentContent mt-4 d-flex flex-wrap fw-bold'>
                        <div className='skills_skills text-black fw-bold' style={{backgroundColor: 'rgba(255, 255, 255, 0.7)'}}>HTML</div>
                        <div className='skills_skills text-black fw-bold' style={{backgroundColor: 'rgba(255, 255, 255, 0.7)'}}>CSS</div>
                        <div className='skills_skills text-black fw-bold' style={{backgroundColor: 'rgba(255, 255, 255, 0.7)'}}>Javascript</div>
                        <div className='skills_skills text-black fw-bold' style={{backgroundColor: 'rgba(255, 255, 255, 0.7)'}}>ReactJS</div>
                        <div className='skills_skills text-black fw-bold' style={{backgroundColor: 'rgba(255, 255, 255, 0.7)'}}>NodeJS</div>
                        <div className='skills_skills text-black fw-bold' style={{backgroundColor: 'rgba(255, 255, 255, 0.7)'}}>SQL</div>
                        <div className='skills_skills text-black fw-bold' style={{backgroundColor: 'rgba(255, 255, 255, 0.7)'}}>MongoDB</div>
                    </div>
</div>
            </div>
        </div>



        <div className='text-center text-white py-lg-5 py-md-3 py-2 container-fluid' id='ProjectSection'>
          <div className='fw-bold mt-lg-5 mt-md-3 mt-2 mb-lg-3 mb-md-2 mb-1 textHeading'>DEMO PROJECTS</div>
          <div className='mb-lg-3 mb-md-2 mb-1'>
            <span className='custom-hr'></span>
          </div>
          <div className='row m-0 mt-lg-3 mt-md-2 mt-1'>
            <div className='col-lg-2'></div>
            <div className='col-lg-8 mt-4'>
              <p className='full-stack'>Here you will find some of the personal projects that I created with each project containing its own case study</p>
            </div>
            <div className='col-lg-2'></div>
          </div>
        </div>

{/* 
        <div className='container'>
                <div className='row m-0 py-5'>
                <div className='col-lg-6 position-relative'>
    <img src={LaptopwithLoginPage} alt='LoginPage' className='img-fluid' />
    <img src={Screenshot1} alt='LoginPage' className='img-fluid position-absolute top-0 start-0 ' style={{width : '370px', height: '217px' ,marginTop : '27px', marginLeft : '101px'}}  />
</div>
                  <div className='col-lg-6 text-white'> 
                      <div className='pt-2'><h3 className='fw-bold'>LOGIN & CRUD Operation</h3></div>
                      <div><p style={{textAlign : 'justify'}}>The platform offers a seamless user experience with its Login and Signup functionalities. Users can easily create an account or log in to access the full range of features. Upon authentication, individuals are swiftly directed to the central hub of the platform: the CRUD (Create, Read, Update, Delete) operation page.</p></div>
                      <div><p style={{textAlign : 'justify'}}>Here, users have the power to interact with their data in a dynamic and intuitive manner. Whether it's creating new entries, retrieving existing information, updating records, or removing obsolete data, the CRUD operation page serves as the control center for managing user content efficiently.</p></div>
                      <div className='text-center'><button className='btn text-white' style={{background : 'rgb(205,0,255)'}} onClick={(e) => {e.preventDefault();navigate('/LoginPage');}}>Open Link</button></div>
                  </div>
                </div>
        </div> */}

        {
          demoProject.map((item, index) => (
            <div className='container' key={index}>
                <div className='row m-0'>
                <div className='col-lg-6 position-relative text-center'>
    <img src={item.lappyImage} alt='LoginPage' className='img-fluid' />
    {/* <img src={item.demoImage} alt='LoginPage' className='img-fluid position-absolute top-0 start-0 ' style={{width : '370px', height: '216.5px' ,marginTop : '27.5px', marginLeft : '139.5px'}}  /> */}
</div>
                  <div className='col-lg-6 text-white'> 
                      <div className='pt-2'><h3 className='fw-bold textHeading1'>{item.demoHeading}</h3></div>
                      <div><p className='paragraph' style={{textAlign : 'justify'}}>{item.demoContent1}</p></div>
                      <div><p className='paragraph' style={{textAlign : 'justify'}}>{item.demoContent2}</p></div>
                      {/* <div className='text-center'><button className='btn btn-lg btn-md btn-sm fw-bold btn-light mt-3' onClick={(e) => {e.preventDefault();localStorage.setItem('page',`${item.page}`);navigate(`${item.buttonLink}`);}}>PROJECT LINK</button></div> */}
                  </div>
                </div>
        </div>
          ))
        }



<div className='text-center text-white py-lg-5 py-md-3 py-2 container-fluid' id='ContactSection'>
          <div className='fw-bold mt-lg-5 mt-md-3 mt-2 mb-lg-3 mb-md-2 mb-1 textHeading'>CONTACT</div>
          <div className='mb-lg-3 mb-md-2 mb-1'>
            <span className='custom-hr'></span>
          </div>
          <div className='row m-0 mt-lg-3 mt-md-2 mt-1'>
            <div className='col-lg-2'></div>
            <div className='col-lg-8 mt-4'>
              <p className='full-stack'>Feel free to Contact me by submitting the form below and I will get back to you as soon as possible</p>
            </div>
            <div className='col-lg-2'></div>
          </div>
        </div>


        <div className='container'>
            <div className='row m-0 d-flex align-items-center'>
            <div className='col-lg-6'>
                    <img src={ContactImg} alt='contact' className='img-fluid'/>
                </div>
                <div className="col-lg-6 px-lg-5">
      <form onSubmit={handleSubmit}>
        <div className="form-group mt-3">
          <label htmlFor="name" className='text-white fw-bold'>Name:</label>
          <input
            type="text"
            className={`form-control ${errors.name && 'is-invalid'}`}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder='Enter the Name'
            autoComplete='off'
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="form-group mt-3">
          <label htmlFor="email" className='text-white fw-bold'>Email:</label>
          <input
            type="email"
            className={`form-control ${errors.email && 'is-invalid'}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder='Example@gmail.com'
            autoComplete='off'
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="form-group mt-3">
          <label htmlFor="message" className='text-white fw-bold'>Message:</label>
          <textarea
            className={`form-control ${errors.message && 'is-invalid'}`}
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            placeholder='Say something!'
            autoComplete='off'
          ></textarea>
          {errors.message && <div className="invalid-feedback">{errors.message}</div>}
        </div>
        <button type="submit" className="btn btn-light fw-bold mt-3">Submit</button>
      </form>
    </div>
            </div>
        </div>


        <footer class="bg-dark py-2 mt-3">
    <div class="container">
        <div class="row m-0">
            <div class="col-lg-12 text-center text-white">
                <div className='d-flex justify-content-center align-items-center'>
                  <div><p className='m-0'>Follow us on</p></div>
                  <div className="d-inline-grid ms-3">
                  <ul className='d-flex align-items-center justify-content-between m-0 p-0 py-1' style={{listStyleType : "none", columnGap : '1.75rem'}}>
                  {/* <li title="youtube"><a href="https://www.youtube.com/learnwithsrikanthracharla" aria-label="youtube" target="_blank" rel="noopener noreferrer">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path></svg>
                    </a></li> */}
                  <li title="linkedin"><a href="https://www.linkedin.com/in/revanth-patnani-8b1292141/" aria-label="linkedin" target="_blank" rel="noopener noreferrer">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path></svg>
                    </a></li>
                  <li title="instagram"><a href="https://www.instagram.com/revanthpatnani" aria-label="instagram" target="_blank" rel="noopener noreferrer">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>
                  </a></li>
                  {/* <li title="github"><a href="https://www.github.com/racharlasrikanth" aria-label="github" target="_blank" rel="noopener noreferrer">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>
                  </a></li> */}
                  </ul>
                  </div>
                </div>
                <p class="mb-0">&copy; Copyright 2024. Made by <Link className="fw-bold text-white text-decoration-none" onClick={(e) => {window.open('http://localhost:3000')}}>Revanth Patnani</Link></p>
            </div>
        </div>
    </div>
</footer>

        
      </div>
      {showSuccessMessage && (
        <div className="loginsuccess-message mx-3">
          <Dialog open={showSuccessMessage} className=' position-absolute d-flex flex-column'>
            <DialogContent className='px-5 py-3'><div className='text-center'><i className="fa-solid fa-circle-check fa-5x text-success"></i></div>
              <div className='text-center text-secondary h3'>Success</div>
              <div className='text-secondary'>Your data has been successfully submitted.</div></DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default Homepage;
