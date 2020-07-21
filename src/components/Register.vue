<template>
  <div class="register_container">
      <h1 class="title">Welcome To Mango Blog</h1>
      <div class="register_box">
          <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/login.png" alt="">
            </div>
          <!-- 注册表单区域 -->
            <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules" label-width="0px" class="register_form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="registerForm.username" placeholder="请输入用户名" prefix-icon="iconfont icon-yonghu"></el-input>
                </el-form-item>
                <!-- 邮箱 -->
                <el-form-item prop="email">
                    <el-input v-model="registerForm.email" type="email" placeholder="请输入邮箱地址" prefix-icon="iconfont icon-youxiang"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" prefix-icon="iconfont icon-mima"></el-input>
                </el-form-item>

                <!-- 按钮 -->
                <el-form-item>
                    <el-link class="link" icon="el-icon-edit" type="primary" @click="goLogin">已经注册，去登录</el-link>
                    <el-button type="primary" @click="register">注册</el-button>
                    <el-button type="info" @click="resetRegisterForm">重置</el-button>
                </el-form-item>
            </el-form>
      </div>
  </div>
</template>

<script>
export default {
    created() {
        
    },
    data() {
        return {
            registerForm: {
                username: '',
                email: '',
                password: ''
            },
            registerFormRules: {
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
                ]
            }
        }
    },
    methods: {
        // 注册
        register() {
            // 先进行预校验
            this.$refs.registerFormRef.validate(async valid => {
                // 校验不通过
                if(!valid){
                    return;
                }
                // 校验通过，发送请求
                const res = await this.$http.post('home/register', this.registerForm);
                console.log(res);
                if(res.data.code !== 1){
                    return this.$message.error('注册失败');
                }
                this.$message.success('注册成功');
                // 定向到登录页面
                this.$router.push('/home/login');
            });
        },
        // 重置表单
        resetRegisterForm() {
            this.$refs.registerFormRef.resetFields();
        },
        // 转到登录页面
        goLogin() {
            this.$router.push('/home/login');
        }
    },
}
</script>

<style lang="less" scoped>
.register_container {
    height: 100%;
    background-image: url('../assets/background.jpg');
    // background-size:100% 100%;
    margin: 0 auto;
}
.title {
    color: #ffffff;
    text-align: center;
    margin-top: 0;
    padding-top: 120px;

    // 字体间隔
    // letter-spacing: 3px;

    // 字体样式
    font:italic 1em Georgia, serif;
    font-size: 42px;
    position: absolute;
    left: 50%;
    top: 0%;
    // 位移
    transform: translate(-50%, -10%);
}
.register_box {
    width: 450px;
    height: 360px;
    background-color: #fff;
    border-radius: 3%;
    // 将绝对定位的盒子放中间
    position: absolute;
    left: 50%;
    top: 50%;
    // 位移
    transform: translate(-50%, -50%);
}
.avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
    }
}
.register_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.link {
    // display: flex;
    // justify-content: space-between;
    margin-right: 110px;
}
.btns {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
</style>