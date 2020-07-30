<template>
  <div class="box">
    <el-container class="containerBox">
      <el-header class="header">
        <div class="headNav">
          <router-link to="/home/articlesHome">
            <div class="logo">
              <img src="../assets/mango.png" alt="">
              <span>Mango博客</span>
            </div>
          </router-link>
          <div class="user-btn">
            <el-col :span="12">
              <div class="user">
                <div class="block">
                  <el-avatar size="large" :src="URL"></el-avatar>
                </div>
                <span>{{userInfo.username}}</span>
              </div>
            </el-col>
            <el-button @click="logout">退出</el-button>
          </div>
          
        </div>
          <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal"
              background-color="rgba(255,255,255,0)" text-color="#fff" active-text-color="#ffd04b">
              <el-menu-item index="0" @click="saveNavState(paths[0])">首页</el-menu-item>
              <el-menu-item index="1" @click="saveNavState(paths[1])">随笔</el-menu-item>
              <el-menu-item index="2" @click="saveNavState(paths[2])">个人信息</el-menu-item>
        </el-menu>
      </el-header>
      <!-- <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal"
              background-color="#8AADCB" text-color="#fff" active-text-color="#ffd04b">
              <el-menu-item index="0" @click="saveNavState(paths[0])">首页</el-menu-item>
              <el-menu-item index="1" @click="saveNavState(paths[1])">随笔</el-menu-item>
              <el-menu-item index="2" @click="saveNavState(paths[2])">个人信息</el-menu-item>
        </el-menu> -->
      <el-container class="container">
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-container>
      <el-footer class="footer">Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  created() {
    this.getArticleList();
    this.getUserInfo();
    this.activePath = window.sessionStorage.getItem("activePath");
    // this.getPic();
  },
    data() {
      return {

        // 图片地址前缀
        baseURL: 'http://127.0.0.1:8081/public',
        activeIndex2: '',
        // 设置激活的状态路径
        activePath: '',
        // 状态路径数组
        paths: ['/home/articlesHome', '/home/allArticles', '/home/aboutUser'],
        // 参数对象
        queryInfo: {
          // 关键字查询
          query: '',
          // 当前页数
          pagenum: 1,
          // 每页显示多少条数据
          pagesize: 5
        },
        // 文章列表数据
        articleList: [],
        // 文章总数
        total: 0,

        // 登录用户信息
        userInfo: {},
        // 图片地址
        URL: '',
      }
    },
    methods: {
      // handleSelect(key, keyPath) {
      //   console.log(key, keyPath);
      // },
      // 获取文章列表数据
        async getArticleList() {
          const res = await this.$http.get('admin/articles', {params: this.queryInfo});
          console.log(res);
          if(res.status !== 200){
            return this.$message.error('获取文章数据失败！');
          }
          this.articleList = res.data.articles;
          this.total = res.data.total;
        },
        // 读取图片
        // async getPic() {
        //   for(item in articleList){
        //     const res = await this.$http.get('public' + item.pic);
        //     console.log(res);
        //   }
          
        // }
        // 保存链接的激活状态，并实现跳转
        saveNavState(activePath) {
          console.log(activePath);
            window.sessionStorage.setItem("activePath", activePath);
            this.activePath = activePath;
            this.$router.push(this.activePath);
        },

        // 退出
        logout() {
            // 销毁token
            window.sessionStorage.clear();
            // 跳转到登录页面
            this.$router.push('/home/login');
        },

        async getUserInfo() {
            // 根据id查询用户信息
            const id = window.sessionStorage.getItem('userId');
            const res = await this.$http.get('admin/findUser/' + id);
            console.log(res);
            if(res.status !== 200){
              return this.$message.error('查询用户信息失败！');
            }
            this.userInfo = res.data.data;
            this.URL = 'http://localhost:8081/public'+this.userInfo.avatar;
            this.baseURL = 'http://localhost:8081/admin/editAvatar/'+this.userInfo._id;
        },
    },
  };
</script>

<style lang="less" scoped>
.box{
  height: 100%;
}
.el-container{
  height: 100%;
  // background-image: url('../assets/rainbow.jpg');
}
.container {
  width: 1000px;
  margin: 0 auto!important;
  padding-top: 20px;
  justify-content: center;
}
  .el-header{
    position: relative;
    width: 100%;
    padding: 0;
    background-image: url('../assets/bc001.jpg');
    // background-color: #B3C0D1;
    color: #333;
    text-align: center;
    height: 350px !important;
    line-height: 350px;
    .headNav {
      width: 100%;
      height: 50px;
      background-color: #8AADCB;
      display: flex;
      justify-content: space-between;
      padding-left: 0;
      color: #ffffff;
      align-items: center;
      font-size: 20px;
      .logo {
        height: 50px;
        display: flex;
        align-items: center;
        line-height: 50px;
        img {
            width: 100px;
            height: 60px;
        }
        span {
          height: 50px;
            margin-left: 8px;
            color: #fff!important;
        }
      }

      .el-button {
        background-color: #8AADCB;
        color: #fff;
        margin-right: 20px;
      }
    }
    
  }

  .user-btn {
    margin-right: 50px;
    height: 50px;
    line-height: 50px;
    width: 250px;
    align-items: center;
  }
  .block {
    float: left;
    height: 50px;
    display: flex;
    line-height: 50px;
    align-items: center;
  }
  .user {
    height: 50px;
    line-height: 50px;
    align-items: center;
  }
   .el-footer{
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    bottom: 0;
    margin-top: 250px;
  }

  .search {
    span {
      color: #8AADCB;
    }
  }
  
  .el-menu {
    position: absolute;
    bottom: 0;
    background-color: rgba(255,255,255,0);
    // display: block;
    padding-left: 690px;
    // font-size: 30px;
  }
  .el-menu-item {
    padding: 0 60px!important;
    font-size: 18px;
    // 字体样式
    // font:italic 1em Georgia, serif;
  }

</style>