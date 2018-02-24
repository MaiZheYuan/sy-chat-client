<template>
    <div class="tool-part" @mouseleave="curItemDerective">
        <ul class="tool-part-list">
            <li class="tool-part-list-item" v-for="item in toolList"
                :class="{active:item.isActive}">
                <span v-text="item.tit" @click="toolSelect(item)"></span>
            </li>
        </ul>
        <form class="tool-part-form" :key="'search'">
            <div>
                <transition name="shrink">
                    <input type="text" class="tool-part-input" placeholder="房间名"
                           v-show="curToolListItem" v-model.trim="roomName">
                </transition>
            </div>
            <div>
                <transition name="shrink">
                    <input type="text" class="tool-part-input"
                           placeholder="房间口令" v-show="isShowCalc('create')"
                           v-model.trim="roomPassword">
                </transition>
            </div>
            <div class="tool-part-form-confirm">
                <a class="tool-part-confirm-btn" v-show="curToolListItem"
                   @click="toolFormConfirm">确定</a>
            </div>
        </form>
        <ul class="tool-part-result">
            <li class="tool-part-result-item" v-for="item in searchResultList" v-text="item.roomName"></li>
        </ul>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                roomName: "",
                roomPassword: "",
                toolList: [
                    {tit: "搜索", isActive: false, action: "search"},
                    {tit: "创建", isActive: false, action: "create"},
                ],
                curToolListItem: null,
                searchResultList: [],
            }
        },
        methods: {
            toolSelect(item) {
                this.curItemDerective();
                this.curToolListItem = item;
                item.isActive = true;
                this.searchResultList = [];
            },
            curItemDerective() {
                this.curToolListItem && (this.curToolListItem.isActive = false);
                this.curToolListItem = null;
                this.roomName = null;
                this.roomPassword = null;
            },
            isShowCalc(type) {
                return this.curToolListItem && this.curToolListItem.action === type;
            },
            toolFormConfirm() {
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
                if(!this.roomPassword || !this.roomName){ return false; };
                let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
                if(!userInfo) { this.$router.push({name:"user"}) };
                let path=window.SYRESOURCE.rooms;
                let params = {
                    roomPassword:this.roomPassword,
                    roomName:this.roomName,
                    userId:userInfo.userId
                };
                this.$http.post(path,{params:params}).then(res=>{
                    this.roomCreateHandle(res).then(
                        this.roomCreateSucceed,
                        this.roomCreateFailed
                    )
                },err=>{})
            },
            roomCreateHandle(res){
                return new Promise((rs,rj)=>{
                    let code;
                    debugger;
                    200 === (code = res.body.code)
                        ?rs()
                        :rj(code)
                })
            },
            roomCreateSucceed(){
                this._$eventBus.$emit("roomListRefresh");
//                alert("新建成功！")
            },
            roomCreateFailed(code){
                alert("新建失败！")
            },
            roomSearch() {
                if(!this.roomName){ return false; };
                let path=window.SYRESOURCE.rooms;
                let params = {roomName:this.roomName};
                this.$http.get(path,{params:params}).then(res=>{
                    this.roomSearchHandle(res).then(
                        this.roomSearchSucceed,
                        this.roomSearchFailed
                    )
                },err=>{})
            },
            roomSearchHandle(res){
                return new Promise((rs,rj)=>{
                    let code;
                    200 === (code = res.body.code)
                        ?rs(res)
                        :rj(code)
                })
            },
            roomSearchSucceed(res){
                this.searchResultList = res.body.data;
            },
            roomSearchFailed(code){
                alert("搜索失败！")
            },
        }
    }
</script>
<style>
    .tool-part {
        padding-top: 3px;
        margin: 10px 20px;
        color: #000;
        border-top: 3px solid #000;
        border-radius: 3px 3px 0 0;
        background: #eee;
    }

    .tool-part .active {
        font-weight: bold;
        text-shadow: 1px 0 1px rgba(0, 0, 0, 1);
    }

    .tool-part-list {
        display: flex;
        justify-content: center;
    }

    .tool-part-list-item {
        box-sizing: border-box;
        text-align: center;
        width: 50%;
    }
    .tool-part-list-item>span{
        cursor: pointer;
    }
    .tool-part-form {
        margin: 0 20px;
        overflow: hidden;
        margin-bottom: 8px;
    }

    .tool-part-input {
        width: 100%;
        border: none;
        border-bottom: 1px solid #000;
    }

    .shrink-enter-active, .shrink-leave-active {
        transition: width .5s;
    }

    .shrink-enter, .shrink-leave-to {
        width: 0;
    }
    .tool-part-form-confirm{
        text-align: center;
    }
    .tool-part-confirm-btn {
        cursor: pointer;
        text-align: center;
    }
    .tool-part-confirm-btn:hover {
        font-weight: bold;
        text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
    }
    .tool-part-result:before{
        content:"";
        display: inline-block;
        border: 6px solid #000;
        border-top-color: transparent;
        border-left-color: transparent;
        border-right-color: transparent;
        margin-top: -13px;
        vertical-align: top;
    }
    .tool-part-result{
        color: #fff;
        padding: 0 16px;
        text-align: center;
        background: #000;
        border: 1px solid #000;
        position: relative;
        font-size: 0;
        vertical-align: top;
        border-radius: 0 0 5px 5px;
        min-height: 2px;
    }
    .tool-part-result-item{
        font-size: 16px;
        cursor: pointer;
        text-decoration: underline;
        padding-top: 10px;
    }
</style>