const express = require('express');
const path = require('path');
const { KEY, SECRETE } = require('./keys');

var OpenTok = require('opentok')

const opentok = new OpenTok(KEY, SECRETE);


const app = express();
const port = 3000;


const db = {};

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());

app.post("/session", (req, res) => {
    const { sessionName } = req.body;
    opentok.createSession(function (err, session) {
        if (err) return console.log(err);
        db[sessionName] = session;

        console.log("the db", db);
        res.send({ sessionId: session.sessionId });
    });
});

app.get("/session/:sessionName/token", (req, res) => {
    const data = { token: db[req.params.sessionName].generateToken(), apiKey: KEY, sessionId: db[req.params.sessionName].sessionId };
    console.log("the response ", data);
    res.json(data);
});

app.listen(port, () => {
    console.log("app is running on port ", port);
})
