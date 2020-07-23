<template>
  <div class="login_container">
      <h1 class="title">Welcome To Mango Blog</h1>
      <div class="login_box">
          <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/login.png" alt="">
            </div>
          <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                 <!-- 邮箱 -->
                <el-form-item prop="email">
                    <el-input v-model="loginForm.email" prefix-icon="iconfont icon-youxiang" type="email" placeholder="请输入邮箱地址"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-mima" placeholder="请输入密码"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <!-- <el-form-item class="link">
                    
                </el-form-item> -->
                <el-form-item class="btns">
                    <el-link class="link" icon="el-icon-edit" type="primary" @click="goRegister">还没有账号，先注册</el-link>
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
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
            loginForm: {
                email: 'admin@163.com',
                password: '123456'
            },
            loginFormRules: {
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
        login() {
            // 先进行预校验
            this.$refs.loginFormRef.validate(async valid => {
                // 预校验不通过
                if(!valid){
                    return;
                }
                // 校验通过
                // 发送请求
                const res = await this.$http.post('home/login', this.loginForm);
                console.log(res);
                if(res.data.code !== 1){
                    return this.$message.error('登录失败');
                }
                console.log(res);
                this.$message.success('登录成功');

                // 将服务端返回的token保存到sessionStorage中
                window.sessionStorage.setItem("token", res.data.token);

                // 根据用户身份：管理员或普通用户，跳转到相应页面
                if(res.data.data.role === 'admin'){
                    this.$router.push("/admin/manage");
                }else{
                    this.$router.push("/home");
                }
            })
        },
        resetLoginForm() {
            // 重置表单
            this.$refs.loginFormRef.resetFields();
        },
        // 转到注册页面
        goRegister() {
            this.$router.push('/home/register');
        }
    }
}
</script>

<style lang="less" scoped>
.login_container {
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
    top: 5%;
    // 位移
    transform: translate(-50%, -10%);
}
.login_box {
    width: 450px;
    height: 300px;
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
.login_form {
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
}
</style>


