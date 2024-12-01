import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [watchPos, setWatchPos] = useState({ x: 300, y: 300 });
  const [phonePos, setPhonePos] = useState({ x: 100, y: 100 });
  const [isWatchConnected, setIsWatchConnected] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [lastPaymentTime, setLastPaymentTime] = useState(0);
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showWatchPrompt, setShowWatchPrompt] = useState(false);
  const [watchCooldown, setWatchCooldown] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const paymentDevicePos = { x: 500, y: 250 };
  const paymentCooldown = 12000;

  const distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
const [pin, setPin] = useState('');
const [isPinRequired, setIsPinRequired] = useState(false);
const [watchPopupMessage, setWatchPopupMessage] = useState('');

const [isPinPromptVisible, setIsPinPromptVisible] = useState(false); // Toggles PIN input visibility
const [isVibrating, setIsVibrating] = useState(false);
const [enteredPin, setEnteredPin] = useState('');
const [isPinVisible, setIsPinVisible] = useState(false);  // To control PIN visibility




const correctPin = "1234"; // correct PIN for the payment


 



  useEffect(() => {
    const interval = setInterval(() => {
      const distanceWatchPayment = distance(watchPos.x, watchPos.y, paymentDevicePos.x, paymentDevicePos.y);
      const distanceWatchPhone = distance(watchPos.x, watchPos.y, phonePos.x, phonePos.y);

      if (distanceWatchPayment < 100 && distanceWatchPhone < 500 && !watchCooldown && paymentAmount > 0) {
        setShowWatchPrompt(true);
      } else {
        setShowWatchPrompt(false);
      }

      setIsWatchConnected(distanceWatchPhone < 500);
    }, 1000);

    return () => clearInterval(interval);
  }, [watchPos, phonePos, watchCooldown, paymentAmount]);

  const processPayment = () => {
    const currentDate = new Date();
    const formattedTime = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
    const paymentMessage = `Payment of $${paymentAmount} successful at ${formattedTime}`;
  
    setTransactionHistory(prevHistory => [...prevHistory, paymentMessage]);
    setPaymentSuccess(true);
  
    if (!isAppOpen) {
      setShowPopup(true);
    }
  
    setTimeout(() => {
      setPaymentSuccess(false);
      setShowPopup(false);
    }, 5000);
  };
  

  const handlePaymentDecision = (decision) => {
    setShowWatchPrompt(false);
    setWatchCooldown(true);
    setTimeout(() => setWatchCooldown(false), paymentCooldown);
  
    if (decision === 'yes') {
      setIsPinVisible(true);  // Show the PIN keypad
    } else {
      setEnteredPin('');  // Clear the entered PIN
      setIsPinVisible(false);  // Hide the PIN keypad and stop payment
      alert('Payment cancelled.');
    }
  };
  
  
    
  
  
  
  const handlePinSubmit = () => {
    if (enteredPin === correctPin) {
      // If the PIN is correct, proceed with payment
      setIsPinVisible(false); // Hide the PIN keypad
      setEnteredPin(''); // Clear the entered PIN
      processPayment(); // Call your payment processing function
    } else {
      // If the PIN is incorrect, stop the payment and show message
      setEnteredPin(''); // Clear the entered PIN
      setIsPinVisible(false); // Hide the PIN keypad
      alert('Incorrect PIN. Payment stopped.');
      setShowWatchPrompt(false); // Hide the watch prompt
      setWatchCooldown(true); // Start watch cooldown
      setTimeout(() => setWatchCooldown(false), paymentCooldown); // Reset cooldown after 10 seconds
    }
  };
  
  const handlePinInput = (digit) => {
    setEnteredPin(prevPin => prevPin + digit);  // Append the clicked digit to the entered PIN
  };
  
  
  
  const verifyPin = () => {
    const correctPin = '1234'; // Change the correct PIN here
    if (pin === correctPin) {
      setIsPinRequired(false); // Close the PIN input
      setPin(''); // Reset the PIN input
      setWatchCooldown(true); // Start cooldown
      setTimeout(() => setWatchCooldown(false), paymentCooldown);
      processPayment(); // Proceed with the payment
    } else {
      alert('Incorrect PIN. Try again.'); // Notify the user
      setPin(''); // Reset the PIN input for retry
    }
  };
  
  
  

  const handleMouseDown = (e, item) => {
    e.preventDefault();
    let offsetX = e.clientX - (item === 'watch' ? watchPos.x : phonePos.x);
    let offsetY = e.clientY - (item === 'watch' ? watchPos.y : phonePos.y);

    const onMouseMove = (moveEvent) => {
      if (item === 'watch') {
        setWatchPos({ x: moveEvent.clientX - offsetX, y: moveEvent.clientY - offsetY });
      } else if (item === 'phone') {
        setPhonePos({ x: moveEvent.clientX - offsetX, y: moveEvent.clientY - offsetY });
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const distanceWatchPayment = distance(watchPos.x, watchPos.y, paymentDevicePos.x, paymentDevicePos.y);
      const distanceWatchPhone = distance(watchPos.x, watchPos.y, phonePos.x, phonePos.y);
  
      if (distanceWatchPayment < 100 && distanceWatchPhone < 500 && !watchCooldown && paymentAmount > 0) {
        setIsVibrating(true); // Show vibration message
        setTimeout(() => setIsVibrating(false), 3000); // Hide after 1 second
        setShowWatchPrompt(true);
      } else {
        setShowWatchPrompt(false);
      }
  
      setIsWatchConnected(distanceWatchPhone < 500);
    }, 1000);
  
    return () => clearInterval(interval);
  }, [watchPos, phonePos, watchCooldown, paymentAmount]);
  

  const openApp = () => setIsAppOpen(true);
  const closeApp = () => setIsAppOpen(false);
  const toggleTransactions = () => setIsTransactionsOpen(!isTransactionsOpen);
  const backToApp = () => setIsTransactionsOpen(false);
  const backToHome = () => setIsAppOpen(false);
  
  const handleKeypadInput = (digit) => {
    setPaymentAmount(prevAmount => prevAmount * 10 + digit);
  };

  const handleClearAmount = () => {
    setPaymentAmount(0);
  };

  const handleBackspace = () => {
    setPaymentAmount(Math.floor(paymentAmount / 10));
  };

  return (
    <div className="App">
      {/* Payment Device */}
      <div
        id="payment-device"
        style={{
          position: 'absolute',
          left: `${paymentDevicePos.x}px`,
          top: `${paymentDevicePos.y}px`,
          width: '150px',
          height: '150px',
          backgroundColor: '#BDC3C7',
          borderRadius: '50%',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <img
          src="payment-device-icon.png"
          alt="Payment Device"
          style={{ width: '100%', height: '100%', borderRadius: '50%' }}
        />
      </div>

      {/* Phone */}
      <div
        id="phone"
        style={{
          position: 'absolute',
          left: `${phonePos.x}px`,
          top: `${phonePos.y}px`,
          width: '180px',
          height: '350px',
          backgroundColor: '#34495E',
          borderRadius: '20px',
          zIndex: 2,
          cursor: 'pointer',
          boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)',
          color: 'white',
          overflow: 'hidden',
        }}
        onMouseDown={(e) => handleMouseDown(e, 'phone')}
      >
        <div style={{ backgroundColor: '#1ABC9C', borderRadius: '15px', height: '100%', padding: '20px' }}>
          {!isAppOpen ? (
            <div
              onClick={openApp}
              style={{
                backgroundColor: '#E74C3C',
                padding: '20px',
                borderRadius: '50%',
                cursor: 'pointer',
                textAlign: 'center',
                marginTop: '150px',
              }}
            >
              <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>Open App</div>
            </div>
          ) : isTransactionsOpen ? (
            <>
              <div
                style={{
                  backgroundColor: '#3498DB',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                }}
              >
                Transaction History
              </div>
              <div
                style={{
                  padding: '10px',
                  backgroundColor: '#F1C40F',
                  marginTop: '10px',
                  overflowY: 'scroll',
                  height: '150px',
                  borderRadius: '5px',
                  fontSize: '12px',
                  textAlign: 'center',
                }}
              >
                {transactionHistory.length === 0 ? (
                  <div>No transactions yet.</div>
                ) : (
                  transactionHistory.map((transaction, index) => (
                    <div key={index} style={{ marginBottom: '5px', fontSize: '14px' }}>
                      {transaction}
                    </div>
                  ))
                )}
              </div>
              <button
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#2ECC71',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '20px',
                }}
                onClick={backToApp}
              >
                Back to App
              </button>
            </>
          ) : (
            <>
              <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px', color: '#ECF0F1' }}>
                Phone App
              </div>
              <div style={{ backgroundColor: isWatchConnected ? 'green' : 'red', color: 'white', padding: '5px' }}>
                {isWatchConnected ? 'Watch Connected' : 'Watch Not Connected'}
              </div>
              <div
                style={{
                  backgroundColor: paymentSuccess ? 'green' : 'gray',
                  color: 'white',
                  marginTop: '10px',
                  padding: '5px',
                }}
              >
                {paymentSuccess ? 'Payment Successful!' : 'No Recent Payments'}
              </div>
              <button onClick={toggleTransactions}>View Transactions</button>
              <button onClick={backToHome}>Back to Home</button>
            </>
          )}
        </div>

        {/* Network & Battery Icon */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            width: '150px',
            fontSize: '12px',
            color: 'white',
          }}
        >
          <div>📶</div> {/* Network icon */}
          <div>🔋 80%</div> {/* Battery icon */}
        </div>
        {/* Watch */}
        <div
          id="watch"
          style={{
            position: 'absolute',
            left: `${watchPos.x}px`,
            top: `${watchPos.y}px`,
            width: '70px',
            height: '70px',
            backgroundColor: '#2ECC71',
            borderRadius: '50%',
            boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)',
            zIndex: 1,
          }}
          onMouseDown={(e) => handleMouseDown(e, 'watch')}
        >
          <img src="watch-icon.png" alt="Watch" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />

          {showWatchPrompt && (
            <div
              style={{
                marginTop: '80px',
                backgroundColor: '#F1C40F',
                padding: '10px',
                borderRadius: '5px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>Confirm Payment of ${paymentAmount}?</div>
              <div>
                <button
                  onClick={() => handlePaymentDecision('yes')}
                  style={{
                    backgroundColor: '#2ECC71',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    marginRight: '10px',
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => handlePaymentDecision('no')}
                  style={{
                    backgroundColor: '#E74C3C',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                  }}
                >
                  No
                </button>
              </div>
            </div>
          )}

          {/* PIN Error Popup */}
          {watchPopupMessage && (
            <div
              style={{
                position: 'absolute',
                top: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#E74C3C',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '12px',
                textAlign: 'center',
              }}
            >
              {watchPopupMessage}
            </div>
          )}
        </div>
        
        {/* Popup Notification Inside Phone */}
        {showPopup && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#1ABC9C',
              padding: '10px',
              borderRadius: '5px',
              color: 'white',
              zIndex: 3,
            }}
          >
            {transactionHistory[transactionHistory.length - 1]}
          </div>
        )}
      </div>

      {/* Watch */}
      <div
        id="watch"
        style={{
          position: 'absolute',
          left: `${watchPos.x}px`,
          top: `${watchPos.y}px`,
          width: '70px',
          height: '70px',
          backgroundColor: '#2ECC71',
          borderRadius: '50%',
          boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)',
          zIndex: 1,
        }}
        onMouseDown={(e) => handleMouseDown(e, 'watch')}
      >
        {isVibrating && (
          <div
            style={{
              position: 'absolute',
              left: `${watchPos.x}px`,
              top: `${watchPos.y - 50}px`, // Position slightly above the watch
              backgroundColor: '#E74C3C',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '14px',
              zIndex: 10,
            }}
          >
            Watch is vibrating...
          </div>
        )}
        {isPinVisible && (
          <div id="pin-keypad" style={{ padding: '10px', backgroundColor: '#BDC3C7', borderRadius: '10px', display: 'inline-block' }}>
            <div>Enter PIN:</div>
            <div
              style={{
                fontSize: '20px',
                padding: '5px',
                backgroundColor: '#ECF0F1',
                borderRadius: '5px',
                width: '150px', // Adjust width
                height: '40px', // Adjust height
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
              }}
            >
              {enteredPin}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 50px)', gap: '10px', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
                <button
                  key={digit}
                  style={{
                    width: '50px',  // Smaller and square-shaped buttons
                    height: '50px', // Square shape
                    backgroundColor: '#1ABC9C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '18px',
                    cursor: 'pointer',
                  }}
                  onClick={() => handlePinInput(digit)}  // Handle digit input
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={handlePinSubmit}
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#3498DB',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              >
                Submit
              </button>
              <button
                onClick={() => setEnteredPin('')}
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#E74C3C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              >
                C
              </button>
            </div>
          </div>
        )}

        <img src="watch-icon.png" alt="Watch" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
        {showWatchPrompt && (
          <div
            style={{
              marginTop: '80px',
              backgroundColor: '#F1C40F',
              padding: '10px',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>Confirm Payment of ${paymentAmount}?</div>
            <div>
              <button
                onClick={() => handlePaymentDecision('yes')}
                style={{
                  backgroundColor: '#2ECC71',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  marginRight: '10px',
                }}
              >
                Yes
              </button>
              <button
                onClick={() => handlePaymentDecision('no')}
                style={{
                  backgroundColor: '#E74C3C',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '5px',
                }}
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Keypad for Payment Amount */}
      <div
        id="keypad"
        style={{
          position: 'absolute',
          left: `${paymentDevicePos.x + 200}px`,
          top: `${paymentDevicePos.y}px`,
          backgroundColor: '#BDC3C7',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
        
      >
        {isPinRequired && (
  <div
    style={{
      position: 'absolute',
      top: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#BDC3C7',
      padding: '10px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    }}
  >
    <div style={{ textAlign: 'center', marginBottom: '10px' }}>Enter PIN:</div>
    <div style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '5px' }}>{'*'.repeat(pin.length)}</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
        <button
          key={digit}
          style={{
            width: '50px',
            height: '50px',
            margin: '5px',
            backgroundColor: '#1ABC9C',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '18px',
            cursor: 'pointer',
          }}
          onClick={() => handlePinInput(digit)}
        >
          {digit}
        </button>
      ))}
    </div>
    <button
      onClick={verifyPin}
      style={{
        marginTop: '10px',
        width: '100%',
        padding: '10px',
        backgroundColor: '#2ECC71',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      Submit
    </button>
  </div>
)}

        <div>Enter Payment Amount:</div>
        <div>{paymentAmount}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
            <button
              key={digit}
              style={{
                width: '50px',
                height: '50px',
                margin: '5px',
                backgroundColor: '#1ABC9C',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                fontSize: '18px',
                cursor: 'pointer',
              }}
              onClick={() => handleKeypadInput(digit)}
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleClearAmount}
            style={{
              width: '50px',
              height: '50px',
              margin: '5px',
              backgroundColor: '#E74C3C',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            C
          </button>
          <button
            onClick={handleBackspace}
            style={{
              width: '50px',
              height: '50px',
              margin: '5px',
              backgroundColor: '#F39C12',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            ←
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
