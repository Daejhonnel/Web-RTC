let APP_ID = ""

let localStream;
let remoteStream;
let peerConnection;

const servers = {
    iceServers:[
        {
            urls:['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
        }
    ] 
}

let init = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({video:false, audio:false})
    document.getElementById('user-1').srcObject = localStream
    
    createOffer()
    console.log('localOffer:', localStream);
}

let createOffer = async () => {
    peerConnection = new RTCPeerConnection(servers)

    remoteStream = new MediaStream()
    document.getElementById('user-2').srcObject = localStream

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)

        console.log('remoteoffer:', remoteStream)
    })

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
        })
    }

    peerConnection.onicecandidate = async (event) => {
        if(event.candidate){
            console.log('NEW ice Candidate:', event.candidate)
        }
    }


    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    console.log('offer:', offer)
}

init()