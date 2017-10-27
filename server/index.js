const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const logger = require('morgan');
const authRouter = require('./routes/auth');
const voteRouter = require('./routes/vote');
const dataRouter = require('./routes/data');
const fs = require('fs')
const http = require('http');
const https = require('https');
const cors = require('cors');
const path = require('path')

//console.log(process.env)
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('process.env.TWITCH_EXTENSION_SECRET:', process.env.TWITCH_EXTENSION_SECRET);

app.use(cors({ credentials: true, origin: true }))
let server;
let port;

//uses nginx reverse proxy in production
if (process.env.NODE_ENV === 'production'){
    server = http.createServer(app);
    port = 8081
    app.use(express.static(__dirname+'/public'));
}else{
    server = https
        .createServer(
        {//self signed certs
            key: fs.readFileSync(path.resolve(__dirname, 'ssl/key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, 'ssl/cert.pem')),
        },
        app
        )
    port = 443
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

authRouter(app);
voteRouter(app,server);
dataRouter(app)

server.listen(port, () => {
    console.log(process.env.PASSPORT_SECRET, port);
    console.log(`Find the server at: https://localhost:${port}/`); // eslint-disable-line no-console
});
