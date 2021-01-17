function handleError(error) {
    if (error) {
        alert(error.message);
    }
}

fetch('/session', { method: "POST" })
    .then(res => res.json())
    .then(({ sessionId }) => sessionId)
    .then((sessionId) =>
        fetch(`session/${sessionId}/token`)
            .then((res) => res.json())
            .then(({ token, apiKey }) => initializeSession(apiKey, sessionId, token))

    )


initializeSession(apiKey, sessionId, token);

function initializeSession(apiKey, sessionId, token) {
    var session = OT.initSession(apiKey, sessionId);

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
}