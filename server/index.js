const express = require('express');
const path = require('path');
const { KEY, SECRETE } = require('./keys');

var OpenTok = require('opentok')

const opentok = new OpenTok(KEY, SECRETE);


const app = express();
const port = 3000;


const db = {};

app.use(express.static(path.join(__dirname, 'static')));

app.post("/session", (req, res) => {
    opentok.createSession(function (err, session) {
        if (err) return console.log(err);
        db[session.sessionId] = session;
        res.send({ sessionId: session.sessionId });
    });
});

app.get("/session/:sessionId/token", (req, res) => {
    res.json({ token: db[req.params.sessionId].generateToken(), apiKey: KEY });
});

app.listen(port, () => {
    console.log("app is running on port ", port);
})
