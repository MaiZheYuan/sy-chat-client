<template>
    <router-view></router-view>
</template>
<script>
    import RtcTool from "./RTC.js";
    export default {
        data() {
            return {
                chatSocket:null,
            }
        },
        methods:{
            chatMediaHandle(user,chatType,roomId){
                switch (chatType.id){
                    case "video": return this.videoChatHandle(user,roomId);
                    case "audio": return this.audioChatHandle(user,roomId);
                    default: return;
                }
            },
            videoChatHandle(user,roomId){
                this.$router.push({name:"视频通话"});
                let chatSocket = window.SYRESOURCE.chatSocket;
                let remoteVideo = document.querySelector("#remoteVideo");
                let localVideo = document.querySelector("#localVideo");
                RtcTool.install(localVideo,remoteVideo,chatSocket);
            },
            audioChatHandle(user,roomId){
                this.$router.push({name:"语音通话"});
            },
        },
        mounted(){
            this._$eventBus.$on("chatMedia", this.chatMediaHandle);
        },
        destroyed(){
            this._$eventBus.$off("chatMedia");
        }
    }
</script>