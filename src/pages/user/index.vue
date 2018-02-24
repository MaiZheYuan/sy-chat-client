<template>
    <div class="login">
        <div class="login-wrap">
            <div class="login-form check-part">
                <span class="sign-btn"
                      v-for="item in routeList" v-text="item.tit"
                      :class="{'sign-btn-active':item.isActive}"
                      @click="checkPage(item)">
                </span>
            </div>
            <router-view ref="signForm"></router-view>
            <div class="login-form">
                <div class="login-form-child" onselectstart="return false">
                    <span class="login-btn" @click = "userConfirm">确定</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                curItem:null,
                routeList:[
                    {tit:"登录",routeName:"signIn",isActive:true},
                    {tit:"注册",routeName:"signUp",isActive:false}
                ]
            }
        },
        methods:{
            checkPage(item){
                this.curItem
                    ? ( this.curItem.isActive = false )
                    : this.normalAllItem();
                this.curItem = item;
                item.isActive = true;
                this.$router.push({name:item.routeName});
            },
            normalAllItem(){
                this.routeList.forEach(item=>{item.isActive = false});
            },
            userConfirm(){
                this.$refs.signForm.$emit("userConfirm");
            }
        }
    }
</script>
<style>
    .login{
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }
    .login-wrap{
        padding: 20px;
        background: #fff;
    }
    .sign-btn{
        display: inline-block;
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        margin: 0 20px;
        background: #eee;
        color: #000;
        cursor: pointer;
        border: 1px solid #aaa;
        border-radius: 5px;
        transition: all 0.5s;
    }
    .sign-btn-active{
        background: #000;
        color: #fff;
    }
    .login-form{
    }
    .check-part{
        padding: 0;
        text-align: center;
    }
    .login-form-child{
        width: 100%;
        margin: 20px 0;
        text-align: center;
    }
    .login-form-label{

    }
    .login-form-input{

    }
    .login-tip{
        font-size: 12px;
        color: #666;
        height: 20px;
        line-height: 20px;
        vertical-align: middle;
    }
    .warn{
        color:#f00;
    }
    .login-btn{
        display: inline-block;
        width: 35px;
        height: 35px;
        line-height: 30px;
        vertical-align: middle;
        padding: 10px;
        border-radius: 50%;
        background: #eee;
        color: #000;
        cursor: pointer;
        transition: all 0.5s;
        border: 1px solid #aaa;
    }
    .login-btn:hover{
        color: #fff;
        background: #000;
    }
</style>