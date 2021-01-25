
const urlParams = new URLSearchParams(window.location.search);
const sessionName = urlParams.get("sessionName");

function handleError(error) {
    if (error) {
        alert(error.message);
    }
}

console.log("the session name ", sessionName);

fetch(`session/${sessionName}/token`)
    .then((res) => res.json())
    .then(({ token, apiKey, sessionId }) => {
        console.log("the data in call ", { token, apiKey, sessionId })
        return initializeSession(apiKey, sessionId, token)
    })
    .catch((err) => {
        alert("could not initialize the sessions :(");
        console.log("the error ", err);
    })


function initializeSession(apiKey, sessionId, token) {
    var session = OT.initSession(apiKey, sessionId);
    let videoOn = true;
    let audioOn = true

    // Subscribe to a newly created stream
    session.on('streamCreated', function (event) {
        session.subscribe(event.stream, 'subscriber', {
            insertMode: 'append',
            width: '100%',
            height: '100%'
        }, handleError);
    });

    // Create a publisher
    var publisher = OT.initPublisher('publisher', {
        insertMode: 'append',
        width: '100%',
        height: '100%'
    }, handleError);

    // Connect to the session
    session.connect(token, function (error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (error) {
            handleError(error);
        } else {
            session.publish(publisher, handleError);
        }
    });


    document.getElementById("mute").addEventListener('click', ({target}) => {
        if (audioOn) {
          
            audioOn = false;
            target.innerText = "Unmute"
        } else {
            audioOn = true;
            target.innerText = "mute"
        }

        publisher.publishAudio(audioOn)
    })

    document.getElementById("camera").addEventListener("click", ({target}) => {
        console.log("the camera clicked ", videoOn)
        if (videoOn) {
            videoOn = false;
            target.innerText = "Camera on"
        } else {
            videoOn = true;
            target.innerText = "Camera off"
        }

        publisher.publishVideo(videoOn)
    })
}