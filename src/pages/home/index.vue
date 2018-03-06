<template>
    <div class="home">
        <div class="chat-media-route">
            <mediaRoute></mediaRoute>
        </div>
        <div class="home-room-list">
            <roomToolPart></roomToolPart>
            <roomListPart></roomListPart>
        </div>
        <div class="home-room-chatting">
            <div class="home-room-chatting-list"></div>
            <div class="home-room-chatting-current">
                <chatPart></chatPart>
            </div>
        </div>
        <div class="home-room-member">
            <userToolPart></userToolPart>
            <userListPart></userListPart>
        </div>
    </div>
</template>
<script>
    import chatPart from "./chat-part.vue";
    import navPart from "./nav-part.vue";
    import roomListPart from "./room-list-part.vue";
    import roomToolPart from "./room-tool-part.vue";
    import userToolPart from "./user-tool-part.vue";
    import userListPart from "./user-list-part.vue";
    import mediaRoute from "@pages/chat-media/media-route.vue";
    export default {
        components:{
            chatPart,
            navPart,
            roomListPart,
            roomToolPart,
            userToolPart,
            userListPart,
            mediaRoute
        },
        data() {
            return {
            }
        },
        methods:{
            bodyResize(){
                document.querySelector("body").style.height = window.innerHeight + "px";
            },
        },
        mounted(){
            this.bodyResize();
            window.addEventListener("resize",this.bodyResize);
            window.SYRESOURCE.chatSocket = io.connect();
            this._$eventBus.$emit("chatSocketConnected");
        },
        destroyed(){
            /**
             * 清除所有eventBus事件
             */
            this._$eventBus.$off();
        }
    }
</script>
<style>

    .home{
        display: flex;
        height: 100%;
    }
    .home-room-list,.home-room-member{
        width: 30%;
        /*border: 1px solid #f00;*/
    }
    .home-room-chatting{
        width: 100%;
        height: 100%;
    }
    .home-room-chatting-list{

    }
    .home-room-chatting-current{
        height: 100%;
    }
    .chat-media-route{
        position: fixed;
        bottom: 0;
        width: 100%;
        background: #000;
        text-align: center;
        z-index: 1;
        color: #fff;
    }
</style>