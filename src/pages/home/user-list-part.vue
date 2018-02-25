<template>
    <ul class="room-list">
        <li class="room-list-item" v-for="item in listData">
            <span class="room-list-item-content" v-text="item" :title="item"></span>
        </li>
    </ul>
</template>
<script>
    export default {
        data() {
            return {
                listData:[]
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
                            ?this.listData = res.body.data
                            :this.errHandle();
                    },err=>{})
            },
            errHandle(){},
        },
        mounted(){
            this.getRoomUserList();
            this._$eventBus.$on("userListRefresh",this.getRoomUserList);
        }
    }
</script>
<style>
    .room-list{
        padding: 10px 20px;
        color: #777;
    }
    .room-list-item{
        padding-top: 10px;
        cursor: pointer;
    }
    .room-list-item:hover .room-list-item-content{
        color: #000;
        font-weight: bold;
        text-shadow: 1px 0 1px rgba(0, 0, 0, 1);
        border-color: transparent;
    }
    .room-list-item-content{
        border-bottom: 1px solid #eee;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>