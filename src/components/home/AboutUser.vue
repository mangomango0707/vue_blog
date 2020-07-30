<template>
  <div class="container">
    <!-- 个人信息详情 -->
    <el-row>
      <el-col :span="24">
        <el-tabs tab-position="left" v-model="activeName" style="height: 200px;" :stretch="true"  @tab-click="getArticlesByUserId(userInfo._id)">
          <el-tab-pane label="个人信息" name="0">
            <el-card :body-style="{ padding: '0px' }">
              <div class="detail" style="padding: 14px;">
                <h1>个人信息</h1>
                <el-divider></el-divider>
                <el-form ref="editFormRef" :model="userInfo" :rules="editFormRules" label-width="80px">
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="userInfo.username"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userInfo.email" type="email"></el-input>
                  </el-form-item>
                </el-form>
                <el-divider></el-divider>
                <el-button class="editBtn" type="primary" @click="editUser">保存</el-button>
              </div>
                            
                            <!-- <div class="detail" style="padding: 14px;">
                                
                                  <div>
                                    <div class="username">用户名：{{userInfo.username}}</div>
                                    <div class="email">邮箱：{{userInfo.email}}</div>
                                    <div class="role">用户角色：{{userInfo.role}}</div>
                                  </div>
                                  <div class="pic"><span>用户头像：</span><img :src="URL"></div>
                            </div> -->
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="我的头像" name="1">
            <el-card :body-style="{ padding: '0px' }">
              <div class="pic" style="padding: 14px;">
                <h1>头像</h1>
                <el-divider></el-divider>
                <img :src="URL">
                <!-- <el-divider></el-divider> -->
                <el-button class="editBtn" type="primary" @click="showEditAvatarDialog">修改头像</el-button>
              </div>
            </el-card>

            <!-- 修改头像对话框 -->
            <el-dialog title="修改头像" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
              <!-- 内容主体区域 -->
              <!-- <el-upload class="avatar-uploader" :http-request="editAvatar" :action="baseURL" :show-file-list="false" ref="upload" :auto-upload="true">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload> -->
              <el-upload action="http://127.0.0.1:8081/home/editAvatar" :http-request="editAvatar" ref="upload" multiple :auto-upload="false">
                      <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
              <!-- 底部区域 -->
              <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editAvatar">确 定</el-button>
              </div>
            </el-dialog>

          </el-tab-pane>
          <el-tab-pane label="我的文章" name="2">
            
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
          </el-tab-pane>

          <el-tab-pane label="发布文章" name="3">
              <!-- 卡片视图区域 -->
              <el-card>
                  
                  <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px" label-position="top" enctype="multipart/form-data">
                      <el-form-item label="标题" prop="title">
                          <el-input v-model="addForm.title"></el-input>
                      </el-form-item>
                      <el-form-item label="作者" prop="author">
                          <el-input v-model="userInfo.username" disabled></el-input>
                      </el-form-item>
                      <el-form-item label="发布时间">
                          <el-input type="date" v-model="addForm.publishDate"></el-input>
                      </el-form-item>
                      <el-form-item label="封面">
                          <el-upload action="http://127.0.0.1:8081/admin/addArticle" :http-request="addArticle" ref="upload" multiple :auto-upload="false">
                              <el-button size="small" type="primary">点击上传</el-button>
                          </el-upload>
                      </el-form-item>
                      <el-form-item label="文章内容">
                          <quill-editor v-model="addForm.content"></quill-editor>
                      </el-form-item>
                      <el-button type="primary" @click="addArticle">添加文章</el-button>
                  </el-form>
                  
              </el-card>
          </el-tab-pane>
          
        </el-tabs>
      </el-col>
    </el-row>      
  </div>
</template>

