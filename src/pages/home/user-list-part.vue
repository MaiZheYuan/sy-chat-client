<template>
    <ul class="user-list">
        <li class="user-list-item" v-for="item in listData">
            <span class="user-list-item-content" v-text="item.nickname" :title="item.nickname"></span>
            <span v-text="item.role" class="user-list-item-role"></span>
        </li>
    </ul>
</template>
<script>
    export default {
        data() {
            return {
                listData:[],
                roleType:{
                    0:"房主"
                },
            }
        },
        methods:{
            getRoomUserList(roomName){
                let params = {roomName:roomName};
//                if( !params ) {return this.$router.push({name:"user"});};
                let path = window.SYRESOURCE.roomMembers;
                this.$http
                    .get(path,{params:params})
                    .then(res=>{
                        res.body.code===200
                            ?this.succeedHandle(res)
                            :this.errHandle();
                    },err=>{})
            },
            succeedHandle(res){
                res.body.data[0] && ( res.body.data[0].role= this.roleType[0]);
                this.listData = res.body.data;
            },
            errHandle(){},
        },
        mounted(){
            this.getRoomUserList();
            this._$eventBus.$on("roomChecked",this.getRoomUserList);
        }
    }
</script>
<style>
    .user-list{
        padding: 10px 20px;
        color: #777;
    }
    .user-list-item{
        padding-top: 10px;
        cursor: pointer;
    }
    .user-list-item:hover .user-list-item-content{
        color: #000;
        font-weight: bold;
        text-shadow: 1px 0 1px rgba(0, 0, 0, 1);
        border-color: transparent;
    }
    .user-list-item-role{
        padding: 0 2px;
        font-size: 0.4em;
        vertical-align: top;
        background: linear-gradient(to right bottom,#f00,#F60,#699,#06C,#909,#FF0);
        -webkit-background-clip: text;
        color: transparent;
    }
    .user-list-item-content{
        border-bottom: 1px solid #eee;
        max-width: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>