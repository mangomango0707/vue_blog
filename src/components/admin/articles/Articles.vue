<template>
  <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>文章管理</el-breadcrumb-item>
          <el-breadcrumb-item>文章列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区域 -->
      <el-card>
          
          <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getArticleList">
              <el-button  slot="append" icon="el-icon-search" @click="getArticleList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="goAddArticle">发布文章</el-button>
          </el-col>
        </el-row>

        <!-- 文章列表区域 -->
        <el-table :data="articleList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="author.username" label="作者"></el-table-column>
          <el-table-column prop="publishDate" label="发布时间">
            <template slot-scope="scope">
              {{scope.row.publishDate | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <!-- 通过作用域插槽渲染操作列 -->
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteArticle(scope.row._id)"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                      :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                      layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 修改文章对话框 -->
        <el-dialog title="修改文章" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <!-- 内容主体区域 -->
            <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
                <el-form-item label="标题" prop="title">
                  <el-input v-model="editForm.title"></el-input>
              </el-form-item>
              <el-form-item label="作者" prop="author">
                  <el-input v-model="editForm.author.username"></el-input>
              </el-form-item>
              <el-form-item label="封面">
                  <el-upload action="http://127.0.0.1:8081/admin/editArticle" :http-request="editArticle" ref="upload" multiple :auto-upload="false">
                      <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
              </el-form-item>
              <el-form-item label="文章内容">
                  <quill-editor v-model="editForm.content"></quill-editor>
              </el-form-item>
                
            </el-form>
            <!-- 底部区域 -->
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editArticle">确 定</el-button>
            </div>
        </el-dialog>

      </el-card>
  </div>
</template>

<script>
export default {
    created() {
        this.getArticleList();
    },
    data() {
        return {
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

            // 控制修改用户对话框的显示与隐藏
            editDialogVisible: false,
            // 修改用户表单
            editForm: {
              author: {}
            },
            editFormRules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                author: [
                    { required: true, message: '请输入作者', trigger: 'blur' }
                ]
            },
        }
    },
    methods: {
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
        // 跳转到添加文章页面
        goAddArticle() {
          window.sessionStorage.activePath = '/admin/addArticles';
          
          this.$router.push('/admin/addArticles');
        },
        // 监听修改文章对话框关闭事件
        editDialogClosed() {
          // 重置表单
          this.$refs.editFormRef.resetFields();
          this.editForm.role = '';
        },
        // 展示修改用户对话框（根据id查询用户）
        async showEditDialog(article) {
          // console.log(article);
          // 根据id查询文章信息
          const res = await this.$http.get('admin/findArticle/' + article._id);
          // console.log(res);
          if(res.status !== 200){
            return this.$message.error('查询文章信息失败！');
          }
          this.editForm = res.data.data;
          
          this.editDialogVisible = true;
        },
        // 修改文章
        async editArticle() {
          // 先进行预校验
          this.$refs.editFormRef.validate(async valid => {
            // 校验不通过
            if(!valid){
                return;
            }
            console.log(this.editForm);
            const res = await this.$http.put('admin/editArticle/' + this.editForm._id, this.editForm);
            console.log(res);

            if(res.status !== 200) return;
            this.editDialogVisible = false;

            this.getArticleList();
            this.$message.success('修改文章成功！');
          });
        },
        // 删除用户
        async deleteArticle(id) {
          const confirmResult = await this.$confirm('确定删除该文章吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);

          if(confirmResult !== 'confirm'){
            return;
          }

          const res = await this.$http.delete('admin/deleteArticle/' + id);
          if(res.status !== 200){
            return this.$message.error('删除文章失败！');
          }

          this.$message.success('删除文章成功！');
          this.getArticleList();
        }
    }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
}
.el-table {
    margin-top: 15px;
    font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>