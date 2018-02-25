<template>
    <div class="tool-part" @mouseleave="curItemDerective">
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
        components:{
            inputPart
        },
        data() {
            return {
                roomName: "",
                roomPassword: "",
                toolList: [
                    {tit: "加入", isActive: false, action: "search"},
                    {tit: "创建", isActive: false, action: "create"},
                ],
                curToolListItem: null,
                searchResultList: [],
                curResultItem:null,
                isShowResultForm:false,
                userInfo:null,
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
//                this.searchResultList = [];
                this.isShowResultForm = false;
                this.curResultItem && ( this.curResultItem.isActive=false );
                this.curResultItem = null;
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
//                if(!this.userInfo) { this.$router.push({name:"user"}) };
                let path=window.SYRESOURCE.rooms;
                let params = {
                    roomPassword:this.roomPassword,
                    roomName:this.roomName,
                    userId:this.userInfo.userId
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
            joinRoomClickHandle(item){
                this.curResultItem && ( this.curResultItem.isActive = false );
                this.curResultItem = item;
                item.isActive = true;
                this.isShowResultForm = true;
            },
            roomJoinComfirm(){
                if(!this.roomPassword){ return false; };
//                if(!this.userInfo) { this.$router.push({name:"user"}) };
                let path=window.SYRESOURCE.roomMembers;
                let params = {
                    roomPassword:this.roomPassword,
                    roomName:this.curResultItem.roomName,
                    userId:this.userInfo.userId
                };
                this.$http.post(path,{params:params}).then(res=>{
                    this.roomCreateHandle(res).then(
                        res.body.code === 200
                            ? this._$eventBus.$emit("roomListRefresh")
                            : alert(`加入房间失败！`)
                    )
                },err=>{})
            }
        },
        mounted(){
            this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        }
    }
</script>
<style>
    .tool-part {
        padding-top: 3px;
        margin: 10px 20px;
        color: #000;
        border-top: 3px solid rgba(0,0,0,0.7);
        border-radius: 3px 3px 0 0;
        background: rgba(238,238,238,0.5);
        position: relative;
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
        background: transparent;
        font-weight: bold;
    }

    .shrink-enter-active, .shrink-leave-active {
        transition: width .5s;
    }

    .shrink-enter, .shrink-leave-to {
        width: 0;
    }
    .tool-part-form-box{
        position: absolute;
        width: 100%;
        background: rgba(238,238,238,0.5);
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
        border: 6px solid rgba(0,0,0,0.7);
        border-top-color: transparent;
        border-left-color: transparent;
        border-right-color: transparent;
        margin-top: -12px;
        vertical-align: top;
    }
    .tool-part-result{
        color: #fff;
        padding: 0 16px;
        text-align: center;
        background: rgba(0,0,0,0.7);;
        /*border: 1px solid rgba(0,0,0,0.7);*/
        font-size: 0;
        vertical-align: top;
        border-radius: 0 0 5px 5px;
        min-height: 4px;
    }
    .tool-part-result-item{
        font-size: 16px;
        cursor: pointer;
        /*text-decoration: underline;*/
        padding-bottom: 10px;
        position: relative;
    }
    .tool-part-result-item:hover,.result-active{
        font-weight: bold;
        text-shadow: 1px 1px 1px rgba(255, 255, 255, 1);
    }
    .tool-part-result-form>*{
        background: transparent;
        border:none;
        margin: 15px 0;
    }
    .tool-part-result-input{
        border-bottom: 1px solid #fff;
        color: #fff;
    }
    .tool-part-result-input::placeholder{
        color: #aaa;
    }
    .tool-part-result-btn{
        display: inline-block;
        padding: 0 10px;
        border: 1px solid #fff;
        font-size: 16px;
        cursor: pointer;
        border-radius: 4px 4px 4px 0;
    }
    .tool-part-result-btn:hover{
        background: #fff;
        color: #000;
    }
</style>