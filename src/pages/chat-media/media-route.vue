<template>
    <router-view></router-view>
</template>
<script>
    import RtcTool from "./RTC.js";

    export default {
        data() {
            return {
                chatSocket: null,
                user:null,
                roomId:"",
            }
        },
        methods: {
            chatMediaHandle(user, chatType, roomId) {
                switch (chatType.id) {
                    case "video":
                        return this.videoChatHandle(user, roomId);
                    case "audio":
                        return this.audioChatHandle(user, roomId);
                    default:
                        return;
                }
            },
            videoChatHandle(user, roomId) {
                this.roomId = roomId;
                this.targetUser= user;
                this.$router.push({name: "视频通话"});
                let remoteVideo = document.querySelector("#remoteVideo");
                let localVideo = document.querySelector("#localVideo");
                let isCaller = true;
                RtcTool.install(localVideo, remoteVideo, isCaller)
                    .then(this.sendLocalRtc);
            },
            sendLocalRtc(params) {
                let mes = {
                    type:"chatVideo",
                    roomId:this.roomId,
                    targetUser:{
                        nickname:this.targetUser.nickname,
                        userId:this.targetUser.userId,
                    },
                    data:params,
                };
                window.SYRESOURCE.chatSocket.emit("clientMes",mes);
            },
            audioChatHandle(user, roomId) {
                this.$router.push({name: "语音通话"});
            },
        },
        mounted() {
            this._$eventBus.$on("chatMedia", this.chatMediaHandle);
        },
        destroyed() {
            this._$eventBus.$off("chatMedia");
        }
    }
</script>