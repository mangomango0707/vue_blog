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

                    <el-divider></el-divider>

                    <!-- 发布评论区 -->
                    <div class="addComment">
                        <el-col :span="2">
                            <div class="block">
                                <el-avatar size="large" :src="URL"></el-avatar>
                            </div>
                        </el-col>
                        <!-- 文本域 -->
                        <el-col :span="17">
                            <el-form ref="addFormRef" :model="addForm" >
                                <el-input type="textarea" placeholder="请输入内容" v-model="addForm.content">
                                </el-input>
                            </el-form>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="primary" @click="addComment">评论</el-button>
                        </el-col>
                    </div>
                    
                    <div class="total">
                        <p>{{total}}条评论</p>
                        <el-divider></el-divider>
                    </div>
                    

                    <!-- 评论区 -->
                    <div class="comment" v-if="commentList != ''">
                        <el-row>
                            <el-col class="commentItem" v-for="item in commentList" :key="item.id">
                                <el-col :span="2">
                                    <div class="block">
                                        <el-avatar size="large" :src="baseURL+item.uid.avatar"></el-avatar>
                                    </div>
                                </el-col>
                                <!-- 文本域 -->
                                <el-col :span="22">
                                    <div class="username">{{item.uid.username}}</div>
                                    <div class="content">{{item.content}}</div>
                                    <div class="time">{{item.time | dateFormat}}</div>
                                </el-col>
                            </el-col>
                        </el-row>
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
        this.getUserInfo();
        this.getComment();
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
            // 登录用户信息
            userInfo: {},
            // 图片地址
            URL: '',
            // 评论信息
            addForm: {
                aid: '',
                uid: '',
                content: ''
            },
            // 参数对象
            queryInfo: {
                // 关键字查询
                query: '',
                // 当前页数
                pagenum: 1,
                // 每页显示多少条数据
                pagesize: 10
            },
            // 评论列表
            commentList: [],
            // 评论总数
            total: 0
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
        },

        // 添加评论
        async addComment() {
            this.addForm.aid = this.id;
            // console.log(this.addForm.aid);
            this.addForm.uid = this.userInfo._id;

            const res = await this.$http.post('home/comment', this.addForm);
            if(res.status !== 200){
                return this.$message.error('添加评论失败！');
            }
            this.$message.success('添加评论成功！');
            this.getComment();
        },

        // 获取评论列表数据
        async getComment() {
            // 重置内容框
            this.addForm.content = '';
            const res = await this.$http.get('home/getComment/' + this.id, {params: this.queryInfo});
            console.log(res);
            if(res.status !== 200){
                return this.$message.error('获取文章数据失败！');
            }
            this.commentList = res.data.comments;
            console.log(this.commentList);
            this.total = res.data.total;
        }
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
.addComment {
    display: flex;
    align-content: center;
    justify-content: center;

    .el-button {
        
        margin-left: 10px;
    }
}
.comment {
    margin-left: 20px;
    .commentItem {
        margin-top: 8px;
        border-bottom: 1px solid #eee;
    }
    .username {
        font-size: 15px;
        color: #8AADCB;
    }
    .content {
        margin: 10px 0;
    }
    .time {
        font-size: 13px;
        color: #999;
        margin-bottom: 8px;
    }
}
.image {
    display: flex;
    justify-content: center;
    max-width: 700px;
    max-height: 700px;
}
</style>