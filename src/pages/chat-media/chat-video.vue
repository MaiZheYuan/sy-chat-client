<template>
    <div>
        <video id="remoteVideo" autoplay></video>
        <video id="localVideo" autoplay></video>
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