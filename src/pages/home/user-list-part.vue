<template>
    <ul class="user-list">
        <li class="user-list-item"
            v-for="item in userList"
            @click="userSelect(item)">
            <span class="user-list-item-content" v-text="item.nickname"
                  :class="{'user-list-item-inline':item.isInRoom,'active':item.isActive}"
                  :title="item.nickname"></span>
            <span v-text="item.role" class="user-list-item-role"></span>
            <transition name="slide-down">
                <div class="media-btn-box" v-if="item.isActive">
                    <span class="audio-btn"
                          v-for="meItem in mediaList"
                          :key="meItem.id"
                          v-text="meItem.tit"
                          @click="mediaStart(item,meItem)"></span>
                </div>
            </transition>
        </li>
    </ul>
</template>
<script>
    export default {
        data() {
            return {
                curUser:null,
                userList: [],
                mediaList:[
                    {tit:"语言通话",id:"audio"},
                    {tit:"视频通话",id:"video"},
                ],
                roleType: {
                    0: "房主"
                },
                userSelfInfo: null,
            }
        },
        methods: {
            userSelect(item){
                this.curUser && ( this.curUser.isActive=false );
                item.isActive = true;
                this.curUser = item;
            },
            getRoomUserList(roomId) {
                let params = {roomId: roomId};
//                if( !params ) {return this.$router.push({name:"user"});};
                let path = window.SYRESOURCE.roomMembers;
                this.$http
                    .get(path, {params: params})
                    .then(res => {
                        res.body.code === 200
                            ? this.succeedHandle(res)
                            : this.errHandle();
                    }, err => {
                    })
            },
            showRoomUserList(res) {
                var data = res.body.data || [];
                this.userList = data.map(item => {
                    item.isInRoom = ( item.userId === this.userSelfInfo.userId );
                    return item;
                })
            },
            succeedHandle(res) {
                res.body.data[0] && ( res.body.data[0].role = this.roleType[0]);
                this.userList = res.body.data.map(item=>{
                    item.isActive = false;
                    return item;
                });
//                this.showRoomUserList(res);
            },
            errHandle() {
            },
            userFind(userId) {
                for (let user of this.userList) {
                    if (user.userId === userId) {
                        return user
                    };
                }
            },
            userIn(userId,roomId) {
                let user;
                if(userId === this.userSelfInfo.userId) { return this.getRoomUserList(roomId) };
                user = this.userFind(userId);
                user
                    ?(user.isInRoom = true)
                    :(this.getRoomUserList(roomId));
            },
            userOut(userId) {
                if(userId === this.userSelfInfo.userId) { return };
                let user = this.userFind(userId);
                user.isInRoom = false;
            },
            mediaStart(userItem,mediaItem){

            },
        },
        mounted() {
            let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
            this.userSelfInfo = userInfo;
//            this.getRoomUserList();
//            this._$eventBus.$on("roomChecked", this.getRoomUserList);
            this._$eventBus.$on("userIn", this.userIn);
            this._$eventBus.$on("userOut", this.userOut);
        }
    }
</script>
<style>
    .user-list {
        padding: 10px 20px;
        color: #777;
    }

    .user-list-item {
        padding-top: 10px;
        cursor: pointer;
    }

    .user-list .active,.user-list-item:hover .user-list-item-content {
        color: #000;
        font-weight: bold;
        text-shadow: 1px 0 1px rgba(0, 0, 0, 1);
        border-color: transparent;
    }

    .user-list-item-role {
        padding: 0 2px;
        font-size: 0.4em;
        vertical-align: top;
        background: linear-gradient(to right bottom, #f00, #F60, #699, #06C, #909, #FF0);
        -webkit-background-clip: text;
        color: transparent;
    }

    .user-list-item-content {
        border-bottom: 1px solid #eee;
        max-width: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #aaa;
    }

    .user-list-item-status {
        padding: 0 2px;
        font-size: 0.4em;
        vertical-align: bottom;
        color: #ccc;
    }

    .user-list-item-inline {
        color: #000;
    }
    .media-btn-box{
        background: #000;
        color: #aaa;
        overflow: hidden;
        margin-top: 5px;
        text-align: center;
    }
    .slide-down-enter-active, .slide-down-leave-active {
        transition: all .5s;
    }

    .slide-down-enter, .slide-down-leave-to {
        transform: scaleY(0);
    }
    .audio-btn:hover,.video-btn:hover{
        color: #fff;
    }
    .video-btn,.audio-btn{
        line-height: 2;
        display: inline-block;
        margin: 0 6px;
    }
</style>