<template>
    <ul class="user-list">
        <li class="user-list-item" v-for="item in userList">
            <span class="user-list-item-content" v-text="item.nickname"
                  :class="{'user-list-item-inline':item.isInRoom}"
                  :title="item.nickname"></span>
            <span v-text="item.role" class="user-list-item-role"></span>
        </li>
    </ul>
</template>
<script>
    export default {
        data() {
            return {
                userList: [],
                roleType: {
                    0: "房主"
                },
                userSelfInfo: null,
            }
        },
        methods: {
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
                this.userList = res.body.data;
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

    .user-list-item:hover .user-list-item-content {
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
</style>