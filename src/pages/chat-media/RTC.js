import { EventBus } from "@src/EventBus/EventBus";
let PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
let iceServer = {
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
};//p2p连接服务
let mediaModel = null; //数据缓存区

export default {
    install(localVideo, remoteVideo) {
            mediaModel = {
                iceGatheringState:null,//本地cd收集状态
                remoteVideoPlayer: remoteVideo,//播放远程视频的vedio标签
                localVideoPlayer: localVideo,//播放本地视频的vedio标签
                pc: null,//PeerConnection实例
                localCd: [],//本地candidate
                remoteCd: [],//远程candidate
                localSdp: null,//本地description
                remoteSdp: null,//远程description
            };
            mediaModel.pc = new PeerConnection(iceServer);
            mediaModel.pc.ontrack = showRemoteVideo;
            mediaModel.pc.onicecandidate = saveLocalCD;
            return tool;
    },
};
let tool = {
    caller: {
        setLocal(options = {audio: false, video: true}) {
            return new Promise(function (res, rej) {
                getMedia(options)
                    .then(linkLocalVideo)
                    .then(createOffer)
                    .then(localCompete)
                    .catch();
            });
        },
        setRemote(remoteSdp, remoteCd) {
            mediaModel.remoteSdp = remoteSdp;
            mediaModel.remoteCd = remoteCd;
            return new Promise(function (rs, rj) {
                setRemoteSdp()
                    .then(addRemoteCd)
                    .then(rs)
                    .catch(rj)
            })
        },
    },
    answerer: {
        setRemote(remoteSdp, remoteCd,options = {audio: false, video: true}, ) {
            mediaModel.remoteSdp = remoteSdp;
            mediaModel.remoteCd = remoteCd;
            return new Promise(function (res, rej) {
                getMedia(options)
                    .then(linkLocalVideo)
                    .then(setRemoteSdp)
                    .then(addRemoteCd)
                    .then(createAnswer)
                    .then(localCompete)
                    .catch();
            });
        },
    },
};
//播放远程视频
function showRemoteVideo(evt) {
    mediaModel.remoteVideoPlayer.srcObject = evt.streams[0];
};

//保存pc.oncandidate返回的本地cd
function saveLocalCD(evt) {
    let state = mediaModel.iceGatheringState = evt.target.iceGatheringState;
    (state === "complete")
        ? localCompete()
        : mediaModel.localCd.push(evt.candidate);
};

//获取摄像头权限
function getMedia(options) {
    return navigator.mediaDevices.getUserMedia(options); //promise
};

//播放、链接本地视频
function linkLocalVideo(mediaStream) {
    return new Promise(function (rs, rj) {
        mediaModel.pc.addStream(mediaStream);
        mediaModel.localVideoPlayer.srcObject = mediaStream;
        rs();
    })
};

//将后台发过来的cd设置进pc
function addRemoteCd() {
    return new Promise(function (rs,rj) {
        mediaModel.remoteCd.forEach((item, index) => {
            mediaModel.pc.addIceCandidate(new RTCIceCandidate(item));
            if (index === mediaModel.remoteCd.length - 1) {
                rs();
            }
        })
    })
};

//将后台发送过来了的sdp设置为pc的remoteSdp
function setRemoteSdp() {
    return new Promise(function (rs, rj) {
        mediaModel.pc.setRemoteDescription(mediaModel.remoteSdp, rs, rj);
    })
};

//caller setLocal
function createOffer() {
    return new Promise(function (rs, rj) {
        let pc = mediaModel.pc;
        pc.createOffer(
            function (sdp) {
                pc.setLocalDescription(sdp, ()=>{
                        mediaModel.localSdp = pc.localDescription;
                        rs();
                    }, error => {console.error("mediaStart,setLocalDescription#" + error)});
            }, error => {console.error("mediaStart,createOffer#" + error)}
        );
    })
};

//answerer setLocal
function createAnswer() {
    return new Promise(function (rs, rj) {
        let pc = mediaModel.pc;
        pc.createAnswer(function (sdp) {
            pc.setLocalDescription(sdp, function () {
                let localSdp = pc.localDescription;
                mediaModel.localSdp = localSdp;
                rs();
            }, error => {
                console.error("mediaStart,setLocalDescription#" + error)
            });
        }, error => {
            console.error("mediaStart,createOffer#" + error)
        });
    })
};

//本地cd,sdp准备完毕
function localCompete() {
        if(mediaModel.iceGatheringState!=="complete" || !mediaModel.localSdp) return;
        let params = {
            sdp:mediaModel.localSdp,
            cd:mediaModel.localCd,
        };
        EventBus.bus.emit(EventBus.localRtcDone,params);
}