<template>
  <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
          <div>
              <img src="../../assets/mango.png" alt="">
              <span>Mango博客后台管理系统</span>
          </div>
          <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 页面主体区域 -->
      <el-container>
          <!-- 侧边栏 -->
          <el-aside :width="isCollapse ? '64px' : '240px'">
              <div class="toggle-button" @click="toggleCollapse">|||</div>
              <el-menu :default-active="activePath" background-color="#333744" text-color="#fff" active-text-color="#ffd04b" 
                        unique-opened router :collapse="isCollapse" :collapse-transition="false">

                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                        <i :class="iconsObj[item.id]"></i>
                        <span>{{item.authName}}</span>
                        </template>

                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                            <!-- 二级菜单模板区域 -->
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
          </el-aside>
          <!-- 右侧内容主体 -->
          <el-main>
              <!-- 路由占位符 -->
              <router-view></router-view>
          </el-main>
      </el-container>

  </el-container>
</template>

<script>
export default {
    created() {
        this.activePath = window.sessionStorage.getItem("activePath");
    },
    data() {
        return {
            // 激活的状态路径
            activePath: '1',
            isCollapse: false,
            menuList: [
                {
                    id: 1,
                    authName: "用户管理",
                    path: "admin/users",
                    children: [
                        {
                            id: 11,
                            authName: "用户列表",
                            path: "admin/users",
                        }
                    ]
                },
                {
                    id: 2,
                    authName: "文章管理",
                    path: "admin/articles",
                    children: [
                        {
                            id: 21,
                            authName: "文章列表",
                            path: "admin/articles",
                        }
                    ]
                }
            ],
            iconsObj: {
                '1': 'iconfont icon-yonghu',
                '2': 'iconfont icon-article-line'
            }
        }
    },
    methods: {
        // 退出
        logout() {
            // 销毁token
            window.sessionStorage.clear();
            // 跳转到登录页面
            this.$router.push('/home/login');
        },
        // 切换是否折叠左侧菜单
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
        // 保存链接的激活状态
        saveNavState(activePath) {
            window.sessionStorage.setItem("activePath", activePath);
            this.activePath = activePath;
        }
    }
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    color: #ffffff;
    font-size: 20px;
    
    > div {
        display: flex;
        align-items: center;
        img {
            width: 100px;
            height: 60px;
        }
        span {
            margin-left: 8px;
        }
    }
}
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button {
    background-color: #4a5064;
    color: #ffffff;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>