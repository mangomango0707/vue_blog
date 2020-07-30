<template>
  <div class="container">
      <!-- 文章详情卡片 -->
    <el-row>
        <el-col :span="24">
            <el-card :body-style="{ padding: '0px' }">
                
                <div class="detail" style="padding: 14px;">
                    <div class="title"><h1>{{article.title}}</h1></div>
                    <el-divider></el-divider>
                    <div class="author">作者：{{article.author.username}}</div>
                    <div class="date">
                        <time class="time">{{article.publishDate | dateFormat}}</time>
                    </div>
                    <div class="pic"><img :src="baseURL+article.pic" class="image"></div>
                    <div class="content">
                        <p v-html="article.content"></p>
                    </div>
                </div>
            </el-card>
        </el-col>
    </el-row>      
  </div>
</template>

<script>
export default {
    created() {
        this.getArticle();
    },
    data() {
        return {
            // 传进来的id参数
            id: this.$route.params.id,
            // 获取的文章
            article: {
                author: {}
            },
            // 图片地址前缀
            baseURL: 'http://localhost:8081/public',
        }
    },
    methods: {
        async getArticle() {
            console.log(this.id);
            const res = await this.$http.get('admin/findArticle/' + this.id);
            // console.log(res);
            if(res.status !== 200){
                return this.$message.error('查询文章信息失败！');
            }
            this.article = res.data.data;
            console.log(this.article);
        },
      
    },
}
</script>

<style lang="less" scoped>

.container {
    margin-top: 20px;
  width: 1000px;
  margin: 10px auto!important;
  justify-content: center;
}
.author{
  float: left;
  // text-align: left!important;
  color: #8AADCB;
}
.date {
  text-align: right;
  font-size: 13px;
    color: #999;
}
.detail {
    position: relative;
}
img {
    margin: 15px auto;
    // display: flex;
    // position: absolute;
    // top: 0;
    // bottom: 0;
    // left: 0;
    // right: 0;
    // margin: auto;
    // margin-left: auto;
    // left: 50%;
    // top: 50%;
    // transform: translate(-50%, -50%);
}
.content {
    
}
</style>