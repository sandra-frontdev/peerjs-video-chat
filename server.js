/**
 *** Setting up server
 */

// Requiring packages and modules
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require("path");

// Certificates for HTTPS connection
const privateKey  = fs.readFileSync('./cert/key.pem', 'utf8');
const certificate = fs.readFileSync('./cert/cert.pem', 'utf8');

const credentials = {key: privateKey, cert: certificate};
const express = require('express');
const app = express();

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

// Setup static directories to serve
app.use(express.static('css'));
app.use('/resources', express.static('./js'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
});

// Setting up server to listen on port 3000
httpsServer.listen(3000);
