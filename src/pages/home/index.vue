<template>
    <div class="home">
        <div class="chat-media-route">
            <mediaRoute></mediaRoute>
        </div>
        <div class="home-room-list" ref="leftSide">
            <roomToolPart></roomToolPart>
            <roomListPart></roomListPart>
        </div>
        <div class="home-room-chatting" ref="chattingBoard" @click="hideLeftRight">
            <div class="home-room-chatting-list"></div>
            <div class="home-room-chatting-current">
                <chatPart></chatPart>
            </div>
        </div>
        <div class="home-room-member" ref="rightSide">
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
    import slideListener from "@src/plugins/touch/slide";

    export default {
        components: {
            chatPart,
            navPart,
            roomListPart,
            roomToolPart,
            userToolPart,
            userListPart,
            mediaRoute,
        },
        data() {
            return {
                slide: null,
                curSide: "",
            }
        },
        methods: {
            bodyResize() {
                document.querySelector("body").style.height = window.innerHeight + "px";
            },
            slideHandle(direc) {
                switch (direc) {
                    case "left":
                        if (this.curSide === "left") return this.hideCurSide();
                        this.hideLeftSide();
                        this.showRightSide();
                        this.curSide = "right";
                        return;
                    case "right":
                        if (this.curSide === "right") return this.hideCurSide();
                        this.hideRightSide();
                        this.showLeftSide();
                        this.curSide = "left";
                        return;
                    default:
                }
            },
            hideCurSide() {
                this.hideLeftSide();
                this.hideRightSide();
                this.curSide = '';
            },
            hideLeftSide() {
                this.$refs.leftSide.style.left = "-100%";
            },
            showLeftSide() {
                this.$refs.leftSide.style.left = 0;
            },
            showRightSide() {
                this.$refs.rightSide.style.right = 0;
            },
            hideRightSide() {
                this.$refs.rightSide.style.right = "-100%";
            },
        },
        mounted() {
            this.bodyResize();
            window.addEventListener("resize", this.bodyResize);
            window.SYRESOURCE.chatSocket = io.connect();
            this._$eventBus.$emit("chatSocketConnected");
            this.slide = slideListener(this.slideHandle);
            this.slide.startListener(document);
        },
        destroyed() {
            /**
             * 清除所有eventBus事件
             */
            this._$eventBus.$off();
            this.slide.clearListener(document);
        }
    }
</script>
<style>
    .home {
        display: flex;
        height: 100%;
        overflow: hidden;
    }

    .home-room-list, .home-room-member {
        width: 30%;
    }

    .home-room-chatting {
        width: 100%;
        height: 100%;
    }

    .home-room-chatting-list {

    }

    .home-room-chatting-current {
        height: 100%;
    }

    .chat-media-route {
        position: fixed;
        bottom: 0;
        width: 100%;
        background: #000;
        text-align: center;
        z-index: 1;
        color: #fff;
    }

    @media screen and (max-width: 500px) {
        .home {
            position: relative;
        }

        .home-room-list, .home-room-member {
            position: absolute;
            width: 100%;
            background: #fff;
            transition: left .5s, right .5s;
            height: 100%;
        }

        .home-room-list {
            left: -100%;
            top: 0;
        }

        .home-room-member {
            right: -100%;
            top: 0;
        }
    }
</style>