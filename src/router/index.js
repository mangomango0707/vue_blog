import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入vue组件
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Register from '../components/Register.vue'

Vue.use(VueRouter)

const routes = [
    // 实现访问根路径/,即重定向到登录页面
    { path: '/', redirect: '/home/login' }, ,
    { path: '/home', component: Home },
    // 匹配规则：当用户访问/login路径时，渲染Login组件
    { path: '/home/login', component: Login },
    { path: '/home', component: Home },
    { path: '/home/register', component: Register },
]

const router = new VueRouter({
    routes
})

export default router