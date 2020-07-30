<template>
  <div>
    <el-container class="container">
      <el-aside class="aside" width="200px">
          <div class="search">
            <el-row>
              <el-col>
                <div class="searchText">搜一搜</div>
                <el-divider></el-divider>
                <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable  @clear="getArticleList">
                  <el-button  slot="append" icon="el-icon-search"  @click="getArticleList"></el-button>
                </el-input>
              </el-col>
            </el-row>
          </div>
        </el-aside>
        <el-container class="main-container">
          <el-main class="main">
            <!-- <div class="articles" v-for="item in articleList" :key="item.id">
              <div class="title">
                <a href="#"><span>{{item.title}}</span></a>
              </div>
              <div class="content" v-html="item.content">
              </div>
              <div class="author">
                <span>作者：{{item.author.username}}</span>
              </div>
              <div class="publishDate">
                <span>{{item.publishDate | dateFormat}}</span>
              </div>
            </div> -->

            <el-row>
              <el-col :span="24" v-for="item in articleList" :key="item.id">
                <el-card :body-style="{ padding: '0px' }" shadow="hover">
                  <!-- <img :src="baseURL+item.pic" class="image"> -->
                  <div class="detail" style="padding: 14px;">
                    <div class="title"><router-link :to="'/home/articleDetail/'+ item._id">{{item.title}}</router-link></div>
                    <!-- <div class="title"><a :href="baseurlFind+item._id">{{item.title}}</a></div> -->
                    <el-divider></el-divider>
                    <div class="author">作者：{{item.author.username}}</div>
                    <div class="date">
                      <time class="time">{{item.publishDate | dateFormat}}</time>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                          :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                          layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

          </el-main>
          
        </el-container>
    </el-container>

  </div>
</template>

<script>
export default {
  created() {
    this.getArticleList();
    // this.getPic();
  },
    data() {
      return {
        
        // 图片地址前缀
        baseURL: 'http://localhost:8081/public',
        activeIndex2: '',
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
        // 点击文章查询详情的baseurlFind
        baseurlFind: 'http://localhost:8081/admin/findArticle/'
      }
    },
    methods: {
      handleSelect() {

      },
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

        // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getArticleList();
    },
    // 监听当前页码改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getArticleList();
    },
    },
  };
</script>

<style lang="less" scoped>
// .el-container{
//   height: 100%;
//   // background-image: url('../assets/rainbow.jpg');
//   min-height: 100%;
// }
.container {
  width: 1200px;
  margin: 0 auto!important;
  justify-content: center;
}
  .el-aside {
    width: 250px!important;
    // background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 0;
    padding-top: 30px;
  }
    .el-main {
    // background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  .articles {
  display: block;
  height: 300px;
}

.author {
  display: inline-block;
}
.publishDate {
  display: inline-block;
}

.searchText {
  text-align: left;
  margin-left: 8px;
}

// 卡片
.el-card {
  margin: 5px 0;
  height: 100px;
}
a {
  color: black;
}
.detail {
  // height: 100px!important;
  line-height: 0px;
}
.title{
  padding-top: 10px;
  text-align: left;
  // margin-left: -20px;
  // margin-left: 0;
  // display: block;
  // span {
  //   display: inline-block;
  // }
}
.author{
  float: left;
  // text-align: left!important;
  color: #8AADCB;
}
.date {
  text-align: right;
}

 .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    height: 200px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }

  .el-pagination {
  margin-top: 15px;
}
</style>