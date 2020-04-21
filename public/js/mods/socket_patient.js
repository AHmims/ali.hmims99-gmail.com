const globSocket = io();
const __SOCKET = io('/chat');
let __PEER = null;
// 
__SOCKET.on('connect', () => {
    __SOCKET.emit('setPatient', sessionStorage.getItem('user_M'));
});
__SOCKET.on('msgReceived', msg => {
    console.log(msg);
    displayReceivedMsg(msg);
    // document.getElementById('remote').innerText += msg.content + '\n';
});
// 
// 
__SOCKET.on('patientLink', async () => {
    // let status = ;
    if (confirm('Votre medecin est entrain de vous appelle.')) {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        // 
        document.getElementById('clientVideo').srcObject = stream;
        // 
        __PEER = new SimplePeer({
            initiator: false,
            stream: stream,
            trickle: false
        })
        __PEER.on('stream', function (stream) {
            document.getElementById('remoteVideo').srcObject = stream;
            document.getElementById('remoteVideoPoster').style.display = "none";
            console.log(stream);
        });
        // 
        __PEER.on('signal', function (data) {
            console.log(data);
            __SOCKET.emit('liveStreamLink', data);
        });
    } else {
        __SOCKET.emit('liveStreamInitFail');
    }
});
__SOCKET.on('liveStreamDataFlux', offer => {
    __PEER.signal(offer);
});
// 
__SOCKET.on('liveStreamTerminated', () => {
    if (__PEER != null) {
        __PEER = null;
        document.getElementById('clientVideo').srcObject = null;
        document.getElementById('remoteVideo').srcObject = null;
        // 
        document.getElementById('remoteVideoPoster').style.display = "flex";
        console.log('ss');
    }
});
// 
// 
globSocket.on('notifAccepted', data => {
    sessionStorage.setItem('smtg', JSON.stringify(data));
    window.location.href = "/patient/contact";
});
// 
// 
// 
// 
function sendNotification(data) {
    globSocket.emit('newNotif', data);
}

function sendMsg(msg) {
    __SOCKET.emit('msgSent', msg);
}
// 
// 