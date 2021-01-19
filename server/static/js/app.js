

document.getElementById("start").addEventListener('click', createSession);
document.getElementById("join").addEventListener('click', joinSession)


function createSession() {
    const sessionName = window.prompt("enter a session name ")

    fetch('/session', {
        method: "POST",
        body: JSON.stringify({ sessionName }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then((_) => window.location.assign(`/call.html?sessionName=${sessionName}`))

}

function joinSession() {

    const sessionName = window.prompt("enter a session name ");
    window.location.assign(`/call.html?sessionName=${sessionName}`);

}



