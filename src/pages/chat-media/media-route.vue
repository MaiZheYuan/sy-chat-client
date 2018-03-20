<template>
    <router-view></router-view>
</template>
<script>
    import Rtc from "./RTC.js";
    import {EventBus} from "@src/EventBus/EventBus";

    export default {
        data() {
            return {
                isCaller: false,
                chatSocket: null,
                user: null,
                roomId: "",
                rtcTool:null,
                targetUser:null,
            }
        },
        methods: {
            chatMediaHandleCaller(user, chatType, roomId) {
                switch (chatType.id) {
                    case "video":
                        this.isCaller = true;
                        return this.videoChatHandleCaller(user, roomId);
                    case "audio":
                        return this.audioChatHandle(user, roomId);
                    default:
                        return;
                }
            },
            videoChatHandleCaller(user, roomId, sdp, cd) {
                this.roomId = roomId;
                this.targetUser = user;
                this.$router.push({name: "视频通话"});
                this.$nextTick(function () {
                    let remoteVideo = document.querySelector("#remoteVideo");
                    let localVideo = document.querySelector("#localVideo");
                    this.rtcTool = Rtc.install(localVideo, remoteVideo);
                    this.rtcTool.caller.setLocal();
                });
            },
            sendLocalRtc(params) {
                let mes = {
                    type: "chatVideo",
                    roomId: window.$ROOMID,
                    targetUser: {
                        nickname: this.targetUser.nickname,
                        userId: this.targetUser.userId,
                    },
                    data: params,
                    userInfo:JSON.parse(sessionStorage.getItem("userInfo"))
                };
                window.SYRESOURCE.chatSocket.emit("clientMes", mes);
                console.log("sendLocal",mes);
            },
            getRemoteRtc(mes) {
                if (mes.type !== "chatVideo") return;
                console.log("getRemote",mes);
                this.isCaller
                    ? this.rtcTool.caller.setRemote(mes.data.sdp, mes.data.cd)
                    : (()=>{
                        this.targetUser = mes.userInfo;
                        this.$router.push({name: "视频通话"});
                        this.$nextTick(function () {
                            let remoteVideo = document.querySelector("#remoteVideo");
                            let localVideo = document.querySelector("#localVideo");
                            this.rtcTool = Rtc.install(localVideo, remoteVideo);
                            this.rtcTool.answerer.setRemote(mes.data.sdp, mes.data.cd);
                        });
                    })()
            },
            audioChatHandle(user, roomId) {
                this.$router.push({name: "语音通话"});
            },

        },
        mounted() {
            this._$eventBus.$on("chatMedia", this.chatMediaHandleCaller);
            this._$eventBus.$on("chatSocketConnected",()=>{
                window.SYRESOURCE.chatSocket.on("serverMes", this.getRemoteRtc);
            });
            EventBus.bus.addListener(EventBus.localRtcDone,this.sendLocalRtc);
        },
        destroyed() {
            this._$eventBus.$off("chatMedia");
            this._$eventBus.$off("chatSocketConnected");
            EventBus.bus.removeListener(EventBus.localRtcDone,this.sendLocalRtc);
        }
    }
</script>