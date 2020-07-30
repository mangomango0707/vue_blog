<template>
  <div class="box">
    <el-container class="containerBox">
      <el-header class="header"></el-header>
      <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal"
              background-color="#8AADCB" text-color="#fff" active-text-color="#ffd04b">
              <el-menu-item index="0" @click="saveNavState(paths[0])">首页</el-menu-item>
              <el-menu-item index="1" @click="saveNavState(paths[1])">随笔</el-menu-item>
              <el-menu-item index="2" @click="saveNavState(paths[2])">个人信息</el-menu-item>
        </el-menu>
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
        }
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
  justify-content: center;
}
// .header {
//   // background-image: url('../assets/bc01.jpg');
//   height: 300px;
//   line-height: 300px;
//   color: #333;
//   text-align: center;
// }
  .el-header{
    background-image: url('../assets/bc03.jpg');
    // background-color: #B3C0D1;
    color: #333;
    text-align: center;
    height: 300px !important;
    line-height: 300px;
  }
   .el-footer{
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    bottom: 0;
    margin-top: 80px;
  }
  
  // .el-aside {
  //   width: 250px!important;
  //   // background-color: #D3DCE6;
  //   color: #333;
  //   text-align: center;
  //   line-height: 0;
  //   padding-top: 30px;
  // }

  // .el-col {
  //   height: 50px!important;
  // }
  // .el-divider {
  //   margin: 2px 0;
  // }
  .search {
    span {
      color: #8AADCB;
    }
  }
  
  // .el-main {
  //   // background-color: #E9EEF3;
  //   color: #333;
  //   text-align: center;
  //   line-height: 160px;
  // }
  .el-menu {
    // display: block;
    padding-left: 770px;
  }
  .el-menu-item {
    padding: 0 40px!important;
  }
// .articles {
//   display: block;
//   height: 300px;
// }
// .title {
//   height: 30px;
//   a {
//     height: 30px;
//   }
// }
// .content {
// }
// .author {
//   display: inline-block;
// }
// .publishDate {
//   display: inline-block;
// }

// // 卡片
// .el-card {
//   margin: 5px 0;
//   height: 100px;
// }
// a {
//   color: black;
// }
// .detail {
//   // height: 100px!important;
//   line-height: 0px;
// }
// .title{
//   padding-top: 10px;
//   text-align: left;
//   // margin-left: -20px;
//   // margin-left: 0;
//   // display: block;
//   // span {
//   //   display: inline-block;
//   // }
// }
// .author{
//   float: left;
//   // text-align: left!important;
//   color: #8AADCB;
// }
// .date {
//   text-align: right;
// }

//  .time {
//     font-size: 13px;
//     color: #999;
//   }
  
//   .bottom {
//     margin-top: 13px;
//     line-height: 12px;
//   }

//   .button {
//     padding: 0;
//     float: right;
//   }

//   .image {
//     width: 100%;
//     height: 200px;
//     display: block;
//   }

//   .clearfix:before,
//   .clearfix:after {
//       display: table;
//       content: "";
//   }
  
//   .clearfix:after {
//       clear: both
//   }
</style>