import { JitsiMeeting } from '@jitsi/react-sdk';
import React, { useRef, useState, useEffect } from 'react';
import "./App.css"; //"./style.css";

const jitsiDomain = process.env.REACT_APP_JITSI_FQDN;
const backendIp = process.env.REACT_APP_BACKEND_IP;

  const App = () => {
    const apiRef = useRef();
    const [ logItems, updateLog ] = useState([]);
    const [ showNew ] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [participantCount, setParticipantCount] = useState(0);
    const [showDebugInfo, setShowDebugInfo] = useState(false);

    // Try to change the user agent to allow to work not in desktop mode - FAILED SO FAR
    // useEffect(() => {
    //     Object.defineProperty(navigator, 'userAgent', {
    //       get: function () { "Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0"; }
    //     });
    //   }, []);
    // "Mozilla/5.0 (Android 13; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0" - Android mobile
    // Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0 - Android desktop mode
    let localhost = false; 
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        localhost=true;
        console.log("The app is running on localhost");
    } else {
        localhost=false;
        console.log("The app is not running on localhost");
    }

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

    // const handleKnockingParticipant = payload => {
    //     updateLog(items => [ ...items, JSON.stringify(payload) ]);
    //     updateKnockingParticipants(participants => [ ...participants, payload?.participant ])
    // };

    // const resolveKnockingParticipants = condition => {
    //     knockingParticipants.forEach(participant => {
    //         apiRef.current.executeCommand('answerKnockingParticipant', participant?.id, condition(participant));
    //         updateKnockingParticipants(participants => participants.filter(item => item.id === participant.id));
    //     });
    // };
    
    //const toggleMuteAll = () => {
    //setMuteAll(!muteAll);
  //};
  


    const handleJitsiIFrameRef1 = iframeRef => {
        // iframeRef.style.marginTop = '10px';
        // iframeRef.style.border = '10px solid #3d3d3d';
        // iframeRef.style.background = '#3d3d3d';
        iframeRef.style.height = '80px';
        iframeRef.style.width = '200px';
        //iframeRef.style.marginBottom = '10px';
    };

    const handleJitsiIFrameRef2 = iframeRef => {
        iframeRef.style.marginTop = '10px';
        iframeRef.style.border = '10px dashed #df486f';
        iframeRef.style.padding = '5px';
        iframeRef.style.height = '400px';
    };

    const handleJaaSIFrameRef = iframeRef => {
        iframeRef.style.border = '10px solid #3d3d3d';
        iframeRef.style.background = '#3d3d3d';
        iframeRef.style.height = '400px';
        iframeRef.style.marginBottom = '20px';
    };

    const handleApiReady = apiObj => {
        apiRef.current = apiObj;
        // apiRef.current.on('knockingParticipant', handleKnockingParticipant);
        apiRef.current.on('audioMuteStatusChanged', payload => handleAudioStatusChange(payload, 'audio'));
        apiRef.current.on('videoMuteStatusChanged', payload => handleAudioStatusChange(payload, 'video'));
        apiRef.current.on('raiseHandUpdated', printEventOutput);
        apiRef.current.on('titleViewChanged', printEventOutput);
        apiRef.current.on('chatUpdated', handleChatUpdates);
        // apiRef.current.executeCommand('displayName', 'translator');
        // apiRef.current.executeCommand('unmute')
        //apiRef.current.on('knockingParticipant', handleKnockingParticipant);
    };

    const handleReadyToClose = () => {
        /* eslint-disable-next-line no-alert */
        alert('Ready to close...');
    };

    
    //const generateRoomName = () => `JitsiMeetRoomNo${Math.random() * 100}-${Date.now()}`;
    const generateRoomName = () => process.env.REACT_APP_LANG; // Take this on runtime `ukr`;


    useEffect(() => {
        const interval = setInterval(() => {
            const info = apiRef.current.getParticipantsInfo();
            setParticipants(info);
        }, 1000);
    
        return () => clearInterval(interval);
    }, []);

    const [isMutingAll] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         apiRef.current.addEventListener('audioMuteStatusChanged', (event) => {
    //             console.log('audioMuteStatusChanged event fired', event);
    //             setIsMuted(event.muted);
    //         });
    //     }, 1000);
    //     return () => clearInterval(interval);

    // }, [apiRef]);

    useEffect(() => {
        const interval = setInterval(() => {
            apiRef.current.isAudioMuted().then(muted => {
                console.log('isAudioMuted', muted);
                setIsMuted(muted);
            });
    
            // apiRef.current.addEventListener('audioMuteStatusChanged', (event) => {
            //     console.log('isAudioMuted event', event.muted);
            //     setIsMuted(event.muted);
            // });
        }, 500);
        return () => clearInterval(interval);
    }, [apiRef]);

    const handleUnmute = () => {
        if (isMuted) {
            console.log('Executing toggleAudio command');
            apiRef.current.executeCommand('toggleAudio');
        }
    };

    useEffect(() => {
        if (isMuted && localhost) { 
            console.log('Executing Automatic unMute command');
            setTimeout(() => {
                apiRef.current.executeCommand('toggleAudio');
            }, 100);
        }

    });

    useEffect(() => {
        const interval = setInterval(() => {
            apiRef.current.addEventListener('participantJoined', (event) => {
                if (localhost) {
                    const participantId = event.id;
                    setTimeout(() => {
                        //apiRef.current.executeCommand('setAudioMute', participantId, true);
                        apiRef.current.executeCommand('muteEveryone');
                        console.log(`A new participant with ID ${participantId} joined the meeting - Muting`);
                    }, 500);
                }
            });
        }, 1000);

        return () => {
            apiRef.current.removeEventListener('participantJoined')
            clearInterval(interval);;
        };
    }, []);

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
            setShowDebugInfo(true);
        }
    }, []);
    const handleButton1Click = () => {
        window.location.reload(true)
    };

    const handleButton2Click = () => {
        apiRef.current.executeCommand('muteEveryone');
            const participants = apiRef.current.getParticipantsInfo();
            participants.forEach(participant => {
                if (participant.displayName === 'translator') {
                    // Send the mute status to your server
                    console.log(`The participant ${participant.participantId}  is muted. Sending to server`);

                    fetch('/api/muteStatus', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: apiRef.current.getMyUserId(),
                            isMuted: true,
                        }),
                    });
                }
            });
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

    const renderLog = () => logItems.map(
        (item, index) => (
            <div
                style = {{
                    fontFamily: 'monospace',
                    padding: '5px'
                }}
                key = { index }>
                {item}
            </div>
        )
    );

    const renderSpinner = () => (
        <div style = {{
            fontFamily: 'sans-serif',
            textAlign: 'center'
        }}>
            Loading..
        </div>
    );

    // const renderParticipants = apiObj => (
        // apiRef.current = apiObj;
        // apiRef.current.on('getParticipants', printEventOutput);
    // );

    const renderParticipants = () => {
        <div style = {{
            fontFamily: 'sans-serif',
            textAlign: 'center'
        }}> 
            TEST....How to get the number of participants 
        </div>
    };

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
            {/* <h1 style = {{
                fontFamily: 'sans-serif',
                textAlign: 'center'
            }}>
            </h1> */}
            <div className="app-container">
            <h1 className="app-title">Jitsi Channel {process.env.REACT_APP_LANG}</h1>
            <div className="status-container" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="button-container">
                    <button className={`button ${localhost === true ? (isMuted ? 'red' : 'green') : 'green'}`}>{localhost === true ? (isMuted ? 'Muted' : 'Online') : 'Online'}</button>
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
                    hideConferenceSubject: false
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
                    {renderLog()}
                    {renderParticipants()}
                </div>
            }
        </div>
            
            </body>
        </>
    );
};

export default App;
