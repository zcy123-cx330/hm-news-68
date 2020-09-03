<template>
  <div class="user">
      <div class="header" @click="$router.push('/user-edit')">
          <div class="avatar">
              <img :src="base + user.head_img" alt="">
          </div>
          <div class="info">
              <div class="name">
                  <!-- <span v-if="user.gender === 1" class="iconfont iconxingbienan"></span>
                  <span v-else class="iconfont iconxingbienv"></span> -->

                  <!-- 三元表达式写法 -->
                  <span class="iconfont" :class="user.gender === 1 ? 'iconxingbienan'
                  : 'iconxingbienv' "></span>
                  <span>{{user.nickname}}</span>
              </div>
              <div class="time">
                  {{user.create_date | time}}
              </div>
          </div>
          <div class="arrow">
              <span class="iconfont iconjiantou1"></span>
          </div>
      </div>
      <!-- 导航条 -->
      <hm-navitem to="/my-follow">
          <template>我的关注</template>
          <template #content>关注的用户</template>
      </hm-navitem>
      <hm-navitem  to="/mycomment">
          <template>我的跟帖</template>
          <template #content>跟帖/回复</template>
      </hm-navitem>
      <hm-navitem>
          <template>我的收藏</template>
          <template #content>文章/视频</template>
      </hm-navitem>
      <hm-navitem to="/user-edit">
          设置
      </hm-navitem>
      <div style="margin: 15px" @click="logout">
          <van-button type="primary" block>退出</van-button>
      </div>
  </div>
</template>

<script>
export default {
  computed: {
    base() {
      return this.$axios.defaults.baseURL
    }
  },
  data() {
    return {
      user: ''
    }
  },
  async created() {
    // const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const res = await this.$axios.get(`/user/${userId}`)
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.user = data
    }
  },
  methods: {
    //   如果await promise报错，需要使用try...catch捕获异常
    async logout() {
    // 弹出框提示
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '你确定要退出吗'
        })
      } catch {
        return this.$toast('取消退出')
      }
      // 说明点了确认
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      this.$router.push('/login')
      this.$toast.success('退出成功')
    }
  }
}
</script>

<style lang="less" scoped>
.user {
    .header {
        display: flex;
        align-items: center;
        padding: 20px 10px;
        border-bottom:3px solid #ddd ;
        .avatar {
            width: 70px;
            height: 70px;
            img {
                border-radius: 50%;
                width: 100%;
                height: 100%;
            }
        }
        .info {
            flex: 1;
            padding-left: 10px;
            font-size: 14px;
        }
        .iconxingbienan {
            color: #7bbcec;
        }
        .iconxingbienv {
            color: pink;
        }
    }
}
</style>
