# How to run video chat app #

PeerJS wraps the browser's WebRTC implementation to provide a complete, configurable, and easy-to-use peer-to-peer connection API. Equipped with nothing but an ID, a peer can create a P2P data or media stream connection to a remote peer <https://peerjs.com/>

## Generate your certificates ##

In terminal go to cert folder, delete cert.pem and key.pem files
After that run this four commands to generate certificates:
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem

For more informations visit <https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/>

## How to run video-chat app ##

Open a terminal and go to `peerjs-video-chat` directory:

Run npm install

Run npm start

After that open one tab with <https://localhost:3000>
And open second tab with <https://localhost:3000>

## Important note ##

In order to make this project working you need to run peer server,
here you can find and run peer server <https://github.com/sandra-frontend/peer-server>

Now you can connect, call and chat! 😊
