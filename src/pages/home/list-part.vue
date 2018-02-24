<template>
    <ul>
        <li v-for="item in listData.reverse()">
            <span v-text="item"></span>
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
//            this.getUserRoomList();
//            this._$eventBus.$on("roomListRefresh",this.getUserRoomList);
        }
    }
</script>
<style></style>