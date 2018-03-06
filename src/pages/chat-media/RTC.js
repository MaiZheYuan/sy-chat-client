var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
export default {
    install(localVideo, remoteVideo, isCaller) {
        chatTool.isCaller = isCaller;
        chatTool.remoteVideoPlayer = remoteVideo;
        chatTool.localVideoPlayer = localVideo;
        return new Promise(function (res, rej) {
            chatTool.installRes = res;
            chatTool.pc = new PeerConnection(chatTool.iceServer);
            chatTool.pc.ontrack = chatTool.showRemoteVideo;
            chatTool.pc.onicecandidate = chatTool.saveLocalCD;
            chatTool.getMedia();
        })
    },
};
var chatTool = {
    installRes:null,
    isCaller: false,//是否主动呼叫者
    remoteVideoPlayer: null,//播放远程视频的vedio标签
    localVideoPlayer: null,//播放本地视频的vedio标签
    iceServer: {
        "iceServers": [
            {
                "urls": "stun:106.15.225.7:3478"
            },
            {
                "urls": "turn:106.15.225.7:3478",
                "username": "user",
                "credential": "password",
            },
        ]
    },//p2p连接服务
    pc: null,//PeerConnection实例
    localCd: [],//本地candidate
    remoteCd: [],//远程candidate
    localSdp: null,//本地description
    remoteSdp: null,//远程description
    //获取摄像头权限
    getMedia() {
        chatTool.isCaller = true;
        navigator
            .mediaDevices.getUserMedia({audio: false, video: true})
            .then(chatTool.onLocalMediaStart)
            .catch(error => {
                console.error("mediaStart,getUserMedia#" + error)
            });
    },
    //获取到了摄像头权限，
    onLocalMediaStart(mediaStream) {
        chatTool.pc.addStream(mediaStream);
        chatTool.localVideoPlayer.srcObject = mediaStream;
        chatTool.setLocalSdpComfirm();
    },
    //生成本地sdp，判断是offer还是answer
    setLocalSdpComfirm() {
        var pc = chatTool.pc;
        var that = chatTool;
        if (!chatTool.isCaller) {
            pc.createAnswer(chatTool.setLocalSdp, error => {
                console.error("mediaStart,createOffer#" + error)
            });
        } else {
            pc.createOffer(chatTool.setLocalSdp, error => {
                console.error("mediaStart,createOffer#" + error)
            });
        }
    },
    //生成本地sdp
    setLocalSdp (sdp) {
        chatTool.pc.setLocalDescription(sdp, function () {
            let localSdp = chatTool.pc.localDescription;
            chatTool.saveLocalSdp(localSdp);
        }, error => {
            console.error("mediaStart,setLocalDescription#" + error)
        });
    },
    //保存生成的本地sdp
    saveLocalSdp(sdp) {
        chatTool.localSdp = sdp;
        if(chatTool.iceLocalState === "complete"){
            let param = {sdp:chatTool.localSdp,cd:chatTool.localCd};
            chatTool.installRes(param);
        }
    },
    //保存pc.oncandidate返回的cd
    saveLocalCD(evt) {
        chatTool.iceLocalState = evt.target.iceGatheringState;
        (evt.target.iceGatheringState === "complete")
            ? chatTool.completeLocalCd(chatTool.localCd)
            : chatTool.localCd.push(evt.candidate);
    },
    //展示LocalCd
    completeLocalCd(data) {
        if(chatTool.localSdp){
            let param = {sdp:chatTool.localSdp,cd:chatTool.localCd};
            chatTool.installRes(param);
        }
    },
    //接收从后台发过来的cd
    saveRemoteCd(evt) {
        if (evt.isCaller !== chatTool.isCaller) {
            chatTool.remoteCd = evt.cd;
        }
    },
    //将后台发过来的cd设置进pc
    addRemoteCd() {
        chatTool.remoteCd.forEach(item => {
            chatTool.pc.addIceCandidate(new RTCIceCandidate(item))
                .then(function () {
                    console.log("addIceCandidate");
                })
                .catch(function (err) {
                    console.log("addIceCandidate failed", err)
                })
        })
    },
    //保存后台发送过来的sdp
    saveRemoteSdp(sdp) {
        chatTool.remoteSdp = sdp;
    },
    //将后台发送过来了的sdp设置为pc的remoteSdp
    setRemoteSdp() {
        chatTool.pc.setRemoteDescription(chatTool.remoteSdp, function () {
            chatTool.setLocalSdp();
        }, function (err) {
        });
    },
    //播放远程视频
    showRemoteVideo(evt) {
        chatTool.remoteVideoPlayer.srcObject = evt.streams[0];
    },
};