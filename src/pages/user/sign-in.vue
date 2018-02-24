<template>
    <form class="login-form" id="sign-in-form">
        <div class="login-form-child" v-for="item in formModel">
            <label for="item.id" class="login-form-label"
                   v-text="item.label"></label>
            <input type="text" id="item.id" class="login-form-input"
                   :placeholder="item.tip" :class="{'sign-in-warning':item.isWarning}"
                   v-model="item.value">
        </div>
    </form>
</template>
<script>
    export default {
        data() {
            return {
                formModel: [
                    {
                        label: "账号：", tip: "",
                        rule: "", isWarning: false,
                        value: "", id: "signInNumber"
                    },
                    {
                        label: "密码：", tip: "",
                        rule: "", isWarning: false,
                        value: "", id: "signInPassword"
                    },
                ],
                userInfo:null,
            }
        },
        methods: {
            formNoValidate() {
                let isRule = true;
                let mapping = {signInNumber: "userId", signInPassword: "password"};
                let params = {
                    userId: "",
                    password: "",
                };
                this.formModel.forEach(item => {
                    item.value.length === 0
                        && ( item.isWarning = true)
                        && (isRule = false );
                    params[mapping[item.id]] = item.value;
                });
                isRule && this.signIn(params);
            },
            signIn(params) {
                let path = window.SYRESOURCE.user;
//                params.password = btoa(params.password);
                this.userInfo = params;
                this.$http.get(path, {params: params}).then(res => {
                    this.signInHandle(res).then(this.signInSucceed,this.signInFailed)
/*                    let userInfo = {...res.body.data,id:params.signInNumber};
                    let userInfoStr = JSON.stringify(userInfo);
                    sessionStorage.setItem("userInfo",userInfoStr);
                    let chatSocket = io.connect();*/
                }, err => {
                })
            },
            signInHandle(res){
                return new Promise((rs,rj)=>{
                    let code;
                    200 === (code = res.body.code)
                        ?rs(res)
                        :rj(code)
                })
            },
            signInSucceed(res){
                sessionStorage.setItem("userInfo",JSON.stringify(this.userInfo));
                this.$router.push({name:"home"})
            },
            signInFailed(code){}
        },
        mounted() {
            this.$on("userConfirm", this.formNoValidate)
        }
    }
</script>
<style>
    .sign-in-warning::placeholder {
        color: #f00;
    }
</style>