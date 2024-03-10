import { JitsiMeeting } from '@jitsi/react-sdk';
import React, { useRef, useState, useEffect } from 'react';
import "./App.css";

const jitsiDomain = process.env.REACT_APP_JITSI_FQDN;
const backendIp = process.env.REACT_APP_BACKEND_IP;

  const App = () => {
    const apiRef = useRef();
    const [ logItems, updateLog ] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [participantCount, setParticipantCount] = useState(0);
    const [showDebugInfo, setShowDebugInfo] = useState(false);
    const [localhost, setLocalhost] = useState(false);

    useEffect(() => {
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            setLocalhost(true);
            console.log("The app is running on localhost");
        } else {
            setLocalhost(false);
            console.log("The app is not running on localhost");
        }
        // TOFIX: The debug mode doesn't work locally from the raspberrypi. I must connect remotely to 10.0.0.2:3000?debug=true.
        const urlParams = new URLSearchParams(window.location.search);
        const debug = urlParams.get('debug') === 'true';
        console.log('Debug mode:', debug, urlParams);
    }, []); // 👈️ empty dependencies array

    const printEventOutput = payload => {
        updateLog(items => [ ...items, JSON.stringify(payload) ]);
    };

    const handleAudioStatusChange = (payload, feature) => {
        if (payload.muted) {
            updateLog(items => [ ...items, `${feature} off` ])
        } else {
            updateLog(items => [ ...items, `${feature} on` ])
        }
    };

    const handleChatUpdates = payload => {
        if (payload.isOpen || !payload.unreadCount) {
            return;
        }
        apiRef.current.executeCommand('toggleChat');
        updateLog(items => [ ...items, `you have ${payload.unreadCount} unread messages` ])
    };

  
    const handleJitsiIFrameRef1 = iframeRef => {
        iframeRef.style.height = '80px';
        iframeRef.style.width = '200px';
    };

    const handleApiReady = apiObj => {
        apiRef.current = apiObj;
        apiRef.current.on('audioMuteStatusChanged', payload => handleAudioStatusChange(payload, 'audio'));
        apiRef.current.on('videoMuteStatusChanged', payload => handleAudioStatusChange(payload, 'video'));
        apiRef.current.on('raiseHandUpdated', printEventOutput);
        apiRef.current.on('titleViewChanged', printEventOutput);
        apiRef.current.on('chatUpdated', handleChatUpdates);
        // apiRef.current.setLogLevel('error');
    };

    const handleReadyToClose = () => {
        /* eslint-disable-next-line no-alert */
        alert('Ready to close...');
    };

    
    const generateRoomName = () => process.env.REACT_APP_LANG; // Take this on runtime `ukr`;


    useEffect(() => {
        /**
         * Interval for updating participants information.
         * @type {number}
         */
        const interval = setInterval(() => {
            const info = apiRef.current.getParticipantsInfo();
            setParticipants(info);
        }, 1000);
    
        return () => clearInterval(interval);
    }, []);

    const [isMutingAll] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // Set the variable isMuted if the audio is muted
    useEffect(() => {
        if (localhost) { // Check if running on localhost
            const interval = setInterval(() => {
                apiRef.current.isAudioMuted().then(muted => {
                    if (new URLSearchParams(window.location.search).get('debug') === 'true') {
                        console.log('isAudioMuted', muted);
                    }
                    setIsMuted(muted);
                });  
            }, 500);
            return () => clearInterval(interval);
        }
    });

    const unmuteModerator = () => {
        if (apiRef.current && localhost) {
            // Check if the participant is muted.
            apiRef.current.isAudioMuted().then((muted) => {
                // If the participant is muted, unmute them.
                if (muted) {
                    apiRef.current.executeCommand('toggleAudio');
                    setIsMuted(false);
                    if (new URLSearchParams(window.location.search).get('debug') === 'true') {
                        console.log('Unmuting', muted);
                    }  
                }
            });
        }
      };
          
    // Call the unmuteModerator method when the component mounts.
    useEffect(() => {
        unmuteModerator();
    });

    // const newParticipant = () => {
    //     if (apiRef.current) {
    //         apiRef.current.addEventListener('participantJoined', (event) => {
    //             if (localhost) {
    //                     const participantId = event.id;
    //                     //apiRef.current.executeCommand('setAudioMute', participantId, true);
    //                     apiRef.current.executeCommand('muteEveryone');
    //                     if (new URLSearchParams(window.location.search).get('debug') === 'true') {
    //                         console.log(`A new participant with ID ${participantId} joined the meeting - Muting`);
    //                     }
    //                 }
    //             });
    //     }
    // };

    useEffect(() => {
        if (apiRef.current) {
            const intervalId = setInterval(() => {
                apiRef.current.executeCommand('muteEveryone');
                console.log('Mute everyone every 5 secs');
            }, 5000); // 5000 milliseconds = 5 seconds
            return () => clearInterval(intervalId);
        }
    });

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         newParticipant();
    //     }, 1000);
    //     return () => clearInterval(interval);
    // });

    useEffect(() => {
        const interval = setInterval(() => {
            const info = apiRef.current.getParticipantsInfo();
            const filteredInfo = info.filter(participant => participant.displayName !== 'translator');
            const participantCount = filteredInfo.length;
            setParticipantCount(participantCount);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const debug = urlParams.get('debug');
        if (debug === 'true') {
            console.log('DEBUG MODE ENABLED');
            setShowDebugInfo(true);
        }
    }, [setShowDebugInfo]);

    const handleButton1Click = () => {
        window.location.reload(true)
    };

    const handleButton2Click = () => {
        if (apiRef.current) {
            console.log('Mute everyOne');
            apiRef.current.executeCommand('muteEveryone');
            const participants = apiRef.current.getParticipantsInfo();
            participants.forEach(participant => {
                if (participant.displayName === 'translator') {
                    console.log(`The participant ${participant.participantId}  is muted. Sending to server`);
                }
            });
        }
    };
            
    const renderButtons = () => {
        return (
            <div className="button-container">
                <button onClick={handleButton1Click} className="button rejoin-button">Re-Join</button>
                <button onClick={handleButton2Click} className="button mute-all-button">
                    {isMutingAll ? 'Muting All...' : 'Mute All'}
                </button>
            </div>
        );
    };

    // TOFIX: To test the impact of this
    // const renderLog = () => logItems.map(
    //     (item, index) => (
    //         <div
    //             style = {{
    //                 fontFamily: 'monospace',
    //                 padding: '5px'
    //             }}
    //             key = { index }>
    //             {item}
    //         </div>
    //     )
    // );

    const renderSpinner = () => (
        <div style = {{
            fontFamily: 'sans-serif',
            textAlign: 'center'
        }}>
            Loading..
        </div>
    );

    // TOFIX: To test the impact of this
    // const renderParticipants = () => {
    //     <div style = {{
    //         fontFamily: 'sans-serif',
    //         textAlign: 'center'
    //     }}> 
    //         TEST....How to get the number of participants 
    //     </div>
    // };

    const [isShuttingDown, setIsShuttingDown] = useState(false);
    const handleShutdown = () => {
        setIsShuttingDown(true);
    
        fetch(`http://${backendIp}:5000/shutdown`, {
          method: 'GET'
        })
          .then(response => {
            if (response.ok) {
              console.log('Shutdown successful');
            } else {
              console.error('Shutdown failed');
            }
            setIsShuttingDown(false);
          })
          .catch(error => {
            console.error(error);
            setIsShuttingDown(false);
          });
        
      };

      const handleReboot = () => {
        fetch(`http://${backendIp}:5000/reboot`, {
          method: 'GET'
        })
          .then(response => {
            if (response.ok) {
              console.log('Reboot Initiated');
            } else {
              console.error('Reboot failed');
            }
          })
          .catch(error => {
            console.error(error);
          });
      };

    return (
        <>
            <body>
            <div className="app-container">
            <h1 className="app-title">Jitsi Channel {process.env.REACT_APP_LANG}</h1>
            <div className="status-container" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="button-container">
                    <button className={`button ${localhost === true ? (isMuted ? 'red' : 'green') : 'green'}`}>
                        {localhost === true? (isMuted ? 'Muted' : 'Online') : ''}
                    </button>
                </div>
                <div className="participant-count">
                    {participantCount}
                </div>
            </div>
            {renderButtons()}
            <div className="button-container">
                <button onClick={handleReboot} className="button reboot-button">Restart</button>
                <button onClick={handleShutdown} disabled={isShuttingDown} className={`button shutdown-button ${isShuttingDown ? 'disabled' : ''}`}>
                    {isShuttingDown ? 'Shutting down...' : 'Power Off'}
                </button>
            </div>
            <JitsiMeeting
                domain={jitsiDomain}
                roomName={generateRoomName()}
                spinner={renderSpinner}
                jwt={process.env.REACT_APP_JWT}
                configOverwrite={{
                    subject: '{process.env.REACT_APP_LANG}',
                    hideConferenceSubject: false,
                    // websocket: 'wss://translation.sennsolutions.com/xmpp-websocket',
                }}
                onApiReady={handleApiReady}
                onReadyToClose={handleReadyToClose}
                getIFrameRef={handleJitsiIFrameRef1} 
            />

            {showDebugInfo && 
                <div className="environment-variables">
                    <h2>Environment Variables</h2>
                    <p>REACT_APP_JITSI_FQDN: {process.env.REACT_APP_JITSI_FQDN}</p>
                    <p>REACT_APP_BACKEND_IP: {process.env.REACT_APP_BACKEND_IP}</p>
                    <h2>Participants:</h2>
                    <ul>
                        { 
                        participants.map((participant, index) => (
                            <li key={index}>
                                Name: {participant.displayName}, ID: {participant.participantId}
                            </li>
                        ))}
                    </ul>
                    {/* {renderLog()}
                    {renderParticipants()} */}
                </div>
            }
        </div>
            
            </body>
        </>
    );
};

export default App;