<script>
export default {
    created() {
        this.getUserInfo();
    },
    data() {
        return {
          // 登录用户信息
            userInfo: {},
            // 图片地址前缀
            URL: '',
            // 修改用户表单
            editForm: this.userInfo,
            editFormRules: {
              username: [
                {required: true, message:'请输入用户名', trigger: 'blur'},
                { min: 2, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
              ],
              email: [
                {required: true, message:'请输入邮箱地址', trigger: 'blur'},
                { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
              ]
            },
            // tab栏的选中项,默认为0
            activeName: '0',
            editDialogVisible: false,
            baseURL: '',
            imageUrl: '',

            // 用户的文章
            articleList: [],
            // 参数对象
            queryInfo: {
              // 关键字查询
              query: '',
              // 当前页数
              pagenum: 1,
              // 每页显示多少条数据
              pagesize: 5
            },
            // 文章总数
            total: 0,

            // 发布文章
            // 添加文章表单
            addForm: {
                title: '',
                author: '',
                publishDate: '',
                pic: '',
                content: ''
            },
            addFormRules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ]
            },
        }
    },
    methods: {
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
        // 修改用户
        async editUser() {
          // console.log(this.editForm);
          console.log(this.userInfo);
          // 先进行预校验
          this.$refs.editFormRef.validate(async valid => {
              // 校验不通过
              if(!valid){
                  return;
              }
              const res = await this.$http.put('admin/editUser/' + this.userInfo._id, this.userInfo);
              console.log(res);
              if(res.status !== 200) {
                return this.$message.error('修改数据失败！');
              }
              
              this.$message.success('修改数据成功！');
              this.$router.push('/home/aboutUser');
          });
        },
        editDialogClosed() {

        },
        // 展示修改头像对话框
        async showEditAvatarDialog() {
          this.editDialogVisible = true;
          
        },
        // 修改头像
        async editAvatar() {

          var formData = new FormData();
          var file = this.$refs.upload.uploadFiles[0];
          var headerConfig = {
              headers: {
                  "Content-Type": "multipart/form-data"
              }
          };
          formData.append('file', file.raw);
          console.log(formData.get('file'));

          const res = await this.$http.post('home/editAvatar/' + this.userInfo._id, formData, headerConfig);
          console.log(res);
          if(res.status !== 200){
              return this.$message.error('更新头像失败！');
            }
          this.getUserInfo();
          this.editDialogVisible = false;
        },
        // 切换tab栏， 即根据用户id查询文章，并重置发布文章表单
        async getArticlesByUserId(id) {
          if(this.activeName == '2'){
            console.log("用户："+id);
            const res = await this.$http.get('admin/findArticleByUserId/' + id, {params: this.queryInfo});
              console.log(res);
              if(res.status !== 200){
                  return this.$message.error('查询用户文章信息失败！');
              }
              this.articleList = res.data.articles;
              this.total = res.data.total;
              this.addForm = {};
          }
        },
            // 监听pagesize改变的事件
        handleSizeChange(newSize) {
          this.queryInfo.pagesize = newSize;
          this.getArticlesByUserId(this.userInfo._id);
        },
        // 监听当前页码改变的事件
        handleCurrentChange(newPage) {
          this.queryInfo.pagenum = newPage;
          this.getArticlesByUserId(this.userInfo._id);
        },

        // 发布文章
        async addArticle() {
            var formData = new FormData();
            // console.log(this.$refs.upload);
            var file = this.$refs.upload.uploadFiles[0];
            var headerConfig = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };
            
            formData.append('file', file.raw);
            formData.append('title', this.addForm.title);
            formData.append('author', this.userInfo._id);
            formData.append('publishDate', this.addForm.publishDate);
            formData.append('content', this.addForm.content);

            console.log(formData.get('file'));
            console.log(formData.get('author'));

            // console.log(formData.get('publishDate'));
             // 发起添加请求
             this.$refs.addFormRef.validate(async valid => {
                 if(!valid){
                     return this.$message.error('请填写必要的表单项！');
                 }
                const res = await this.$http.post('admin/addArticle', formData, headerConfig);
                console.log(res);
                if(res.status !== 200){
                    return this.$message.error('添加文章失败！');
                }
                this.$message.success('添加文章成功！');
                // this.$router.push('/admin/articles');
                this.activeName = '2';
                this.getArticlesByUserId(this.userInfo._id);
             });
        }
    },
}
</script>

<style lang="less" scoped>
.container {
  width: 1200px!important;
  height: 100%;
  margin-top: 20px;
  margin: 10px auto!important;
  // margin-bottom: 20px;
  justify-content: center;
}
.el-tabs {
  height: 100%!important;
}
  .username, .email, .role {
    margin: 20px 0;
  }
  h3 {
    color: #5DA1C6;
  }
   .pic{
    vertical-align: middle!important;
    text-align: center;
  }
  img {
    margin-top: 15px;
    margin-bottom: 20px;
    // margin-left: 15px;
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    // box-shadow: 0 0 10px #ddd;
    vertical-align: middle;
  }
 
  .editBtn {
    display: block;
    margin: 0 auto;

  }
  el-card, el-tabs {
    height: 100%;
  }
 .el-tabs__item {
    margin: 20px 0!important;
  }

  .avatar-uploader .el-upload {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
// 卡片
.el-card {
  margin: 5px 0;
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

    .el-pagination {
  margin-top: 15px;
}
</style>