<template>
    <router-view></router-view>
</template>
<script>
    import RtcTool from "./RTC.js";

    export default {
        data() {
            return {
                isCaller: false,
                chatSocket: null,
                user: null,
                roomId: "",
            }
        },
        methods: {
            chatMediaHandle(user, chatType, roomId) {
                switch (chatType.id) {
                    case "video":
                        this.isCaller = true;
                        return this.videoChatHandle(user, roomId);
                    case "audio":
                        return this.audioChatHandle(user, roomId);
                    default:
                        return;
                }
            },
            videoChatHandle(user, roomId, sdp, cd) {
                this.roomId = roomId;
                this.targetUser = user;
                this.$router.push({name: "视频通话"});
                let remoteVideo = document.querySelector("#remoteVideo");
                let localVideo = document.querySelector("#localVideo");
                RtcTool.install(localVideo, remoteVideo, this.isCaller, sdp, cd)
                    .then(this.sendLocalRtc);
            },
            sendLocalRtc(params) {
                let mes = {
                    type: "chatVideo",
                    roomId: this.roomId,
                    targetUser: {
                        nickname: this.targetUser.nickname,
                        userId: this.targetUser.userId,
                    },
                    data: params,
                };
                window.SYRESOURCE.chatSocket.emit("clientMes", mes);
            },
            getRemoteRtc(mes) {
                if (mes.type !== "chatVideo") return;
                this.isCaller
                    ? this.videoChatHandle(mes.userInfo, mes.roomId,mes.data.sdp,mes.data.cd)
                    : RtcTool.setRemote(mes.data.sdp,mes.data.cd);
            },
            audioChatHandle(user, roomId) {
                this.$router.push({name: "语音通话"});
            },

        },
        mounted() {
            this._$eventBus.$on("chatMedia", this.chatMediaHandle);
            this._$eventBus.$on("chatSocketConnected",()=>{
                window.SYRESOURCE.chatSocket.on("serverMes", this.getRemoteRtc);
            });
        },
        destroyed() {
            this._$eventBus.$off("chatMedia");
            this._$eventBus.$off("chatSocketConnected");
        }
    }
</script>