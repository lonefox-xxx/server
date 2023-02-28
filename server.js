const { sleep, status } = require('./routes/controller/controller');
const positions = require('./routes/accounts/positions');
const placeOrder = require('./routes/trade/order');
const bodyParser = require('body-parser')
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const express = require('express')
const WebSocket = require("ws");
const http = require('http');
const app = express()

app.use(bodyParser.json())

const wss = new WebSocket.Server({
    server: server,
    host: "http://localhost:3000",
    path: "/status",
});


app.post('/order', placeOrder)

app.get('/position', positions)

app.post('/sleep', sleep)

app.get('/status', status)

wss.on('connection', function connection(ws) {
    setInterval(() => {
        const status = process.env.status
        ws.send(status)
    }, 1000);
});

server.listen(port, console.log(`running on ${port}`))