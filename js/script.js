/* Code to execute when dom is ready */
document.addEventListener("DOMContentLoaded", () => {
	let peerId;
	let userName;
	let connection;

	const peer = new Peer({
		host: "localhost",
		port: 443,
		path: '/peerjs',
	});

	// Show the ID, with this id other user can call you
	peer.on('open', () => {
		document.getElementById("peer-id-label").innerHTML = peer.id;
		console.log('Peer is open!');
	});

	// This happens when someone connects to your session:
	peer.on('connection', (connection) => {
		connection = connection;
		peerId = connection.peer;

		// Calling sendChatMessage function when you got a message
		connection.on('data', sendChatMessage);
		// Hide peerId field and set the incoming peer id as value
		document.getElementById("peer_id").className += " hidden";
		document.getElementById("peer_id").value = peerId;
		document.getElementById("connected_peer").innerHTML = connection.metadata.userName;
		// alert('You are successfully connected with your peer, now call or chat with your peer');
		console.log('You have been connected to your peer');
	});

	peer.on('error', (err) => {
		alert("Please start peer server: " + err);
		console.error(err);
	});

	/**
	 *** Working on receive call event:
	 */
	peer.on('call', (call) => {
		/*let acceptsCall = confirm("Do you want to accept incoming video call?");*/
		let acceptsCall = true;
		if (acceptsCall) {
			// Answer the call with your own video/audio stream
			call.answer(window.localStream);

			// Receive data
			call.on('stream', (stream) => {
				// Store a global reference of the other user stream
				window.peer_stream = stream;
				// Display the stream of the other user in the peer-camera video element
				onReceiveStream(stream, 'peer-camera');
			});

			// Function for finishing call
			call.on('close', () => {
				alert("Your call has finished!");
			});

			// Finish a call using call.close()
		}
	});

	/*
	 *** Starts the request of the camera and microphone
	 */
	const requestLocalVideo = (callbacks) => {
		// Crossbrowser get camera access
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

		// Request for audio
		navigator.getUserMedia({
			audio: true,
			video: true
		}, callbacks.success, callbacks.error);
	}

	/*
	 *** Handle the providen stream (video and audio) to the desired video element
	 */
	const onReceiveStream = (stream, element_id) => {
		// Retrieve the video element according to the desired
		let video = document.getElementById(element_id);
		// Set the given stream as the video source
		video.srcObject = stream;

		// Store a global reference of the stream
		window.peer_stream = stream;
	}

	/*
	 *** Appends the received and sent message to the listview
	 */
	const sendChatMessage = (data) => {
		let colorText = "text-blue";

		// If message is from you apply a diferent style
		if(data.from == userName) {
			colorText = "text-red";
		}

		let messageHTML =  '<a href="javascript:void(0);" class="list-group-item">';
						messageHTML += '<p class="list-group-item-text ' + colorText + '">'+ data.text +'</p>';
				messageHTML += '</a>';

		document.getElementById("messages").innerHTML += messageHTML;
}

	/**
	 *** Handle the send message button
	 */
	document.getElementById("send-message").addEventListener("click", () => {
		// Getting text from the input field for sending
		let text = document.getElementById("message").value;

		// Store data for sending message:
		let data = {
			from: userName,
			text: text
		};

		// Send the message with Peer
		connection.send(data);

		// Handle the message on the UI
		sendChatMessage(data);

		document.getElementById("message").value = "";
	}, false);

	/**
	 ***  Request a videocall the other user
	 */
	document.getElementById("call").addEventListener("click", () => {
		console.log('Calling to ' + peerId);
		console.log(peer);

		var call = peer.call(peerId, window.localStream);

		call.on('stream', (stream) => {
			window.peer_stream = stream;

			onReceiveStream(stream, 'peer-camera');
		});
	}, false);

	/**
	 *** When we click on the connect button we're going to connect to peer
	 */
	document.getElementById("connect-to-peer-btn").addEventListener("click", () => {
		userName = document.getElementById("name").value;
		peerId = document.getElementById("peer_id").value;

		if (peerId) {
			connection = peer.connect(peerId, {
				metadata: {
					'userName': userName
				}
			});

			connection.on('data', sendChatMessage);
		} else {
			alert("Please provide a peer to connect with!");
			return false;
		}

		document.getElementById("chat").className = "";
		document.getElementById("connection-form").className += " hidden";
	}, false);

	/*
	 *** Starting application with testing your own video:
	 */
	requestLocalVideo({
		success: (stream) => {
			window.localStream = stream;
			onReceiveStream(stream, 'my-camera');
		},
		error: (err) => {
			alert("Access to your camera and audio denied!");
			console.error(err);
		}
	});
}, false);