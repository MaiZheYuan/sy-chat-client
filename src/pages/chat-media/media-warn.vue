<template>
    <div>
        <span v-for="item in btnList" v-text="item.tit" @click="confirm(item)"></span>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                btnList:[
                    {tit:"确定",id:"yes"},
                    {tit:"取消",id:"no"},
                ]
            }
        },
        methods:{
            confirm(item){

            }
        }
    }
</script>