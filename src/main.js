import MockStart from "../test/mock/MockBUS";
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import eventBus from './plugins/eventBus'
// MockStart(true);
Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(eventBus);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
window.addEventListener("unload",function () {
    // window.SYRESOURCE.chatSocketDisconnect();
    // window.SYRESOURCE.chatSocketRoomLeave();
});
