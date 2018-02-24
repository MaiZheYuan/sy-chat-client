import Vue from 'vue';
import Router from 'vue-router';
import userIndex from '@pages/user/index.vue';
import userSignIn from '@pages/user/sign-in.vue';
import userSignUp from '@pages/user/sign-up.vue';
import home from '@pages/home/index.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect:'/user'
        },
        {
            path: '/user',
            name: 'user',
            component: userIndex,
            redirect: '/user/signIn',
            children:[
                {
                    path: 'signIn',
                    name: 'signIn',
                    component: userSignIn,
                },
                {
                    path: 'signUp',
                    name: 'signUp',
                    component: userSignUp,
                }
            ]
        },
        {
            path: '/home',
            name: 'home',
            component: home,
        }
    ]
})
