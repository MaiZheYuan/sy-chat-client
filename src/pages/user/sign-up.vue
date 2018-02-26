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
                        label: "账号：", tip: "8-16位英文与字母组合",
                        rule: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}/, isWarning: false,
                        value: "", id: "signUpNumber"
                    },
                    {
                        label: "密码：", tip: "8-16位英文与字母组合",
                        rule: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}/, isWarning: false,
                        value: "", id: "signUpPassword"
                    },
                    {
                        label: "昵称：", tip: "1-10个字符",
//                        rule: /^[\u4E00-\u9FA5]{2,4}$/, isWarning: false,
                        rule: /.{1,10}/, isWarning: false,
                        value: "", id: "signUpNickName"
                    }
                ],
                params:null,
            }
        },
        methods: {
            formNoValidate() {
                let isRule = true;
                let mapping = {signUpNumber: "userId", signUpPassword: "password", signUpNickName:"nickname"};
                let params = {
                    userId: "",
                    password: "",
                    nickname: "",
                };
                this.formModel.forEach(item => {
                    ( item.value.length === 0 || !item.rule.test(item.value) )
                        && ( (item.value = "") || ( item.isWarning = true) )
                        && (isRule = false );
                    params[mapping[item.id]] = item.value;
                });
                isRule && this.signUp(params);
            },
            signUp(params) {
                let path = window.SYRESOURCE.user;
                this.params = params;
                this.$http.post(path, {params: params}).then(res => {
                    this.signUpHandle(res).then(this.signUpSucceed,this.signUpFailed)
                }, err => {
                })
            },
            signUpHandle(res){
                return new Promise((rs,rj)=>{
                    let code;
                    200 === (code = res.body.code)
                        ?rs(res)
                        :rj(code)
                })
            },
            signUpSucceed(){
                sessionStorage.setItem("userInfo",JSON.stringify(this.params));
                this.params = null;
                this.$router.push({name:"home"})
            },
            signUpFailed(code){}
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

    .sign-in-warning::-webkit-input-placeholder {
        color: red;
    }

    .sign-in-warning::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: red;
    }

    .sign-in-warning:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: red;
    }

    .sign-in-warning:-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: red;
    }
</style>