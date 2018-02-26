<template>
    <div class="chat-room">
        <h1 class="tit" id="room-tit" v-text="roomName"></h1>
        <div class="content">
            <p class="chat-line"
               v-for="item in mesModel">
                <span class="chat-moment chat-member"
                      :class="{'chat-moment-me':item.userId==userId}"
                      v-text="item.nickname"></span>
                <span class="chat-moment"
                      :class="{'chat-moment-me':item.userId==userId}"
                      v-text="item.moment"></span>
                <span class="chat-mess"
                      :class="{'chat-mess-me':item.userId==userId}"
                      v-text="item.txt"></span>
                <span class="chat-in" v-text="memberIn"></span>
                <span class="chat-out" v-text="memberOut"></span>
            </p>
        </div>
        <form class="tool">
            <div class="write-board">
                <input type="text" name="write" class="write-box" v-model.trim="txtSend">
            </div>
            <a href="javascript:" class="send" @click = "sendMess">发送</a>
        </form>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                roomName: "",
                roomId:"",
                roomCurrentDetail:null,
                userId: "",
                userInfo:null,
                txtSend: "",
                mesModel: []
            }
        },
        methods: {
            roomCurrentChange(roomName) {
                this.roomName && this.socketRoomLeave();
                this.roomName = roomName;
                this.getRoomId(roomName);
                this.mesModel = [];
            },
            getRoomId(roomName){
                let params = {roomName:roomName};
                let path = window.SYRESOURCE.room;
                this.$http
                    .get(path,{params:params})
                    .then(res=>{
                        res.body.code===200
                            ?this.getRoomIdSucceed(res)
                            :this.errHandle(res);
                    },err=>{})
            },
            getRoomIdSucceed(res){
                this.roomCurrentDetail = res.body.data;
                this.roomId = res.body.data.roomId;
                this.socketRoomJoin();
            },
            sendMess(){
                this.txtSend && this.socketTxtSend();
            },
            socketRoomJoin(){
                let mes = {
                    type:"roomJoin",
                    roomId:this.roomId,
                    data:{
                        userId:this.userId,
                        nickname:this.userInfo.nickname
                    }
                };
                window.SYRESOURCE.chatSocket.emit("clientMes",mes);
            },
            socketRoomLeave(){
                let mes = {
                    type:"roomLeave",
                    roomId:this.roomId,
                };
                window.SYRESOURCE.chatSocket.emit("clientMes",mes)
            },
            socketTxtSend(){
                let mes = {
                    type:"chatTxt",
                    roomId:this.roomId,
                    data:{
                        txt:this.txtSend,
                    }
                };
                window.SYRESOURCE.chatSocket.emit("clientMes",mes);
            },
            socketMesGet(mes){
                var date = new Date();
                var content = {
                    type: mes.type,
                    txt: mes.data.txt,
                    img:mes.data.img,
                    userId: mes.userInfo.userId,
                    nickname: mes.userInfo.nickname,
                    moment: `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
                                + ` ${date.getHours()}:${date.getMinutes()}`,
                    memberIn: mes.type==="roomJoin" ? `${mes.userInfo.userName}进入了房间` : "",
                    memberOut: mes.type==="roomLeave" ? `${mes.userInfo.userName}离开了房间` : "",
                };
                this.mesModel.push(content);
                console.log(mes,content,"yyyyyyyyyyyyyyyy");
            },
            errHandle(res){
               console.error(res.body.data)
            },
            socketLink(){
                let chatSocket = io.connect();
                window.SYRESOURCE.chatSocket = chatSocket;
            }
        },
        mounted() {
            let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
            this.userInfo = userInfo;
            this.userId = userInfo.userId;
            this._$eventBus.$on("roomChecked", this.roomCurrentChange);
            this.socketLink();
            window.SYRESOURCE.chatSocket.on("serverMes",this.socketMesGet);
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
        color: #000;
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