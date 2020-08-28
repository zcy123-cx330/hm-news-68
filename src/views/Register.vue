<template>
  <div>
    <hm-header>注册</hm-header>
    <hm-log></hm-log>
    <!-- 注册 -->
    <van-form @submit="register">
      <van-field
        v-model="user.username"
        name="用户名"
        label="用户名/手机号"
        placeholder="请输入账号"
        :rules="rules.username"
      />
      <van-field
        v-model="user.nickname"
        name="用户名"
        label="昵称"
        placeholder="请输入昵称"
        :rules="rules.nickname"
      />
      <van-field
        v-model="user.password"
        type="password"
        name="密码"
        label="密码"
        placeholder="请输入密码"
        :rules="rules.password"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          注册
        </van-button>
      </div>
      <p class="tips">
        已有账号？ 去 <router-link to="/login">登录</router-link>
      </p>
    </van-form>
  </div>
</template>

<script>
// 入口
// import axios from 'axios'

export default {
  data() {
    return {
      user: {
        username: '',
        nickname: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'onChange' },
          {
            pattern: /^\d{5,11}$/,
            message: '用户名长度是5-11位数字',
            trigger: 'onChange'
          }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'onChange' },
          {
            pattern: /^[\u4e00-\u9fa5]{2,6}$/,
            message: '昵称必须是2-6位的中文',
            trigger: 'onChange'
          }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'onChange' },
          {
            pattern: /^\d{3,9}$/,
            message: '密码长度是3-9位数字',
            trigger: 'onChange'
          }
        ]
      }
    }
  },
  methods: {
    async register() {
      const res = await this.$axios.post('/register', this.user)
      // 解构
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        // 注册成功提示并返回到login
        this.$toast.success(message)
        this.$router.push('/login')
      } else {
        // 注册失败提示
        this.$toast.fail(message)
      }
    }
  }
}
</script>

<style></style>
