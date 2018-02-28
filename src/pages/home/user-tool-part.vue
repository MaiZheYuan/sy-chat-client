<template>
    <div class="tool-part user-tool-part" @mouseleave="curItemDerective">
        <ul class="tool-part-list">
            <li class="tool-part-list-item" v-for="item in toolList"
                :class="{active:item.isActive}">
                <span v-text="item.tit" @click="toolSelect(item,$event)"></span>
            </li>
        </ul>
        <div class="tool-part-form-box">
            <form class="tool-part-form" :key="'search'">
                <div>
                    <transition name="shrink">
                        <input type="text" class="tool-part-input"
                               :placeholder="`账号：${userInfo.userId||''}`"
                               v-show="curToolListItem"
                               v-model.trim="roomName"
                               disabled='disabled'
                               key="userId">
                    </transition>
                </div>
                <div>
                    <transition name="shrink">
                        <input type="text" class="tool-part-input"
                               :placeholder="`用户名：${userInfo.nickname||''}`"
                               v-show="curToolListItem" v-model.trim="roomName"
                               disabled='disabled'
                               key="nickname">
                    </transition>
                </div>
                <div>
                    <transition name="shrink">
                        <input type="text" class="tool-part-input"
                               :placeholder="`座右铭：${userInfo.descript||''}`"
                               v-show="curToolListItem"
                               v-model.trim="roomName"
                               disabled='disabled'
                               key="descript">
                    </transition>
                </div>
                <!--                <div class="tool-part-form-confir">
                                    <a class="tool-part-confirm-btn" v-show="curToolListItem"
                                       @click="toolFormConfirm">确定</a>
                                </div>-->
            </form>
            <ul class="tool-part-result">
                <li class="tool-part-result-form" v-if="isShowResultForm">
                    <input class="tool-part-result-input" v-model.trim="roomPassword"
                           type="text" placeholder="请输入房间口令">
                    <span class="tool-part-result-btn" @click="roomJoinComfirm">确定</span>
                </li>
                <li class="tool-part-result-item" v-for="item in searchResultList"
                    :class="{'result-active':item.isActive}"
                    v-text="item.roomName" @click="joinRoomClickHandle(item)"></li>
            </ul>
        </div>
    </div>
</template>
<script>
    import inputPart from "@components/promptPart.vue";

    export default {
        components: {
            inputPart
        },
        data() {
            return {
                roomName: "",
                roomPassword: "",
                toolList: [
                    {tit: "个人信息", isActive: false, action: "userInfo"},
                    {tit: "登录/注册", isActive: false, action: "login"},
                ],
                curToolListItem: null,
                searchResultList: [],
                curResultItem: null,
                isShowResultForm: false,
                userInfo: null,
            }
        },
        methods: {
            toolSelect(item) {
                if(item.action === "login") { return this.$router.push({name:"signIn"}) };
                this.curItemDerective();
                this.curToolListItem = item;
                item.isActive = true;
            },
            curItemDerective() {
                this.curToolListItem && (this.curToolListItem.isActive = false);
                this.curToolListItem = null;
                /*                this.roomName = null;
                                this.roomPassword = null;
                                this.searchResultList = [];
                                this.isShowResultForm = false;
                                this.curResultItem && ( this.curResultItem.isActive = false );
                                this.curResultItem = null;*/
            },
            isShowCalc(type) {
                return this.curToolListItem && this.curToolListItem.action === type;
            },
            /*            toolFormConfirm() {
                            switch (this.curToolListItem.action) {
                                case "create":
                                    return this.roomCreate();
                                case "search":
                                    return this.roomSearch();
                                default:
                                    return false;
                            }
                        },
                        roomCreate() {
                            if (!this.roomPassword || !this.roomName) {
                                return false;
                            }
                            ;
            //                if(!this.userInfo) { this.$router.push({name:"user"}) };
                            let path = window.SYRESOURCE.rooms;
                            let params = {
                                roomPassword: this.roomPassword,
                                roomName: this.roomName,
                                userId: this.userInfo.userId
                            };
                            this.$http.post(path, {params: params}).then(res => {
                                this.roomCreateHandle(res).then(
                                    this.roomCreateSucceed,
                                    this.roomCreateFailed
                                )
                            }, err => {
                            })
                        },
                        roomCreateHandle(res) {
                            return new Promise((rs, rj) => {
                                let code;
                                200 === (code = res.body.code)
                                    ? rs()
                                    : rj(code)
                            })
                        },
                        roomCreateSucceed() {
                            this._$eventBus.$emit("roomCreated");
            //                alert("新建成功！")
                        },
                        roomCreateFailed(code) {
                            alert("新建失败！")
                        },
                        roomSearch() {
                            if (!this.roomName) {
                                return false;
                            }
                            ;
                            let path = window.SYRESOURCE.rooms;
                            let params = {roomName: this.roomName};
                            this.$http.get(path, {params: params}).then(res => {
                                this.roomSearchHandle(res).then(
                                    this.roomSearchSucceed,
                                    this.roomSearchFailed
                                )
                            }, err => {
                            })
                        },
                        roomSearchHandle(res) {
                            return new Promise((rs, rj) => {
                                let code;
                                200 === (code = res.body.code)
                                    ? rs(res)
                                    : rj(code)
                            })
                        },
                        roomSearchSucceed(res) {
                            this.searchResultList = res.body.data;
                        },
                        roomSearchFailed(code) {
                            alert("搜索失败！")
                        },
                        joinRoomClickHandle(item) {
                            if (this.curResultItem === item) return;
                            this.curResultItem && ( this.curResultItem.isActive = false );
                            this.curResultItem = item;
                            item.isActive = true;
                            this.isShowResultForm = true;
                        },
                        roomJoinComfirm() {
                            if (!this.roomPassword) {
                                return false;
                            }
                            ;
            //                if(!this.userInfo) { this.$router.push({name:"user"}) };
                            let path = window.SYRESOURCE.roomMembers;
                            let params = {
                                roomPassword: this.roomPassword,
                                roomName: this.curResultItem.roomName,
                                userId: this.userInfo.userId
                            };
                            this.$http.post(path, {params: params}).then(res => {
                                this.roomCreateHandle(res).then(
                                    res.body.code === 200
                                        ? this._$eventBus.$emit("roomJoined")
                                        : alert(`加入房间失败！`)
                                )
                            }, err => {
                            })
                        }*/
        },
        created(){
            this.userInfo = JSON.parse(sessionStorage.getItem("userInfo")) || {};
        },
        mounted() {
        }
    }
</script>
<style>
    div.user-tool-part, .user-tool-part .tool-part-form-box{
        background: #f2f2f2;
    }
</style>