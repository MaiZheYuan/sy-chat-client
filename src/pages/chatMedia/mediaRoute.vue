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
        mounted(){
            let chatSocket = window.SYRESOURCE.chatSocket;
            let remoteVideo = document.querySelector("#remoteVideo");
            let localVideo = document.querySelector("#localVideo");
            RtcTool.install(localVideo,remoteVideo,chatSocket);
        }
    }
</script>