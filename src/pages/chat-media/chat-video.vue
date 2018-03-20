<template>
    <div>
        <video class="remote-video" id="remoteVideo" autoplay></video>
        <video class="local-video" id="localVideo" autoplay></video>
    </div>
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

        }
    }
</script>
<style>
    .remote-video{
        display: inline-block;
        width: 50%;
    }
    .local-video{
        display: none;
        width: 50%;
    }
</style>