import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入vue组件
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Register from '../components/Register.vue'
import Manage from '../components/admin/Manage.vue'
import Users from '../components/admin/users/Users.vue'
import Articles from '../components/admin/articles/Articles.vue'
import AddArticles from '../components/admin/articles/AddArticles.vue'
import ArticlesHome from '../components/home/ArticlesHome.vue'
import ArticleDetail from '../components/home/ArticleDetail.vue'
import AboutUser from '../components/home/AboutUser.vue'
import AllArticles from '../components/home/AllArticles.vue'

Vue.use(VueRouter)

const routes = [
    // 实现访问根路径/,即重定向到登录页面
    { path: '/', redirect: '/home/login' },
    { path: '/home', redirect: '/home/articlesHome' },
    // 匹配规则：当用户访问/login路径时，渲染Login组件
    { path: '/home/login', component: Login },
    {
        path: '/home',
        component: Home,
        children: [
            { path: '/home/articlesHome', component: ArticlesHome },
            { path: '/home/articleDetail/:id', component: ArticleDetail },
            { path: '/home/allArticles', component: AllArticles },
            { path: '/home/aboutUser', component: AboutUser }
        ]
    },
    { path: '/home/register', component: Register },
    {
        path: '/admin/manage',
        component: Manage,
        children: [
            { path: '/admin/users', component: Users },
            { path: '/admin/articles', component: Articles },
            { path: '/admin/addArticles', component: AddArticles }
        ]
    },

]

const router = new VueRouter({
    routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to代表将要访问的
    // from代表从哪个地方来的
    // next():代表放行 next('/login'):代表强制跳转
    if (to.path === '/home/login' || to.path === '/home/register') {
        return next();
    }
    const token = window.sessionStorage.getItem('token');
    if (!token) {
        return next('/home/login');
    }
    next();
})

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default router