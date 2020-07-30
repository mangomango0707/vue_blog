<template>
  <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区域 -->
      <el-card>

        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button  slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>

        <!-- 用户列表区域 -->
        <el-table :data="userList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="role" label="角色"></el-table-column>
          <el-table-column label="状态">
            <!-- 通过作用域插槽渲染状态列 -->
            <template slot-scope="scope">
              <el-switch v-model="scope.row.state" @change="userStateChanged(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <!-- 通过作用域插槽渲染操作列 -->
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row._id)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row._id)"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                      :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                      layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 添加用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
          <!-- 内容主体区域 -->
          <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
              <el-form-item label="用户名" prop="username">
                  <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                  <el-input v-model="addForm.email" placeholder="请输入邮箱" type="email"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                  <el-input v-model="addForm.password" placeholder="请输入密码" type="password"></el-input>
              </el-form-item>
              <!-- 用户头像上传 -->
              <el-form-item label="头像">
                <!-- <el-upload class="avatar-uploader"
                  action="http://127.0.0.1:8081/admin/addUser" :show-file-list="false" ref="upload" 
                  :on-success="handleAvatarSuccess">
                  <img v-if="addForm.avatar" :src="addForm.avatar" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload> -->
                <el-upload action="http://127.0.0.1:8081/admin/addUser" :http-request="addUser" ref="upload" :auto-upload="false">
                      <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
              </el-form-item>
              <el-form-item label="角色">
                  <el-select v-model="addForm.role" clearable placeholder="请选择用户角色">
                    <el-option v-for="item in roleOptions" :key="item.value" :label="item.label"
                      :value="item.label">
                    </el-option>
                  </el-select>
              </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 修改用户对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
          <!-- 内容主体区域 -->
          <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
              <el-form-item label="用户名" prop="username">
                  <el-input v-model="editForm.username" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editForm.email" placeholder="请输入邮箱" type="email"></el-input>
              </el-form-item>
              <el-form-item label="角色">
                  <el-select v-model="editForm.role" clearable placeholder="请选择用户角色">
                    <el-option v-for="item in roleOptions" :key="item.value" :label="item.label"
                      :value="item.label">
                    </el-option>
                  </el-select>
              </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <div slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
          </div>
        </el-dialog>

      </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList();
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
      // 用户数据
      userList: [],
      // 用户数据总数
      total: 0,

      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,

      // 添加表单
      addForm: {
        username: '',
        email: '',
        password: '',
        avatar: '',
        role: ''
      },
      addFormRules: {
        username: [
          {required: true, message:'请输入用户名', trigger: 'blur'},
          { min: 2, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          {required: true, message:'请输入邮箱地址', trigger: 'blur'},
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ] ,
        role: [
          { required: true, message: '请选择角色', trigger: 'blur' },
        ]       
      },
      roleOptions: [
        {
          value: 1,
          label: 'admin'
        },
        {
          value: 2,
          label: 'normal'
        }
      ],

      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 修改用户表单
      editForm: {},
      editFormRules: {
        username: [
          {required: true, message:'请输入用户名', trigger: 'blur'},
          { min: 2, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          {required: true, message:'请输入邮箱地址', trigger: 'blur'},
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'blur' },
        ]       
      },
      // 图片地址前缀
      baseURL: 'http://localhost:8081/public'

    }
  },
  methods: {
    // 获取用户列表数据
    async getUserList() {
      const res = await this.$http.get('admin/users', {params: this.queryInfo});
      console.log(res);
      if(res.status !== 200){
        return this.$message.error('获取用户数据失败！');
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 监听状态的变化
    async userStateChanged(user) {
      // 请求改变用户状态
      console.log(user.state);
      const res = await this.$http.put(`admin/users/${user._id}/state/${user.state}`);
      console.log(res);
      if(res.data.code !== 1){
          user.tate = !user.state;
          return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！');
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听当前页码改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },

    // 监听添加用户对话框关闭事件
    addDialogClosed() {
      // 重置表单
      this.$refs.addFormRef.resetFields();
      this.addForm.role = '';
      this.addForm.avatar = '';
    },
    // 添加用户
    addUser() {

      var formData = new FormData();
      var file = this.$refs.upload.uploadFiles[0];
      var headerConfig = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };
      console.log(file);

      formData.append('file', file.raw);
      formData.append('username', this.addForm.username);
      formData.append('email', this.addForm.email);
      formData.append('password', this.addForm.password);
      formData.append('role', this.addForm.role);

      // console.log(formData.get('file'));
      // 先进行预校验
            this.$refs.addFormRef.validate(async valid => {
                // 校验不通过
                if(!valid){
                    return;
                }
                console.log(this.addForm);
                // 校验通过，发送请求
                const res = await this.$http.post('admin/addUser', formData, headerConfig);
                console.log(res);
                if(res.data.code !== 1){
                    return this.$message.error('添加用户失败');
                }
                this.$message.success('添加用户成功');
                formData.set('file', '');
                file = null;
                this.addDialogVisible = false;
                this.getUserList();
            });
    },

    // 监听修改用户对话框关闭事件
    editDialogClosed() {
      // 重置表单
      this.$refs.editFormRef.resetFields();
      this.editForm.role = '';
    },
    // 展示修改用户对话框（根据id查询用户）
    async showEditDialog(id) {
      // console.log(id);
      // 根据id查询用户信息
      const res = await this.$http.get('admin/findUser/' + id);
      console.log(res);
      if(res.status !== 200){
        return this.$message.error('查询用户信息失败！');
      }
      this.editForm = res.data.data;
      this.editDialogVisible = true;
    },
    // 修改用户
    async editUser() {
      // console.log(this.editForm);
      // 先进行预校验
      this.$refs.editFormRef.validate(async valid => {
          // 校验不通过
          if(!valid){
              return;
          }
          const res = await this.$http.put('admin/editUser/' + this.editForm._id, {username: this.editForm.username, email: this.editForm.email, role: this.editForm.role});
          console.log(res);
          if(res.status !== 200) return;

          this.editDialogVisible = false;
          this.getUserList();
          this.$message.success('修改数据成功！');
      });
    },
    // 删除用户
    async deleteUser(id) {
      const confirmResult = await this.$confirm('确定删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);

      if(confirmResult !== 'confirm'){
        return;
      }

      const res = await this.$http.delete('admin/deleteUser/' + id);
      if(res.status !== 200){
        return this.$message.error('删除用户失败！');
      }

      this.$message.success('删除用户成功！');
      this.getUserList();
    },
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
.el-select {
  width: 100%;
}
// 头像上传
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
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
</style>