<template>
    <div class="home">
        <div class="home-room-list">
            <toolPart></toolPart>
            <listPart></listPart>
        </div>
        <div class="home-room-chatting">
            <div class="home-room-chatting-list"></div>
            <div class="home-room-chatting-current">
                <chatPart></chatPart>
            </div>
        </div>
        <div class="home-room-member"></div>
    </div>
</template>
<script>
    import chatPart from "./chat-part.vue";
    import navPart from "./nav-part.vue";
    import listPart from "./list-part.vue";
    import toolPart from "./tool-part.vue";
    export default {
        components:{
            chatPart,
            navPart,
            listPart,
            toolPart,
        },
        data() {
            return {}
        },
        mounted(){
            document.querySelector("body").style.height = window.innerHeight + "px";
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
</style>