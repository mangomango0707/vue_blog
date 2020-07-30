import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import '../src/assets/fonts/iconfont.css'
// 导入富文本编辑器依赖
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


// 配置axios
// 导入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8081';
// 通过axios请求拦截器添加token，保证拥有获取数据和访问其他请求的权限
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config;
})

// 允许跨域携带session信息
// axios.defaults.withCredentials = true;

// 将这个包挂载到vue的原型对象上，每个vue组件可以通过this直接访问到http直接发送请求
Vue.prototype.$http = axios;

Vue.config.productionTip = false

// 自定义格式化时间的全局过滤器
// originVal：需要处理的原数据
Vue.filter('dateFormat', function(originVal) {

    const dt = new Date(originVal);
    // 如果月份不足两位数，在前面补个0
    // month是从0开始的，所以需要+1
    // 利用字符串补全长度的函数：padStart()用于头部补全，padEnd()用于尾部补全。
    // 第一个参数用来指定字符串的最小长度，第二个参数是用来补全的字符串。
    const y = dt.getFullYear();
    const m = (dt.getMonth() + 1 + '').padStart(2, '0');
    const d = (dt.getDate() + '').padStart(2, '0');
    // const hh = (dt.getHours() + '').padStart(2, '0');
    // const mm = (dt.getMinutes() + '').padStart(2, '0');
    // const ss = (dt.getSeconds() + '').padStart(2, '0');

    // return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    return `${y}-${m}-${d}`;
})

// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor);

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')