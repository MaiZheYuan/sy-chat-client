<template>
    <div class="chat-room">
        <h1 class="tit" id="room-tit" v-text="roomCurrent"></h1>
        <div class="content">
            <p class="chat-line"
               v-for="item in mesModel">
                <span class="chat-moment chat-member"
                      :class="{'chat-moment-me':item.userId==userId}"
                      v-text="item.userName"></span>
                <span class="chat-moment"
                      :class="{'chat-moment-me':item.userId==userId}"
                      v-text="item.moment"></span>
                <span class="chat-mess"
                      :class="{'chat-mess-me':item.userId==userId}"
                      v-text="item.message"></span>
            </p>
        </div>
        <form class="tool">
            <div class="write-board">
                <input type="text" name="write" class="write-box" v-model="userMes">
            </div>
            <a href="javascript:" class="send">发送</a>
        </form>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                roomCurrent: "",
                userId: "",
                userMes: "",
                mesModel: [
                    {
                        type: "txt",
                        message: "我的施蒂利克防腐剂圣",
                        userId: "3435",
                        userName: "搜索",
                        moment: "2017/01/02"
                    },
                    {
                        type: "txt",
                        message: "我",
                        userId: "ksldfjk",
                        userName: "搜索",
                        moment: "2017/01/02"
                    },
                    {
                        type: "txt",
                        message: "的发送的方式的方式的发是多少的发斯蒂芬斯蒂芬",
                        userId: "ksldfjk",
                        userName: "搜索",
                        moment: "2017/01/02"
                    }, {
                        type: "txt",
                        message: "水电费人认为日本454546454645454",
                        userId: "ksldfjk",
                        userName: "搜索",
                        moment: "2017/01/02"
                    }
                ]
            }
        },
        methods: {
            roomCurrentChange(roomName) {
                this.roomCurrent = roomName;
            }
        },
        mounted() {
            let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
            this.userId = userInfo.userId || "";
            this._$eventBus.$on("roomCurrentChange", this.roomCurrentChange);
        }
    }
</script>
<style>
    .chat-room {
        box-sizing: border-box;
        padding: 5px;
        width: 100%;
        height: 100%;
        max-width: 1000px;
        margin: auto;
        display: flex;
        flex-direction: column;
    }

    .tit {
        box-sizing: border-box;
        text-align: center;
        vertical-align: middle;
        border: 1px solid #000;
        border-radius: 5px;
        font-size: 30px;
        font-weight: bold;
        height: 60px;
        line-height: 60px;
    }

    .content {
        box-sizing: border-box;
        margin-top: 10px;
        border-radius: 2px;
        border: 1px solid #000;
        height: 100%;
        padding: 20px;
        overflow: auto;
    }

    .tool {
        text-align: center;
        margin-top: 10px;
        padding: 5px;
        display: flex;
        border: 1px solid #000;
        border-radius: 5px;
        align-items: center;
    }

    .write-board {
        box-sizing: border-box;
        width: 100%;
        padding: 10px;
    }

    .write-box {
        /*text-indent: 20px;*/
        border: none;
        width: 100%;
        /*padding: 10px;*/
        white-space: normal;
        word-wrap: break-word;
        word-break: break-all;
    }

    .send {
        display: inline-block;
        padding: 0 5px;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .send:hover {
        color: #0af;
    }

    .chat-line {
        margin-top: 10px;
        overflow: hidden;
    }

    .chat-man {
        float: left;
        display: inline-flex;
        width: 35px;
        height: 35px;
        margin: 7px 10px 5px 0;
        border-radius: 50%;
        font-weight: bold;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        border: 3px solid #aaa;
        background: #000;
        color: #fff;
    }

    .chat-moment {
        font-size: 10px;
        display: block;
    }

    .chat-member {
        font-size: 16px;
        font-weight: bold;
    }

    .chat-mess {
        box-sizing: border-box;
        display: inline-block;
        max-width: 60%;
        overflow: hidden;
        border: 1px solid #ccc;
        padding: 6px;
        border-radius: 3px;
        background: rgba(100, 100, 100, 0.8);
        color: #fff;
        white-space: normal;
        word-wrap: break-word;
        word-break: break-all;
    }

    .chat-moment-me {
        text-align: right;
    }

    .chat-man-me {
        background: #eee;
        color: #000;
        border-color: #aaa;
        float: right;
        margin: 7px 0 5px 10px;
    }

    .chat-mess-me {
        float: right;
    }

    .chat-in {
        display: block;
        text-align: center;
        font-size: 10px;
        color: rgb(0, 100, 255);
    }

    .chat-out {
        display: block;
        text-align: center;
        font-size: 10px;
        color: rgb(255, 100, 0);
    }
</style>