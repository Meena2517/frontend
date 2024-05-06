import React, { useState } from 'react';

const PopUpMessage = ({ message, onClose }) => {
  // Use state to manage the visibility of the pop-up
  const [isVisible, setIsVisible] = useState(true);

  // Close the pop-up after 2 seconds
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
      onClose(); // Callback to parent component to notify the close event
    }, 2000);

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <>
       {isVisible && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '9999' }}>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '5px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }}>
            <div className='text-center'><i className="fa-solid fa-circle-check fa-5x text-success"></i></div>
              <div className='text-center text-secondary h3'>Success</div>
              <div className='text-secondary'>Your data has been successfully submitted.</div>
            {/* <p>{message}</p> */}
          </div>
        </div>
      )}
    </>
  );
};


export default PopUpMessage;