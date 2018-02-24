<template>
    <ul class="room-list">
        <li class="room-list-item" v-for="item in roomList">
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
        computed:{
            roomList(){
                return this.listData.reverse();
            }
        },
        methods:{
            getUserRoomList(){
                let params = JSON.parse(sessionStorage.getItem("userInfo"));
                if( !params ) {return this.$router.push({name:"user"});};
                let path = window.SYRESOURCE.userRooms;
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
            this.getUserRoomList();
            this._$eventBus.$on("roomListRefresh",this.getUserRoomList);
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